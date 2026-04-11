import { RefreshCw, Settings, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  createManualBackup,
  deleteRestorePoint,
  executeRollback,
  getRestorePoints,
  saveBackupSettings,
} from "../../services/BackupService";

/*
  AdminBackupsPage
  ─────────────────────────────────────────────────────────────────────────────
  MATCHES PROTOTYPES (in order of interaction):
    ADMIN - BACKUPS.png              → main grid of restore point cards
    ADMIN - RESTORE.png              → Restore Point Details (sub-view, not modal)
    ADMIN - RESTORE #1.png           → Rollback Analysis modal
    ADMIN - RESTORE SELECT TABLES.png→ Select Tables modal (selective rollback only)
    ADMIN - RESTORE FINAL.png        → Final Confirmation modal
    ADMIN - RESTORE PROGRESS.png     → Auth Required modal
    ADMIN - RESTORE PROGRESS-1.png   → "Rollback in Progress" fullscreen
    ADMIN - RESTORE PROGRESS-2.png   → "Rollback Completed" fullscreen

  STATE MACHINE:
    The restore flow is a linear multi-step wizard controlled by `flowStep`:

      null         → Backups list (main view)
      "details"    → Restore Point Details sub-view (inline, replaces list)
      "analysis"   → Modal: Rollback Analysis (Impact + Options)
      "tables"     → Modal: Select Tables (selective mode only)
      "finalConfirm" → Modal: Final Confirmation (critical warning)
      "auth"       → Modal: Authentication Required (password + reason)
      "progress"   → Fullscreen overlay: Rollback in Progress
      "completed"  → Fullscreen overlay: Rollback Completed

  The selected restore point is stored in `activePoint` throughout the flow.
  rollbackOptions holds the user's choices from the Analysis step.

  BACKUP SETTINGS:
    Clicking "Backup Settings" in the header opens the BackupSettingsModal,
    which is the same component used on the Admin Dashboard.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ─────────────────────────────────────────────────────────────────────────────
// ── STEP MODALS (each matches one prototype screen) ───────────────────────────
// ─────────────────────────────────────────────────────────────────────────────

// ── Backup Settings Modal (reused from Dashboard) ─────────────────────────────
const BackupSettingsModal = ({ isOpen, onClose }) => {
  const [enabled,   setEnabled]   = useState(true);
  const [frequency, setFrequency] = useState(24);
  const [saving,    setSaving]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try { await saveBackupSettings({ enabled, frequencyHours: frequency }); onClose(); }
    finally { setSaving(false); }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-custom-gray-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-custom-black">Backup Settings</h2>
          <button onClick={onClose} className="text-custom-gray hover:text-custom-black text-xl">✕</button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-custom-gray-2">
          <div className="p-8">
            <h3 className="text-sm font-semibold text-custom-gray uppercase tracking-wider mb-6">Automatic Backup Settings</h3>
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="w-4 h-4 accent-custom-primary" />
              <span className="text-sm text-custom-black font-medium">Enable Automatic Backup</span>
            </label>
            <p className="text-xs text-custom-gray font-semibold uppercase tracking-wider mb-3">Frequency:</p>
            {[6, 12, 24].map((h) => (
              <label key={h} className="flex items-center gap-3 mb-2 cursor-pointer">
                <input type="radio" checked={frequency === h} onChange={() => setFrequency(h)} disabled={!enabled} className="accent-custom-primary" />
                <span className={`text-sm ${!enabled ? "text-custom-gray" : "text-custom-black"}`}>Every {h} hours</span>
              </label>
            ))}
          </div>
          <div className="p-8">
            <h3 className="text-sm font-semibold text-custom-gray uppercase tracking-wider mb-6">Storage Settings</h3>
            <p className="text-sm text-custom-gray italic">TO BE ADDED</p>
          </div>
        </div>
        <div className="px-8 py-5 border-t border-custom-gray-2 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-sm border border-custom-gray-2 text-custom-gray rounded-md hover:bg-custom-gray-2">Discard Changes</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium rounded-md">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Rollback Analysis Modal ────────────────────────────────────────────────────
// Prototype: ADMIN - RESTORE #1.png
// Shows impact analysis, rollback options (full vs selective), safety checkboxes.
// "Continue to confirmation" → advances to "tables" (if selective) or "finalConfirm"
const RollbackAnalysisModal = ({ point, onCancel, onContinue }) => {
  const [rollbackType, setRollbackType] = useState("full"); // "full" | "selective"
  const [options, setOptions] = useState({
    preBackup:         true,
    verifyIntegrity:   true,
    notifyAll:         false,
    exportTransactions:true,
    saveDeletedToArchive: true,
  });

  const toggleOption = (key) =>
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));

  // Estimate the data that will be lost (mock — real data from API)
  const totalAffected = 37;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">

        {/* Header */}
        <div className="bg-custom-yellow/10 border-b border-custom-yellow/30 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠</span>
            <h2 className="text-lg font-bold text-custom-black">
              Rollback Analysis — {point.label}
            </h2>
            <span className="text-2xl">⚠</span>
          </div>
          <button onClick={onCancel} className="text-custom-gray hover:text-custom-black text-xl">✕</button>
        </div>

        <div className="p-8 grid grid-cols-2 gap-8">

          {/* Left: Impact Analysis */}
          <div>
            <h3 className="text-sm font-bold text-custom-black uppercase tracking-wider mb-4">Impact Analysis</h3>
            <p className="text-xs text-custom-gray mb-3">Data changes since this point:</p>
            <div className="text-custom-yellow text-xs font-semibold mb-3 flex items-center gap-1.5">
              <span>⚠</span> WARNING: The following data will be LOST
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-custom-black">
              <div>
                <p className="font-bold text-custom-gray uppercase mb-2">PRODUCTS:</p>
                <p>• 0 ITEMS added</p>
                <p>• 0 ITEMS removed</p>
                <p>• 0 ITEMS edited</p>
              </div>
              <div>
                <p className="font-bold text-custom-gray uppercase mb-2">TRANSACTIONS:</p>
                <p>• 35 new transactions</p>
                <p className="font-bold text-custom-red">• Total value: ₱45,230.00</p>
              </div>
              <div>
                <p className="font-bold text-custom-gray uppercase mb-2">USERS:</p>
                <p>• 0 users added</p>
                <p>• 2 users modified</p>
              </div>
              <div>
                <p className="font-bold text-custom-gray uppercase mb-2">DISCOUNTS:</p>
                <p>• 0 discounts added</p>
                <p>• 0 discounts modified</p>
              </div>
            </div>

            <p className="mt-4 text-xs font-bold text-custom-yellow">
              ⚠ Total Records Affected: {totalAffected}
            </p>

            {/* Database Analysis */}
            <div className="mt-6 p-3 bg-custom-gray-2/50 rounded-lg text-xs text-custom-gray space-y-1">
              <p className="font-bold text-custom-black mb-2">Database Analysis</p>
              <p>- Database size will decrease by ~100MB</p>
              <p>- System downtime: ~5 minutes</p>
              <p>- 35 transactions will be lost</p>
              <p>- Backup available</p>
            </div>
          </div>

          {/* Right: Rollback Options */}
          <div>
            <h3 className="text-sm font-bold text-custom-black uppercase tracking-wider mb-4">Rollback Options</h3>

            <p className="text-xs font-semibold text-custom-gray mb-2">Rollback Type:</p>
            <div className="space-y-2 mb-5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" checked={rollbackType === "full"} onChange={() => setRollbackType("full")} className="accent-custom-primary" />
                Full Rollback (ALL TABLES)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" checked={rollbackType === "selective"} onChange={() => setRollbackType("selective")} className="accent-custom-primary" />
                Selective Rollback (CHOOSE TABLES)
              </label>
            </div>

            <p className="text-xs font-semibold text-custom-gray mb-2">Safety Options:</p>
            <div className="space-y-2 mb-5">
              {[
                { key: "preBackup",         label: "Create backup before rollback (recommended)" },
                { key: "verifyIntegrity",   label: "Verify data integrity after rollback" },
                { key: "notifyAll",         label: "Notify all users" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={options[key]} onChange={() => toggleOption(key)} className="accent-custom-primary" />
                  {label}
                </label>
              ))}
            </div>

            <p className="text-xs font-semibold text-custom-gray mb-2">Export Lost Data:</p>
            <div className="space-y-2 mb-5">
              {[
                { key: "exportTransactions",     label: "Export transactions to CSV before rollback" },
                { key: "saveDeletedToArchive",   label: "Save deleted records to archive" },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-xs cursor-pointer">
                  <input type="checkbox" checked={options[key]} onChange={() => toggleOption(key)} className="accent-custom-primary" />
                  {label}
                </label>
              ))}
            </div>

            <div className="p-3 bg-custom-gray-2/50 rounded-lg text-xs text-custom-gray">
              <p className="font-bold text-custom-black mb-1">Estimated Time</p>
              <p>Backup: ~3 minutes | Rollback: ~5 minutes | Total: ~8 minutes</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-custom-gray-2 flex justify-end gap-3">
          <button onClick={onCancel} className="px-5 py-2 text-sm border border-custom-gray-2 text-custom-gray rounded-md hover:bg-custom-gray-2">
            Cancel restore
          </button>
          <button
            onClick={() => onContinue({ rollbackType, options })}
            className="px-5 py-2 text-sm bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium rounded-md"
          >
            Continue to confirmation →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Select Tables Modal ────────────────────────────────────────────────────────
// Prototype: ADMIN - RESTORE SELECT TABLES.png
// Only shown when rollbackType === "selective"
const SelectTablesModal = ({ onBack, onContinue }) => {
  const ALL_TABLES = [
    { name: "products",     records: 1234,    changes: 0,  size: "450 MB" },
    { name: "transactions", records: 69420,   changes: 35, size: "1.2 GB" },
    { name: "users",        records: 1234,    changes: 0,  size: "450 MB" },
    { name: "discounts",    records: 1234,    changes: 0,  size: "450 MB" },
    { name: "inventory",    records: 1234,    changes: 0,  size: "450 MB" },
    { name: "audit_logs",   records: 1234,    changes: 0,  size: "450 MB" },
  ];

  // transactions is pre-kept (checkbox unchecked = not rolling back = keeping it)
  const [kept, setKept] = useState({ transactions: true });

  const toggleTable = (name) => {
    setKept((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const selectAll   = () => setKept({});
  const deselectAll = () => setKept(Object.fromEntries(ALL_TABLES.map((t) => [t.name, true])));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        <div className="px-8 py-6 border-b border-custom-gray-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-custom-black">Select Tables to Rollback</h2>
          <button onClick={onBack} className="text-custom-gray hover:text-custom-black text-xl">✕</button>
        </div>

        <div className="px-8 py-6">
          <table className="w-full text-sm">
            <thead className="text-[11px] text-custom-gray uppercase border-b border-custom-gray-2">
              <tr>
                <th className="py-2 font-medium text-left">Table Name</th>
                <th className="py-2 font-medium text-right">Record Count</th>
                <th className="py-2 font-medium text-right">Changes</th>
                <th className="py-2 font-medium text-right">Size</th>
                <th className="py-2 font-medium text-center">Rollback?</th>
              </tr>
            </thead>
            <tbody>
              {ALL_TABLES.map((table, i) => {
                const isKept = !!kept[table.name];
                const willRollback = !isKept;
                return (
                  <tr key={table.name} className={i % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"}>
                    <td className="py-3 pr-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={willRollback}
                          onChange={() => toggleTable(table.name)}
                          className="accent-custom-primary"
                        />
                        <span className="font-medium text-custom-black">{table.name}</span>
                      </label>
                    </td>
                    <td className="py-3 text-right text-custom-gray">{table.records.toLocaleString()}</td>
                    <td className="py-3 text-right text-custom-gray">{table.changes}</td>
                    <td className="py-3 text-right text-custom-gray">{table.size}</td>
                    <td className="py-3 text-center">
                      {willRollback
                        ? <span className="text-custom-green font-bold text-lg">✓</span>
                        : <span className="text-custom-red font-bold text-xs">✕ (keep)</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex gap-4 mt-4 text-xs">
            <button onClick={selectAll}   className="text-custom-primary hover:underline">☐ Select All</button>
            <button onClick={deselectAll} className="text-custom-gray hover:underline">☐ Deselect All</button>
          </div>

          <div className="mt-4 space-y-1.5 text-xs">
            <p className="text-custom-yellow font-medium">⚠ Warning: Partial rollback may cause data inconsistency</p>
            <p className="text-custom-blue">● Keeping transactions will preserve recent sales data</p>
          </div>
        </div>

        <div className="px-8 py-5 border-t border-custom-gray-2 flex justify-end gap-3">
          <button onClick={onBack} className="px-5 py-2 text-sm border border-custom-gray-2 text-custom-gray rounded-md hover:bg-custom-gray-2">
            ← Go Back
          </button>
          <button
            onClick={() => onContinue({ keptTables: Object.keys(kept).filter((k) => kept[k]) })}
            className="px-5 py-2 text-sm bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium rounded-md"
          >
            Continue to confirmation →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Final Confirmation Modal ───────────────────────────────────────────────────
// Prototype: ADMIN - RESTORE FINAL.png
// The last summary screen before authentication. Big red warning.
const FinalConfirmModal = ({ point, rollbackOptions, onBack, onExecute }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4">
    <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

      {/* Danger header */}
      <div className="bg-red-50 border-b border-red-200 px-8 py-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">⚠</span>
          <h2 className="text-lg font-bold text-custom-red">Final Confirmation — CRITICAL OPERATION</h2>
          <span className="text-2xl">⚠</span>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Big warning */}
        <div className="flex items-start gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-custom-red shrink-0 mt-1" />
          <div>
            <p className="font-extrabold text-custom-black text-base">YOU ARE ABOUT TO ROLLBACK THE DATABASE</p>
            <p className="text-xs text-custom-gray mt-1">
              This is a critical operation that cannot be easily undone. Review the following information carefully.
            </p>
          </div>
        </div>

        {/* Summary box */}
        <div className="border border-custom-gray-2 rounded-xl p-5 mb-5 text-sm">
          <p className="text-xs font-bold text-custom-gray uppercase tracking-wider mb-3">Rollback Summary</p>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <span className="text-custom-gray text-xs">RESTORE POINT:</span>
              <span className="ml-2 font-semibold text-custom-black">{point.displayId}</span>
            </div>
            <div>
              <span className="text-custom-gray text-xs">RESTORE TYPE:</span>
              <span className="ml-2 font-semibold text-custom-black capitalize">
                {rollbackOptions?.rollbackType === "selective" ? "Selective Rollback" : "Full Database Rollback"}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-custom-gray text-xs">TIME PERIOD:</span>
              <span className="ml-2 font-semibold text-custom-black">
                Going back {Math.round((Date.now() - new Date(point.timestamp)) / (1000 * 60 * 60))} hour(s)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-xs">
          {/* Safety Measures */}
          <div>
            <p className="font-bold text-custom-black mb-2">SAFETY MEASURES:</p>
            <ul className="space-y-1 text-custom-gray list-disc list-inside">
              <li>Pre-rollback backup will be created</li>
              <li>Lost data will be exported to archive</li>
              <li>Transactions will be exported to .csv</li>
              <li>Integrity verification enabled</li>
            </ul>
          </div>
          {/* Data to be Lost */}
          <div>
            <p className="font-bold text-custom-red mb-2">DATA TO BE LOST:</p>
            <ul className="space-y-1 text-custom-gray list-disc list-inside">
              <li>35 transactions (₱69,420.00)</li>
              <li>2 user profile updates</li>
              <li>156 audit log entries</li>
            </ul>
          </div>
          {/* System Impact */}
          <div className="col-span-2">
            <p className="font-bold text-custom-black mb-2">System Impact:</p>
            <ul className="space-y-1 text-custom-gray list-disc list-inside">
              <li>Estimated downtime: 5 minutes</li>
              <li>All users will be logged out</li>
              <li>Active sessions will be terminated</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 border-t border-custom-gray-2 flex justify-end gap-3">
        <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-2 text-sm border border-custom-gray-2 text-custom-gray rounded-md hover:bg-custom-gray-2">
          ← Go Back
        </button>
        <button onClick={onExecute} className="px-5 py-2 text-sm bg-custom-red hover:opacity-90 text-custom-white font-bold rounded-md">
          Execute Rollback
        </button>
      </div>
    </div>
  </div>
);

// ── Auth Required Modal ────────────────────────────────────────────────────────
// Prototype: ADMIN - RESTORE PROGRESS.png (confusingly named — it's actually auth)
// Admin must enter password + reason + check 3 boxes + type "CONFIRM ROLLBACK"
const AuthRequiredModal = ({ onCancel, onConfirm }) => {
  const [password, setPassword]       = useState("");
  const [reason,   setReason]         = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [checks, setChecks] = useState({ c1: false, c2: false, c3: false });
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState(null);

  const allChecked = checks.c1 && checks.c2 && checks.c3;
  const confirmed  = confirmText.trim().toUpperCase() === "CONFIRM ROLLBACK";
  const canSubmit  = password && reason && allChecked && confirmed && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm(password, reason);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] animate-fade-in p-4">
      <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-red-50 border-b border-red-200 px-8 py-5 text-center">
          <p className="text-sm font-bold text-custom-red uppercase tracking-wider">🔒 Authentication Required</p>
        </div>

        <div className="px-8 py-6 space-y-5">
          {error && (
            <div className="text-sm text-custom-red bg-red-50 border border-red-200 px-3 py-2 rounded-md">{error}</div>
          )}

          {/* Admin password */}
          <div>
            <label className="block text-sm font-medium text-custom-black mb-2">Admin Password:</label>
            <input
              type="password"
              placeholder="Enter password here…"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-custom-gray-2 rounded-md px-3 py-2.5 text-sm outline-none focus:border-custom-primary"
            />
          </div>

          {/* Reason (required) */}
          <div>
            <label className="block text-sm font-medium text-custom-black mb-2">Reason for Rollback <span className="text-custom-red">(required)</span>:</label>
            <textarea
              placeholder="Enter reason here…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full border border-custom-gray-2 rounded-md px-3 py-2.5 text-sm outline-none focus:border-custom-primary resize-none"
            />
          </div>

          {/* 3 acknowledgement checkboxes */}
          <div className="space-y-2">
            {[
              { key: "c1", label: "I understand that this action cannot be easily undone" },
              { key: "c2", label: "I have reviewed the impact analysis"                 },
              { key: "c3", label: "I have notified relevant stakeholders"               },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-start gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={checks[key]}
                  onChange={() => setChecks((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className="mt-0.5 accent-custom-primary"
                />
                {label}
              </label>
            ))}
          </div>

          {/* Typed confirmation */}
          <div>
            <label className="block text-sm font-medium text-custom-black mb-2">
              Type <strong>"CONFIRM ROLLBACK"</strong> to proceed:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border border-custom-gray-2 rounded-md px-3 py-2.5 text-sm font-mono outline-none focus:border-custom-red"
              placeholder="CONFIRM ROLLBACK"
            />
          </div>
        </div>

        <div className="px-8 py-5 border-t border-custom-gray-2 flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 border border-custom-gray-2 text-custom-gray text-sm font-medium rounded-md hover:bg-custom-gray-2">
            ✕ CANCEL
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 py-2.5 text-sm font-bold rounded-md transition-colors ${
              canSubmit
                ? "bg-custom-primary hover:bg-custom-primary/80 text-custom-black"
                : "bg-custom-gray-2 text-custom-gray cursor-not-allowed"
            }`}
          >
            {submitting ? "Processing…" : "Execute Rollback"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ── RESTORE POINT CARD (Backups list view) ────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const RestorePointCard = ({ point, onDetails, onDelete }) => {
  const formatted = new Date(point.timestamp).toLocaleString("en-PH", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
  const tagColor =
    point.tag === "IMPORTANT" ? "bg-custom-yellow/20 text-custom-yellow border-custom-yellow/40"
    : point.tag === "MANUAL"  ? "bg-blue-100 text-custom-blue border-blue-200"
    : "bg-custom-gray-2 text-custom-gray border-custom-gray-2";

  return (
    <div className="bg-custom-white border border-custom-gray-2 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-custom-black">{point.label}</p>
          <p className="text-[11px] text-custom-gray mt-0.5">{formatted}</p>
        </div>
        <div className="flex gap-1 shrink-0 flex-wrap justify-end">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tagColor}`}>{point.tag}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-custom-gray-2 text-custom-gray">{point.type}</span>
        </div>
      </div>
      <p className="text-[11px] text-custom-gray">SIZE: <strong className="text-custom-black">{point.size}</strong></p>
      <div className="bg-custom-gray-2/50 rounded-lg p-3 text-[11px] text-custom-gray space-y-0.5">
        <p className="font-semibold text-custom-black text-[10px] uppercase tracking-wider mb-1">Database State</p>
        <p>• ITEMS: <strong className="text-custom-black">{point.dbState.items.toLocaleString()} in stock</strong></p>
        <p>• TRANSACTIONS: <strong className="text-custom-black">{point.dbState.records.toLocaleString()} records</strong></p>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className={`font-semibold ${point.integrityCheck === "PASSED" ? "text-custom-green" : "text-custom-red"}`}>
          Integrity Check: {point.integrityCheck}
        </span>
        <span className="text-custom-gray">
          Encryption: <strong className="text-custom-black">{point.encryptionEnabled ? "ENABLED" : "DISABLED"}</strong>
        </span>
      </div>
      <div className="flex gap-2 mt-auto pt-2 border-t border-custom-gray-2">
        <button onClick={() => onDetails(point)} className="flex-1 text-xs font-semibold py-1.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black rounded-md transition-colors">
          Details
        </button>
        <button onClick={() => onDelete(point.id)} className="flex-1 text-xs font-semibold py-1.5 border border-custom-red text-custom-red hover:bg-red-50 rounded-md transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ── RESTORE POINT DETAILS (sub-view, not a modal) ────────────────────────────
// Prototype: ADMIN - RESTORE.png
// ─────────────────────────────────────────────────────────────────────────────
const RestorePointDetails = ({ point, onBack, onStartRestore }) => {
  const formatted = new Date(point.timestamp).toLocaleString("en-PH", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });

  // The five "state summary" boxes from the prototype
  const boxes = [
    { label: "PRODUCTS",     changes: point.changes.products     },
    { label: "TRANSACTIONS", changes: point.changes.transactions },
    { label: "ACCOUNTS",     changes: point.changes.accounts     },
    { label: "REQUESTS",     changes: point.changes.requests     },
    { label: "DISCOUNTS",    changes: point.changes.discounts    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-custom-gray hover:text-custom-black mb-6 transition-colors">
        ← Back to Backups
      </button>

      <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none mb-1">
        Restore Point Details
      </h1>

      {/* Header row */}
      <div className="flex items-start justify-between mt-6 mb-4">
        <div>
          <p className="text-xl font-bold text-custom-black">{point.label}</p>
          <p className="text-sm text-custom-gray mt-1">TAG: <strong className="text-custom-black">{point.tag}</strong></p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-custom-black">{formatted}</p>
          <p className="text-sm text-custom-gray mt-1">{point.type}</p>
        </div>
      </div>

      {/* 5 change-summary boxes */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {boxes.map(({ label, changes }) => (
          <div key={label} className="border border-custom-gray-2 rounded-xl p-4">
            <p className="text-[11px] font-bold text-custom-gray uppercase tracking-wider mb-3">{label}</p>
            <div className="text-xs text-custom-black space-y-1">
              <p>• <span className="text-custom-green">{changes.added}</span> ITEMS added</p>
              <p>• <span className="text-custom-red">{changes.removed}</span> ITEMS removed</p>
              <p>• <span className="text-custom-blue">{changes.edited}</span> ITEMS edited</p>
            </div>
          </div>
        ))}
      </div>

      {/* Integrity + size + encryption row */}
      <div className="flex items-center justify-between py-5 border-t border-b border-custom-gray-2 mb-8">
        <span>
          INTEGRITY CHECK:{" "}
          <strong className={point.integrityCheck === "PASSED" ? "text-custom-green" : "text-custom-red"}>
            {point.integrityCheck}
          </strong>
        </span>
        <span className="text-custom-black font-bold">SIZE: {point.size}</span>
        <span>
          ENCRYPTION:{" "}
          <strong className="text-custom-black">{point.encryptionEnabled ? "ENABLED" : "DISABLED"}</strong>
        </span>
      </div>

      {/* Action buttons — matching the prototype footer */}
      <div className="flex items-center gap-4">
        <p className="text-sm text-custom-gray font-medium">Actions:</p>
        <button
          onClick={onStartRestore}
          className="flex items-center gap-2 px-5 py-2.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black text-sm font-medium rounded-md transition-colors shadow-sm"
        >
          + Restore to this state
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 border border-custom-red text-custom-red hover:bg-red-50 text-sm font-medium rounded-md transition-colors">
          🗑 Delete restore point
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ── MAIN PAGE ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
const AdminBackupsPage = () => {
  const [restorePoints, setRestorePoints] = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isCreating,    setIsCreating]    = useState(false);
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [feedback,      setFeedback]      = useState(null);

  // ── Filters ─────────────────────────────────────────────────────────────
  const [tagFilter, setTagFilter] = useState("All");
  const [sortBy,    setSortBy]    = useState("Newest");
  const [dateFrom,  setDateFrom]  = useState("");
  const [dateTo,    setDateTo]    = useState("");

  // ── Restore flow state machine ───────────────────────────────────────────
  // null | "details" | "analysis" | "tables" | "finalConfirm" | "auth" | "progress" | "completed"
  const [flowStep,       setFlowStep]       = useState(null);
  const [activePoint,    setActivePoint]    = useState(null);  // the point being restored
  const [rollbackOptions,setRollbackOptions]= useState(null);  // choices from analysis step

  // Check if a restore point was pre-selected from the Admin Dashboard
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_selected_restore_point");
    if (stored) {
      try {
        const point = JSON.parse(stored);
        setActivePoint(point);
        setFlowStep("details");
      } catch (_) {}
      sessionStorage.removeItem("admin_selected_restore_point");
    }
  }, []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchPoints = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRestorePoints();
      setRestorePoints(data);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPoints(); }, [fetchPoints]);

  // ── Create Manual Backup ─────────────────────────────────────────────────
  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const result = await createManualBackup();
      setFeedback({ type: "success", message: result.message });
      await fetchPoints();
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsCreating(false);
    }
  };

  // ── Delete (with confirm) ─────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restore point? This cannot be undone.")) return;
    try {
      await deleteRestorePoint(id);
      setRestorePoints((prev) => prev.filter((p) => p.id !== id));
      setFeedback({ type: "success", message: "Restore point deleted." });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  // ── Rollback flow handlers ────────────────────────────────────────────────

  // After Analysis modal, user chose options → go to tables (selective) or finalConfirm
  const handleAnalysisContinue = (opts) => {
    setRollbackOptions(opts);
    if (opts.rollbackType === "selective") {
      setFlowStep("tables");
    } else {
      setFlowStep("finalConfirm");
    }
  };

  // After Select Tables → go to finalConfirm
  const handleTablesContinue = (tableChoices) => {
    setRollbackOptions((prev) => ({ ...prev, ...tableChoices }));
    setFlowStep("finalConfirm");
  };

  // Final Confirm → go to auth
  const handleFinalConfirmExecute = () => setFlowStep("auth");

  // Auth confirmed → execute the actual rollback
  const handleAuthConfirm = async (password, reason) => {
    setFlowStep("progress"); // show progress screen immediately

    // The mock executeRollback waits 2 seconds then resolves
    await executeRollback(
      activePoint.id,
      rollbackOptions?.keptTables ?? null,
      password,
      reason
    );

    setFlowStep("completed");
  };

  // After "Completed" — reset everything back to list
  const handleFlowDone = () => {
    setFlowStep(null);
    setActivePoint(null);
    setRollbackOptions(null);
    fetchPoints(); // re-fetch since the DB has theoretically changed
  };

  // ── Derived: filtered + sorted list ──────────────────────────────────────
  const displayed = restorePoints
    .filter((p) => {
      const matchesTag  = tagFilter === "All" || p.tag === tagFilter;
      const dateStr     = p.timestamp.split("T")[0];
      const matchesFrom = !dateFrom || dateStr >= dateFrom;
      const matchesTo   = !dateTo   || dateStr <= dateTo;
      return matchesTag && matchesFrom && matchesTo;
    })
    .sort((a, b) =>
      sortBy === "Newest"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER — the "progress" and "completed" steps take over the full viewport
  // ─────────────────────────────────────────────────────────────────────────

  // Fullscreen: Rollback in Progress
  if (flowStep === "progress") {
    return (
      <div className="fixed inset-0 bg-custom-white flex flex-col items-center justify-center z-[100]">
        <div className="text-center">
          <div className="flex items-center gap-3 text-2xl font-bold text-custom-black mb-8">
            <span className="text-custom-yellow text-3xl">⚠</span>
            Rollback in Progress
            <span className="text-custom-yellow text-3xl">⚠</span>
          </div>
          {/* Animated progress bar */}
          <div className="w-80 h-2 bg-custom-gray-2 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-custom-primary animate-pulse rounded-full" style={{ width: "60%" }} />
          </div>
          <p className="text-sm text-custom-gray mt-6">
            Please do not close this window. This may take several minutes.
          </p>
        </div>
      </div>
    );
  }

  // Fullscreen: Rollback Completed
  if (flowStep === "completed") {
    return (
      <div className="fixed inset-0 bg-custom-white flex flex-col items-center justify-center z-[100]">
        <div className="text-center">
          <div className="flex items-center gap-3 text-2xl font-bold text-custom-black mb-8">
            <span className="text-custom-green text-3xl">✓</span>
            Rollback Completed
            <span className="text-custom-green text-3xl">✓</span>
          </div>
          <p className="text-sm text-custom-gray mb-8">
            The database has been successfully restored to {activePoint?.label}.
          </p>
          <button
            onClick={handleFlowDone}
            className="px-6 py-3 bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium rounded-md transition-colors"
          >
            Return to Backups
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── If a restore point is selected, show the Details sub-view ─── */}
      {flowStep === "details" && activePoint ? (
        <RestorePointDetails
          point={activePoint}
          onBack={() => { setFlowStep(null); setActivePoint(null); }}
          onStartRestore={() => setFlowStep("analysis")}
        />
      ) : (

        /* ── Otherwise, show the main Backups list ─────────────────────── */
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none">
                Backup and Restore Point
              </h1>
              <p className="text-custom-gray text-sm mt-1">The list of all restore points available</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex items-center gap-2 text-sm bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium px-4 py-2.5 rounded-md transition-colors shadow-sm"
              >
                {isCreating ? "Creating…" : "+ Create Manual Backup"}
              </button>
              <button className="flex items-center gap-2 text-sm border border-custom-gray-2 text-custom-gray hover:text-custom-black px-4 py-2.5 rounded-md transition-colors">
                <Upload size={14} /> Import Backup
              </button>
              <button
                onClick={() => setSettingsOpen(true)}
                className="flex items-center gap-2 text-sm border border-custom-gray-2 text-custom-gray hover:text-custom-black px-4 py-2.5 rounded-md transition-colors"
              >
                <Settings size={14} /> Backup Settings
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-gray outline-none"
            >
              <option value="All">Filter By: All</option>
              <option value="AUTO">Auto</option>
              <option value="MANUAL">Manual</option>
              <option value="IMPORTANT">Important</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-gray outline-none"
            >
              <option value="Newest">Sort By: Newest</option>
              <option value="Oldest">Sort By: Oldest</option>
            </select>
            <div className="flex gap-3">
              <div className="relative">
                <span className="absolute -top-4 left-0 text-[10px] text-custom-gray">Date From:</span>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-custom-gray-2 rounded-md px-2 py-1.5 text-sm text-custom-gray outline-none" />
              </div>
              <div className="relative">
                <span className="absolute -top-4 left-0 text-[10px] text-custom-gray">Date To:</span>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="border border-custom-gray-2 rounded-md px-2 py-1.5 text-sm text-custom-gray outline-none" />
              </div>
            </div>
            <button
              onClick={() => { setTagFilter("All"); setSortBy("Newest"); setDateFrom(""); setDateTo(""); }}
              className="text-xs text-custom-red border border-dashed border-custom-red px-3 py-2 rounded-md hover:bg-red-50"
            >
              ✕ Clear filters
            </button>
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              feedback.type === "success"
                ? "bg-green-50 text-custom-green border border-green-200"
                : "bg-red-50 text-custom-red border border-red-200"
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Card grid */}
          {isLoading ? (
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-52 bg-custom-gray-2/50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {displayed.map((point) => (
                <RestorePointCard
                  key={point.id}
                  point={point}
                  onDetails={(p) => { setActivePoint(p); setFlowStep("details"); }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* View More (placeholder — add infinite scroll or larger page size) */}
          {displayed.length > 6 && (
            <div className="flex justify-center mt-6">
              <button className="text-sm text-custom-gray border border-custom-gray-2 px-6 py-2 rounded-md hover:bg-custom-gray-2 transition-colors">
                View More
              </button>
            </div>
          )}
        </>
      )}

      {/* ── RESTORE FLOW MODALS ──────────────────────────────────────────── */}
      {/*
        Each modal in the flow is conditionally rendered based on `flowStep`.
        They stack on top of the page content using fixed positioning + z-index.
      */}

      {/* Step 1: Rollback Analysis */}
      {flowStep === "analysis" && activePoint && (
        <RollbackAnalysisModal
          point={activePoint}
          onCancel={() => setFlowStep("details")}
          onContinue={handleAnalysisContinue}
        />
      )}

      {/* Step 2 (selective only): Select Tables */}
      {flowStep === "tables" && (
        <SelectTablesModal
          onBack={() => setFlowStep("analysis")}
          onContinue={handleTablesContinue}
        />
      )}

      {/* Step 3: Final Confirmation */}
      {flowStep === "finalConfirm" && activePoint && (
        <FinalConfirmModal
          point={activePoint}
          rollbackOptions={rollbackOptions}
          onBack={() => setFlowStep(rollbackOptions?.rollbackType === "selective" ? "tables" : "analysis")}
          onExecute={handleFinalConfirmExecute}
        />
      )}

      {/* Step 4: Authentication Required */}
      {flowStep === "auth" && (
        <AuthRequiredModal
          onCancel={() => setFlowStep("finalConfirm")}
          onConfirm={handleAuthConfirm}
        />
      )}

      {/* Backup Settings Modal */}
      <BackupSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Refresh button (floating) */}
      <button
        onClick={fetchPoints}
        className="fixed bottom-8 right-8 flex items-center gap-2 text-xs bg-custom-black text-custom-white px-4 py-2.5 rounded-full shadow-lg hover:opacity-80 transition-opacity"
      >
        <RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />
        Refresh
      </button>
    </div>
  );
};

export default AdminBackupsPage;
