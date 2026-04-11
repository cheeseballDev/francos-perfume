import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { getAuditLogs } from "../../services/AuditLogService";

/*
  AdminAuditLogPage
  ─────────────────────────────────────────────────────────────────────────────
  MATCHES PROTOTYPES:
    ADMIN - AUDIT.png        → main page layout
    ADMIN - ACCOUNTS-1.png   → "View All" modal (Inventory Audit Log List)
    ADMIN - EXPORT AUDIT.png → "Export" modal (PDF / Excel / CSV)

  LAYOUT:
    The page is divided into four named sections matching the prototype:
      1. Inventory Audit Logs
      2. Accounts Audit Logs
      3. Requests Audit Logs
      4. Admin Audit Logs

    Each section shows the first 5 rows from that module's logs, then:
      Actions: [View All]  [Export]
    with pagination for within-section browsing.

  DATA FLOW:
    Mount → getAuditLogs() → GET /api/auditlog/displayAll
    The server returns all logs visible to the caller (admin = all branches,
    all modules). We split them client-side by `log_module`.

  "VIEW ALL" MODAL:
    Opens a larger overlay with full search + date range + all rows for that
    module. Matches ADMIN - ACCOUNTS-1.png (Inventory Audit Log List modal).

  "EXPORT" MODAL:
    Three format buttons (PDF / Excel / CSV) + optional date range.
    Matches ADMIN - EXPORT AUDIT.png. Export is a placeholder — the real
    implementation would call an API endpoint that returns a file stream.

  SECTION NAMES → log_module values:
    "Inventory Audit Logs"  → module === "Inventory"
    "Accounts Audit Logs"   → module === "Accounts"
    "Requests Audit Logs"   → module === "Requests"
    "Admin Audit Logs"      → module === "Admin"
  ─────────────────────────────────────────────────────────────────────────────
*/

// ── Export Modal ───────────────────────────────────────────────────────────────
// Prototype: ADMIN - EXPORT AUDIT.png
// Lets the admin pick PDF / Excel / CSV and an optional date range before exporting.
const ExportModal = ({ isOpen, onClose, sectionLabel }) => {
  const [format,   setFormat]   = useState(null); // "PDF" | "EXCEL" | "CSV"
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleExport = async () => {
    if (!format) return;
    setLoading(true);
    // 🔌 TODO: call a backend endpoint that streams a file:
    //   GET /api/auditlog/export?format={format}&from={dateFrom}&to={dateTo}&module={sectionLabel}
    // For now, just show a brief "working" state and close.
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onClose();
    alert(`[PLACEHOLDER] Exporting ${format} for "${sectionLabel}" — wire up the backend endpoint.`);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fade-in">
      <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-custom-black">Export To:</h2>
          <button onClick={onClose} className="text-custom-gray hover:text-custom-black"><X size={18} /></button>
        </div>

        {/* Format selection — 3 large icon buttons matching prototype */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {["PDF", "EXCEL", "CSV"].map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`flex flex-col items-center gap-2 py-5 rounded-xl border-2 transition-colors ${
                format === f
                  ? "border-custom-primary bg-custom-primary/10"
                  : "border-custom-gray-2 hover:border-custom-primary/50"
              }`}
            >
              {/* Icon representation */}
              <span className="text-3xl">
                {f === "PDF" ? "📄" : f === "EXCEL" ? "📊" : "📋"}
              </span>
              <span className="text-sm font-bold text-custom-black">{f}</span>
            </button>
          ))}
        </div>

        {/* Optional date range */}
        <p className="text-xs text-custom-gray font-medium mb-3">Select a date (optional)</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div>
            <label className="text-[10px] text-custom-gray block mb-1">Date From:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-custom-gray-2 rounded-md px-2 py-1.5 text-sm text-custom-gray outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-custom-gray block mb-1">Date To:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-custom-gray-2 rounded-md px-2 py-1.5 text-sm text-custom-gray outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleExport}
          disabled={!format || loading}
          className={`w-full py-3 rounded-md text-sm font-semibold transition-colors ${
            format
              ? "bg-custom-primary hover:bg-custom-primary/80 text-custom-black"
              : "bg-custom-gray-2 text-custom-gray cursor-not-allowed"
          }`}
        >
          {loading ? "Exporting…" : "Continue to export"}
        </button>
      </div>
    </div>
  );
};

// ── View All Modal ─────────────────────────────────────────────────────────────
// Prototype: ADMIN - ACCOUNTS-1.png (Inventory Audit Log List)
// Full-screen modal showing all logs for one module with search + date filter.
const ViewAllModal = ({ isOpen, onClose, logs, sectionLabel }) => {
  const [search,   setSearch]   = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    const matchSearch  = !q || log.id.toLowerCase().includes(q) || log.employee.toLowerCase().includes(q) || log.action.toLowerCase().includes(q);
    const matchUser    = !userFilter    || log.employee.toLowerCase().includes(userFilter.toLowerCase());
    const matchAction  = !actionFilter  || log.action.toLowerCase().includes(actionFilter.toLowerCase());
    const matchFrom    = !dateFrom || log.dateRaw >= dateFrom;
    const matchTo      = !dateTo   || log.dateRaw <= dateTo;
    return matchSearch && matchUser && matchAction && matchFrom && matchTo;
  });

  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
        <div className="bg-custom-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">

          {/* Header */}
          <div className="px-8 py-5 border-b border-custom-gray-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-custom-black">{sectionLabel} List</h2>
            <button onClick={onClose} className="text-custom-gray hover:text-custom-black"><X size={18} /></button>
          </div>

          {/* Filters */}
          <div className="px-8 py-4 border-b border-custom-gray-2 space-y-3">
            <input
              type="text" placeholder="Search…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-custom-gray-2 rounded-md px-3 py-2 text-sm outline-none"
            />
            <div className="flex gap-3 flex-wrap">
              <select
                value={userFilter} onChange={(e) => setUserFilter(e.target.value)}
                className="border border-custom-gray-2 rounded-md px-3 py-1.5 text-sm text-custom-gray outline-none"
              >
                <option value="">Filter User</option>
                {[...new Set(logs.map((l) => l.employee))].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
              <select
                value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
                className="border border-custom-gray-2 rounded-md px-3 py-1.5 text-sm text-custom-gray outline-none"
              >
                <option value="">Filter Action</option>
                {[...new Set(logs.map((l) => l.action))].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <button
                onClick={() => { setSearch(""); setUserFilter(""); setActionFilter(""); setDateFrom(""); setDateTo(""); }}
                className="text-xs text-custom-red border border-dashed border-custom-red px-3 py-1.5 rounded-md hover:bg-red-50"
              >
                ✕ Clear filters
              </button>
              <button
                onClick={() => setExportOpen(true)}
                className="ml-auto flex items-center gap-1.5 text-xs bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium px-4 py-1.5 rounded-md"
              >
                📊 Export
              </button>
            </div>
            <div className="flex gap-3">
              <div>
                <label className="text-[10px] text-custom-gray block">Date From:</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-custom-gray-2 rounded-md px-2 py-1 text-sm text-custom-gray outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-custom-gray block">Date To:</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="border border-custom-gray-2 rounded-md px-2 py-1 text-sm text-custom-gray outline-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-custom-gray uppercase border-b border-custom-gray-2 sticky top-0 bg-custom-white">
                <tr>
                  <th className="px-5 py-3 font-medium">Log ID</th>
                  <th className="px-5 py-3 font-medium">Timestamp</th>
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Action done by user</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr key={log.id} className={i % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"}>
                    <td className="px-5 py-3 text-custom-gray font-mono text-xs">{log.id}</td>
                    <td className="px-5 py-3 text-custom-gray">{log.date} {log.time}</td>
                    <td className="px-5 py-3 font-medium text-custom-black">{log.employee}</td>
                    <td className="px-5 py-3 text-custom-black">{log.action}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="4" className="px-5 py-10 text-center text-custom-gray italic">No logs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ExportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} sectionLabel={sectionLabel} />
    </>
  );
};

// ── AuditSection ───────────────────────────────────────────────────────────────
// One module section: title + 5-row mini table + pagination + View All + Export
const AuditSection = ({ title, logs }) => {
  const PAGE_SIZE = 5;
  const [page,       setPage]       = useState(1);
  const [viewAllOpen,setViewAllOpen]= useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const totalPages = Math.ceil(logs.length / PAGE_SIZE);
  const pageData   = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-custom-black mb-4">{title}</h2>

        <div className="bg-custom-white border border-custom-gray-2 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-custom-gray uppercase border-b border-custom-gray-2">
              <tr>
                <th className="px-5 py-3 font-medium">Log ID</th>
                <th className="px-5 py-3 font-medium">Timestamp</th>
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Action done by user</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((log, i) => (
                <tr key={log.id} className={i % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"}>
                  <td className="px-5 py-3 text-custom-gray font-mono text-xs">{log.id}</td>
                  <td className="px-5 py-3 text-custom-gray">{log.date} {log.time}</td>
                  <td className="px-5 py-3 font-medium text-custom-black">{log.employee}</td>
                  <td className="px-5 py-3 text-custom-black">{log.action}</td>
                </tr>
              ))}
              {pageData.length === 0 && (
                <tr><td colSpan="4" className="px-5 py-8 text-center text-custom-gray italic">No logs for this module.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Actions row + pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-custom-gray font-medium">Actions:</span>
            <button
              onClick={() => setViewAllOpen(true)}
              className="flex items-center gap-1.5 text-xs bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              👁 View All
            </button>
            <button
              onClick={() => setExportOpen(true)}
              className="flex items-center gap-1.5 text-xs border border-custom-gray-2 text-custom-gray hover:text-custom-black hover:bg-custom-gray-2 font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              📊 Export
            </button>
          </div>

          {/* Within-section pagination */}
          <div className="flex items-center gap-3 text-sm text-custom-gray">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className={page === 1 ? "text-custom-gray-2 cursor-not-allowed text-xl" : "hover:text-custom-black text-xl"}
            >‹</button>
            <span>{page} of {totalPages || 1}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className={page >= totalPages ? "text-custom-gray-2 cursor-not-allowed text-xl" : "hover:text-custom-black text-xl"}
            >›</button>
          </div>
        </div>
      </div>

      <ViewAllModal
        isOpen={viewAllOpen}
        onClose={() => setViewAllOpen(false)}
        logs={logs}
        sectionLabel={title}
      />
      <ExportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        sectionLabel={title}
      />
    </>
  );
};

// ── normalizeLog ───────────────────────────────────────────────────────────────
const normalizeLog = (log) => ({
  id:       log.log_display_id ?? "—",
  employee: log.employee_display_id ?? "—",
  branch:   log.branch_display_id   ?? "—",
  action:   log.log_action          ?? "—",
  module:   log.log_module          ?? "Other",
  date: log.log_timestamp
    ? new Date(log.log_timestamp).toLocaleDateString("en-PH", {
        year: "numeric", month: "2-digit", day: "2-digit",
      })
    : "—",
  dateRaw: log.log_timestamp
    ? new Date(log.log_timestamp).toISOString().split("T")[0]
    : "",
  time: log.log_timestamp
    ? new Date(log.log_timestamp).toLocaleTimeString("en-PH", {
        hour: "2-digit", minute: "2-digit",
      })
    : "—",
});

// ── Main Page ──────────────────────────────────────────────────────────────────
const AdminAuditLogPage = () => {
  const [logs,      setLogs]      = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAuditLogs();
      const sorted = [...data].sort(
        (a, b) => new Date(b.log_timestamp) - new Date(a.log_timestamp)
      );
      setLogs(sorted.map(normalizeLog));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Split logs by module — matching the four section headings in the prototype
  const SECTIONS = [
    { title: "Inventory Audit Logs", module: "Inventory" },
    { title: "Accounts Audit Logs",  module: "Accounts"  },
    { title: "Requests Audit Logs",  module: "Requests"  },
    { title: "Admin Audit Logs",     module: "Admin"     },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in">

      <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none mb-8">
        Inventory Audit Logs
      </h1>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-custom-red">
          {error} — <button onClick={fetchLogs} className="underline">retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-custom-gray">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading audit logs…</span>
        </div>
      ) : (
        SECTIONS.map(({ title, module }) => (
          <AuditSection
            key={module}
            title={title}
            logs={logs.filter((l) => l.module.toLowerCase() === module.toLowerCase())}
          />
        ))
      )}
    </div>
  );
};

export default AdminAuditLogPage;
