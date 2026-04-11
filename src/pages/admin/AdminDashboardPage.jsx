import { RefreshCw, Settings, Shield, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  createManualBackup,
  getDatabaseStats,
  getRestorePoints,
  saveBackupSettings,
} from "../../services/BackupService";

/*
  AdminDashboardPage
  ─────────────────────────────────────────────────────────────────────────────
  MATCHES PROTOTYPE: ADMIN - DASHBOARD.png

  LAYOUT:
    1. Stat cards row   — DB Size | Auto-backup | Total Backups | Last Rollback
    2. "Recent Restore Points" — shows the 3 most recent restore point cards
       with search/filter bar, each card has [Details] and [Delete] actions
    3. Quick Actions    — + Create Manual Backup | Import Backup | Backup Settings

  DATA FLOW:
    Mount → getDatabaseStats() + getRestorePoints() in parallel
    "Refresh Status" button → re-fetches both
    "Create Manual Backup" → createManualBackup() → re-fetches
    "Backup Settings" → opens the BackupSettings inline panel

  RESTORE POINT CARDS navigate to /admin/backups when "Details" is clicked
  (we pass navigateTo prop down from the layout — or just use React Router Link).
  ─────────────────────────────────────────────────────────────────────────────
*/

// ── Backup Settings Modal ─────────────────────────────────────────────────────
// Inline modal for the "Backup Settings" quick action button.
const BackupSettingsModal = ({ isOpen, onClose }) => {
  const [enabled,   setEnabled]   = useState(true);
  const [frequency, setFrequency] = useState(24); // hours
  const [saving,    setSaving]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBackupSettings({ enabled, frequencyHours: frequency });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-custom-gray-2 flex items-center justify-between">
          <h2 className="text-xl font-bold text-custom-black">Backup Settings</h2>
          <button onClick={onClose} className="text-custom-gray hover:text-custom-black text-xl">✕</button>
        </div>

        {/* Two-column body matching prototype */}
        <div className="grid grid-cols-2 gap-0 divide-x divide-custom-gray-2">

          {/* Left: Automatic Backup Settings */}
          <div className="p-8">
            <h3 className="text-sm font-semibold text-custom-gray uppercase tracking-wider mb-6">
              Automatic Backup Settings
            </h3>

            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 accent-custom-primary"
              />
              <span className="text-sm text-custom-black font-medium">Enable Automatic Backup</span>
            </label>

            <p className="text-xs text-custom-gray font-semibold uppercase tracking-wider mb-3">
              Frequency:
            </p>
            <div className="space-y-2">
              {[6, 12, 24].map((h) => (
                <label key={h} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={frequency === h}
                    onChange={() => setFrequency(h)}
                    className="accent-custom-primary"
                    disabled={!enabled}
                  />
                  <span className={`text-sm ${!enabled ? "text-custom-gray" : "text-custom-black"}`}>
                    Every {h} hours
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Right: Storage Settings (placeholder as per prototype) */}
          <div className="p-8">
            <h3 className="text-sm font-semibold text-custom-gray uppercase tracking-wider mb-6">
              Storage Settings
            </h3>
            <p className="text-sm text-custom-gray italic">TO BE ADDED</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-custom-gray-2 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm border border-custom-gray-2 text-custom-gray rounded-md hover:bg-custom-gray-2 transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium rounded-md transition-colors"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Restore Point Card ─────────────────────────────────────────────────────────
// A single card in the "Recent Restore Points" grid.
// Matches the card layout in the prototype: title, timestamp, type, size, DB state,
// integrity/encryption, and two action badges (Details / Delete).
const RestorePointCard = ({ point, onDetails, onDelete }) => {
  // Format the timestamp to "YYYY/MM/DD - HH:MM"
  const formatted = new Date(point.timestamp).toLocaleString("en-PH", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });

  // Tag color: AUTO = gray, IMPORTANT = yellow, MANUAL = blue
  const tagColor =
    point.tag === "IMPORTANT" ? "bg-custom-yellow/20 text-custom-yellow border-custom-yellow/40"
    : point.tag === "MANUAL"  ? "bg-blue-100 text-custom-blue border-blue-200"
    : "bg-custom-gray-2 text-custom-gray border-custom-gray-2";

  return (
    <div className="bg-custom-white border border-custom-gray-2 rounded-xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">

      {/* Card header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-custom-black">{point.label}</p>
          <p className="text-[11px] text-custom-gray mt-0.5">{formatted}</p>
        </div>
        <div className="flex gap-1 shrink-0">
          {/* Tag badge */}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${tagColor}`}>
            {point.tag}
          </span>
          {/* Type badge */}
          <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-custom-gray-2 text-custom-gray bg-custom-white">
            {point.type}
          </span>
        </div>
      </div>

      {/* Size */}
      <p className="text-[11px] text-custom-gray">SIZE: <strong className="text-custom-black">{point.size}</strong></p>

      {/* DB State snapshot */}
      <div className="bg-custom-gray-2/50 rounded-lg p-3 text-[11px] text-custom-gray space-y-0.5">
        <p className="font-semibold text-custom-black text-[10px] uppercase tracking-wider mb-1">Database State</p>
        <p>• ITEMS: <strong className="text-custom-black">{point.dbState.items.toLocaleString()} in stock</strong></p>
        <p>• TRANSACTIONS: <strong className="text-custom-black">{point.dbState.records.toLocaleString()} records</strong></p>
      </div>

      {/* Integrity + Encryption */}
      <div className="flex items-center justify-between text-[11px]">
        <span className={`font-semibold ${point.integrityCheck === "PASSED" ? "text-custom-green" : "text-custom-red"}`}>
          Integrity Check: {point.integrityCheck}
        </span>
        <span className="text-custom-gray">
          Encryption: <strong className="text-custom-black">{point.encryptionEnabled ? "ENABLED" : "DISABLED"}</strong>
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto pt-2 border-t border-custom-gray-2">
        <button
          onClick={() => onDetails(point)}
          className="flex-1 text-xs font-semibold py-1.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black rounded-md transition-colors"
        >
          Details
        </button>
        <button
          onClick={() => onDelete(point.id)}
          className="flex-1 text-xs font-semibold py-1.5 border border-custom-red text-custom-red hover:bg-red-50 rounded-md transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const AdminDashboardPage = () => {
  const [stats,         setStats]         = useState(null);
  const [restorePoints, setRestorePoints] = useState([]);
  const [isLoading,     setIsLoading]     = useState(true);
  const [isCreating,    setIsCreating]    = useState(false);
  const [settingsOpen,  setSettingsOpen]  = useState(false);
  const [searchQuery,   setSearchQuery]   = useState("");
  const [tagFilter,     setTagFilter]     = useState("All");
  const [sortBy,        setSortBy]        = useState("Newest");
  const [feedback,      setFeedback]      = useState(null);

  // ── Fetch both stats and restore points in parallel ──────────────────────
  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const [s, rp] = await Promise.all([getDatabaseStats(), getRestorePoints()]);
      setStats(s);
      setRestorePoints(rp);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Create Manual Backup ─────────────────────────────────────────────────
  const handleCreateBackup = async () => {
    setIsCreating(true);
    try {
      const result = await createManualBackup();
      setFeedback({ type: "success", message: result.message });
      await fetchAll(); // re-fetch to show the new point
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsCreating(false);
    }
  };

  // ── Delete (optimistic) ──────────────────────────────────────────────────
  const handleDelete = (id) => {
    // Optimistic remove — the BackupsPage does the confirmed delete flow.
    // From the dashboard, a single click removes it immediately from the list.
    setRestorePoints((prev) => prev.filter((p) => p.id !== id));
    setFeedback({ type: "success", message: "Restore point removed." });
  };

  // Navigate to the Backups page with the selected point — for now we just log
  // because React Router navigation from here requires useNavigate, which we add.
  const handleDetails = (point) => {
    // Store the selected point in sessionStorage so AdminBackupsPage can pick it up
    sessionStorage.setItem("admin_selected_restore_point", JSON.stringify(point));
    window.location.href = "/admin/backups";
  };

  // ── Derived: filter + sort + take first 3 ───────────────────────────────
  const displayed = restorePoints
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || p.label.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q);
      const matchesTag    = tagFilter === "All" || p.tag === tagFilter;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) =>
      sortBy === "Newest"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    )
    .slice(0, 3); // Dashboard shows only the 3 most recent

  return (
    <div className="flex flex-col gap-8 animate-fade-in">

      {/* ── PAGE TITLE ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none">
          Admin Dashboard
        </h1>
        <button
          onClick={fetchAll}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm border border-custom-gray-2 text-custom-gray px-4 py-2 rounded-md hover:text-custom-black hover:bg-custom-gray-2 transition-colors"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh Status
        </button>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
          feedback.type === "success"
            ? "bg-green-50 text-custom-green border border-green-200"
            : "bg-red-50 text-custom-red border border-red-200"
        }`}>
          {feedback.message}
        </div>
      )}

      {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
      {/*
        Four cards matching the prototype exactly:
          [DB Size] [Auto-backup] [Total Backups] [Last Rollback]
        While loading we show skeleton placeholders.
      */}
      <div className="grid grid-cols-4 gap-4">

        {/* Database Size */}
        <div className="bg-custom-white border border-custom-gray-2 rounded-xl p-5">
          <p className="text-xs text-custom-gray font-semibold uppercase tracking-wider mb-2">Database Size</p>
          <p className="text-3xl font-extrabold text-custom-black">
            {isLoading ? "…" : `${stats?.databaseSizeGB} GB`}
          </p>
        </div>

        {/* Auto-backup */}
        <div className="bg-custom-white border border-custom-gray-2 rounded-xl p-5">
          <p className="text-xs text-custom-gray font-semibold uppercase tracking-wider mb-2">Auto-backup</p>
          {isLoading ? (
            <p className="text-xl font-bold text-custom-gray">…</p>
          ) : (
            <>
              <p className={`text-lg font-extrabold ${stats?.autoBackupEnabled ? "text-custom-green" : "text-custom-red"}`}>
                {stats?.autoBackupEnabled ? "✓ Enabled" : "✕ Disabled"}
              </p>
              <p className="text-xs text-custom-gray mt-1">{stats?.backupFrequency}</p>
            </>
          )}
        </div>

        {/* Total Backups */}
        <div className="bg-custom-white border border-custom-gray-2 rounded-xl p-5">
          <p className="text-xs text-custom-gray font-semibold uppercase tracking-wider mb-2">Total Backups</p>
          <p className="text-3xl font-extrabold text-custom-black">
            {isLoading ? "…" : `${stats?.totalBackups} Backups`}
          </p>
        </div>

        {/* Last Rollback */}
        <div className="bg-custom-white border border-custom-gray-2 rounded-xl p-5">
          <p className="text-xs text-custom-gray font-semibold uppercase tracking-wider mb-2">Last Rollback</p>
          <p className="text-3xl font-extrabold text-custom-black">
            {isLoading ? "…" : `${stats?.lastRollbackDays} days ago`}
          </p>
        </div>
      </div>

      {/* ── RECENT RESTORE POINTS ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-custom-black">Recent Restore Points</h2>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <input
            type="text"
            placeholder="Search restore points…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-black outline-none flex-1 min-w-48"
          />
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-gray outline-none"
          >
            <option value="All">All</option>
            <option value="AUTO">Auto</option>
            <option value="MANUAL">Manual</option>
            <option value="IMPORTANT">Important</option>
          </select>
          <div className="flex items-center gap-2 text-sm text-custom-gray">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-gray outline-none"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>
          <button
            onClick={() => { setSearchQuery(""); setTagFilter("All"); setSortBy("Newest"); }}
            className="text-xs text-custom-red border border-dashed border-custom-red px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
          >
            ✕ Clear filters
          </button>
        </div>

        {/* Card grid — 3 columns */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 bg-custom-gray-2/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-16 text-custom-gray">
            <p className="text-sm font-medium">No restore points match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {displayed.map((point) => (
              <RestorePointCard
                key={point.id}
                point={point}
                onDetails={handleDetails}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── QUICK ACTIONS ───────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2 border-t border-custom-gray-2">
        <p className="text-sm font-semibold text-custom-gray mr-2">Quick Actions:</p>

        <button
          onClick={handleCreateBackup}
          disabled={isCreating}
          className="flex items-center gap-2 text-sm bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium px-4 py-2.5 rounded-md transition-colors shadow-sm"
        >
          {isCreating ? "Creating…" : "+ Create Manual Backup"}
        </button>

        {/* Import Backup — placeholder (no backend yet) */}
        <button className="flex items-center gap-2 text-sm border border-custom-gray-2 text-custom-gray hover:text-custom-black hover:bg-custom-gray-2 px-4 py-2.5 rounded-md transition-colors">
          <Upload size={14} />
          Import Backup
        </button>

        <button
          onClick={() => setSettingsOpen(true)}
          className="flex items-center gap-2 text-sm border border-custom-gray-2 text-custom-gray hover:text-custom-black hover:bg-custom-gray-2 px-4 py-2.5 rounded-md transition-colors"
        >
          <Settings size={14} />
          Backup Settings
        </button>
      </div>

      {/* Backup Settings Modal */}
      <BackupSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default AdminDashboardPage;
