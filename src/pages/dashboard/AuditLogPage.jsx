import { Logs, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "../../components/shared/SearchBar";
import { getAuditLogs } from "../../services/AuditLogService";

/*
  AuditLogPage
  ─────────────────────────────────────────────────────────────────────────────
  DATA FLOW:
    Mount / refresh → getAuditLogs() → GET /api/auditlog/displayAll

  The server scopes the response automatically:
    - Admin   → all logs across all branches
    - Manager → only logs from their own branch
    - Staff   → same as manager (read-only, no destructive actions)

  Audit logs are written automatically by every controller action that mutates
  data (add, update, archive, restore). This page is read-only.

  API ROW SHAPE:
    {
      log_id, log_display_id,
      employee_display_id,
      branch_display_id,
      log_action,    ← short verb: "ARCHIVE", "RESTORE", "ADD", "UPDATE"...
      log_module,    ← which controller: "Inventory", "Accounts", "Sales"...
      log_timestamp  ← ISO 8601 string from the DB
    }

  COLUMNS SHOWN:
    Log ID | Employee | Branch | Action | Module | Date | Time

  FILTERS:
    - Text search  → matches log_display_id, employee_display_id, log_action
    - Module filter → dropdown of known modules
    - Date range   → dateFrom / dateTo (compared against log_timestamp date part)
  ─────────────────────────────────────────────────────────────────────────────
*/

// Normalise a raw API row into the shape this table needs
const normalizeLog = (log) => ({
  id:         log.log_display_id,
  employee:   log.employee_display_id ?? "—",
  branch:     log.branch_display_id   ?? "—",
  action:     log.log_action          ?? "—",
  module:     log.log_module          ?? "—",
  // Split timestamp into separate date and time for easier display + filtering
  date: log.log_timestamp
    ? new Date(log.log_timestamp).toLocaleDateString("en-PH", {
        year: "numeric", month: "short", day: "numeric",
      })
    : "—",
  // Store a plain YYYY-MM-DD string so we can compare it against <input type="date">
  dateRaw: log.log_timestamp
    ? new Date(log.log_timestamp).toISOString().split("T")[0]
    : "",
  time: log.log_timestamp
    ? new Date(log.log_timestamp).toLocaleTimeString("en-PH", {
        hour: "2-digit", minute: "2-digit",
      })
    : "—",
});

// Action badge colour — maps log_action verbs to theme tokens
const actionColor = (action = "") => {
  switch (action.toUpperCase()) {
    case "ADD":
    case "CREATE":
    case "RESTORE": return "bg-green-100 text-custom-green";
    case "UPDATE":
    case "EDIT":    return "bg-blue-100 text-custom-blue";
    case "ARCHIVE":
    case "DELETE":  return "bg-red-100 text-custom-red";
    default:        return "bg-custom-gray-2 text-custom-gray";
  }
};

const KNOWN_MODULES = ["All", "Accounts", "Inventory", "Sales", "Requests", "Archives", "Auth"];

const AuditLogPage = () => {
  const [logs,      setLogs]      = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState(null);

  const [searchQuery,  setSearchQuery]  = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [dateFrom,     setDateFrom]     = useState("");
  const [dateTo,       setDateTo]       = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Audit logs accumulate fast; show more per page

  // ── Fetch ────────────────────────────────────────────────────────────────
  // useCallback so we can pass this as a dependency to useEffect without
  // causing an infinite re-render loop (same reference every render).
  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAuditLogs();
      // Newest first — the server returns them by insert order, but we sort client-side
      // in case the API order changes.
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

  // ── Filter ───────────────────────────────────────────────────────────────
  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();

    // Text search across ID, employee, and action fields
    const matchesSearch = !q
      || log.id.toLowerCase().includes(q)
      || log.employee.toLowerCase().includes(q)
      || log.action.toLowerCase().includes(q);

    const matchesModule = moduleFilter === "All"
      || log.module.toLowerCase() === moduleFilter.toLowerCase();

    // Compare raw YYYY-MM-DD strings (both sides are that format)
    const matchesFrom = !dateFrom || log.dateRaw >= dateFrom;
    const matchesTo   = !dateTo   || log.dateRaw <= dateTo;

    return matchesSearch && matchesModule && matchesFrom && matchesTo;
  });

  const totalPages  = Math.ceil(filteredLogs.length / itemsPerPage);
  // Reset to page 1 whenever the filtered set changes shape
  const safeCurrentPage = Math.min(currentPage, totalPages || 1);
  const currentData = filteredLogs.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setSearchQuery("");
    setModuleFilter("All");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-3">
          <Logs size={28} className="text-custom-black" />
          <div>
            <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none">
              Audit Log
            </h1>
            <p className="text-custom-gray text-sm mt-1">
              Read-only record of all system actions
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={fetchLogs}
          disabled={isLoading}
          className="border-custom-gray-2 text-custom-gray hover:text-custom-black gap-2"
        >
          <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-4 my-8 bg-custom-white p-4 rounded-xl border border-custom-gray-2">

        {/* Text search */}
        <div className="flex-1 min-w-52">
          <SearchBar
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e?.target ? e.target.value : e); setCurrentPage(1); }}
            placeholder="Search log ID, employee, or action…"
          />
        </div>

        {/* Module filter */}
        <select
          value={moduleFilter}
          onChange={(e) => { setModuleFilter(e.target.value); setCurrentPage(1); }}
          className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-gray outline-none"
        >
          {KNOWN_MODULES.map((m) => (
            <option key={m} value={m}>{m === "All" ? "All Modules" : m}</option>
          ))}
        </select>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute -top-4 left-0 text-[10px] text-custom-gray">Date From:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              className="border border-custom-gray-2 rounded-md px-2 py-1.5 text-sm text-custom-gray"
            />
          </div>
          <div className="relative">
            <span className="absolute -top-4 left-0 text-[10px] text-custom-gray">Date To:</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
              className="border border-custom-gray-2 rounded-md px-2 py-1.5 text-sm text-custom-gray"
            />
          </div>
        </div>

        <button
          onClick={handleClearFilters}
          className="border border-dashed border-custom-red text-custom-red px-3 py-2 rounded-md text-xs font-bold hover:bg-red-50 transition-colors"
        >
          ✕ Clear filters
        </button>
      </div>

      {/* ── ERROR BANNER ────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-custom-red">
          {error} — <button onClick={fetchLogs} className="underline">retry</button>
        </div>
      )}

      {/* ── TABLE ───────────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-custom-white rounded-lg border border-custom-gray-2">
        <table className="w-full text-sm text-left">

          <thead className="text-custom-gray uppercase text-[11px] border-b border-custom-gray-2">
            <tr>
              <th className="px-5 py-4 font-medium">Log ID</th>
              <th className="px-5 py-4 font-medium">Employee</th>
              <th className="px-5 py-4 font-medium">Branch</th>
              <th className="px-5 py-4 font-medium">Action</th>
              <th className="px-5 py-4 font-medium">Module</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Time</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-custom-gray italic">
                  Loading audit logs…
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((log, index) => (
                <tr
                  key={log.id}
                  className={index % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"}
                >
                  {/* Log ID — styled as a mono code tag for readability */}
                  <td className="px-5 py-3">
                    <code className="text-xs bg-custom-gray-2 text-custom-black px-2 py-0.5 rounded font-mono">
                      {log.id}
                    </code>
                  </td>
                  <td className="px-5 py-3 text-custom-gray font-medium">{log.employee}</td>
                  <td className="px-5 py-3 text-custom-gray">{log.branch}</td>

                  {/* Action badge — colour-coded by verb */}
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${actionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-custom-gray">{log.module}</td>
                  <td className="px-5 py-3 text-custom-gray">{log.date}</td>
                  <td className="px-5 py-3 text-custom-gray">{log.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-5 py-10 text-center text-custom-gray italic">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── FOOTER / PAGINATION ─────────────────────────────────────────── */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-custom-gray">
          Showing {currentData.length} of {filteredLogs.length} entries
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safeCurrentPage === 1}
            className={`text-2xl transition-colors ${
              safeCurrentPage === 1
                ? "text-custom-gray-2 cursor-not-allowed"
                : "text-custom-gray hover:text-custom-black"
            }`}
          >
            ‹
          </button>
          <span className="text-sm text-custom-gray self-center">
            {safeCurrentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safeCurrentPage === totalPages || totalPages === 0}
            className={`text-2xl transition-colors ${
              safeCurrentPage === totalPages || totalPages === 0
                ? "text-custom-gray-2 cursor-not-allowed"
                : "text-custom-gray hover:text-custom-black"
            }`}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
