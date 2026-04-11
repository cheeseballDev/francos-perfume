import { Archive, ArchiveRestore, Loader2, Package, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getArchivedAccounts,
  getArchivedProducts,
  restoreAccount,
  restoreProduct,
} from "../../services/ArchiveService";

/*
  ArchivesPage
  ─────────────────────────────────────────────────────────────────────────────
  PURPOSE:
    Standalone page (not a modal) that lets a manager browse and restore both
    archived accounts and archived products from one place.

  TABS:
    Accounts  — GET /api/archiving/displayAllAccounts
                PUT /api/archiving/restoreAccount/{archiveId}

    Products  — GET /api/archiving/displayAllProducts
                PUT /api/archiving/restoreProduct/{archiveId}

  INTERACTION PATTERN:
    1. Click "Restore" → inline confirm row (Yes / No)
    2. Click "Yes"    → spinner in that row, call API
    3. Success        → remove row optimistically, show green banner
    4. Failure        → show red banner, row stays

  NOTE ON IDs:
    - Restore uses `account_archive_id` (archive table PK), NOT employee_id.
    - Restore uses `product_archive_id` (archive table PK), NOT product_id.
    This is intentional — the archive table has its own PK so one product can
    be archived and restored multiple times, each with a unique archive record.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ── Sub-component: AccountsTab ──────────────────────────────────────────────
// Extracted into its own component so it can manage its own fetch + state,
// and only fetches when it becomes the active tab (via the `isActive` prop).
const AccountsTab = ({ isActive }) => {
  const [archives,    setArchives]    = useState([]);
  const [isFetching,  setIsFetching]  = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [confirmId,   setConfirmId]   = useState(null);
  const [feedback,    setFeedback]    = useState(null);

  // Fetch once when this tab becomes active, or when manually refreshed.
  // The [isActive] dependency re-triggers the effect each time the tab switches in.
  const fetchArchives = useCallback(async () => {
    if (!isActive) return;
    setIsFetching(true);
    setFeedback(null);
    try {
      const data = await getArchivedAccounts();
      setArchives(data);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsFetching(false);
    }
  }, [isActive]);

  useEffect(() => { fetchArchives(); }, [fetchArchives]);

  const handleRestore = async (archiveId) => {
    setRestoringId(archiveId);
    setConfirmId(null);
    try {
      const result = await restoreAccount(archiveId);
      // Optimistic UI: remove the row immediately without re-fetching.
      setArchives((prev) => prev.filter((a) => a.account_archive_id !== archiveId));
      setFeedback({ type: "success", message: result.message });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div>
      {/* Feedback banner */}
      {feedback && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
          feedback.type === "success"
            ? "bg-green-50 text-custom-green border border-green-200"
            : "bg-red-50 text-custom-red border border-red-200"
        }`}>
          {feedback.type === "success" ? "✓" : "✕"} {feedback.message}
        </div>
      )}

      {/* Loading */}
      {isFetching && (
        <div className="flex items-center justify-center py-16 gap-3 text-custom-gray">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading archived accounts…</span>
        </div>
      )}

      {/* Empty state */}
      {!isFetching && archives.length === 0 && !feedback && (
        <div className="text-center py-16 text-custom-gray">
          <ArchiveRestore size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No archived accounts</p>
          <p className="text-xs mt-1">Archived accounts will appear here</p>
        </div>
      )}

      {/* Table */}
      {!isFetching && archives.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-custom-gray uppercase border-b border-custom-gray-2">
              <tr>
                <th className="px-4 py-3 font-medium">Archive ID</th>
                <th className="px-4 py-3 font-medium">Employee ID</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Branch</th>
                <th className="px-4 py-3 font-medium">Archived By</th>
                <th className="px-4 py-3 font-medium">Date Archived</th>
                <th className="px-4 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {archives.map((archive, index) => {
                const isRestoring  = restoringId === archive.account_archive_id;
                const isConfirming = confirmId   === archive.account_archive_id;

                // Format branch_id → display string ("BR-001")
                const branchDisplay = archive.branch_id
                  ? `BR-${String(archive.branch_id).padStart(3, "0")}`
                  : "—";

                const dateStr = archive.date_archived
                  ? new Date(archive.date_archived).toLocaleDateString("en-PH", {
                      year: "numeric", month: "short", day: "numeric",
                    })
                  : "—";

                return (
                  <tr
                    key={archive.account_archive_id}
                    className={`transition-opacity duration-300 ${isRestoring ? "opacity-40" : ""} ${
                      index % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-custom-gray text-xs">
                      {archive.account_archive_display_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-custom-black">
                      {archive.employee_display_id}
                    </td>
                    <td className="px-4 py-3 text-custom-gray">{archive.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          archive.employee_role === "admin"
                            ? "border-custom-purple text-custom-purple"
                            : archive.employee_role === "manager"
                            ? "border-custom-blue text-custom-blue"
                            : "border-custom-gray text-custom-gray"
                        }`}
                      >
                        {archive.employee_role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-custom-gray">{branchDisplay}</td>
                    <td className="px-4 py-3 text-custom-gray">{archive.archived_by}</td>
                    <td className="px-4 py-3 text-custom-gray">{dateStr}</td>
                    <td className="px-4 py-3 text-center">
                      {isRestoring ? (
                        <Loader2 size={16} className="animate-spin text-custom-gray mx-auto" />
                      ) : isConfirming ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-custom-gray whitespace-nowrap">Restore?</span>
                          <button
                            onClick={() => handleRestore(archive.account_archive_id)}
                            className="text-xs px-2 py-1 bg-custom-green text-custom-white rounded-md hover:opacity-90 transition-opacity"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-xs px-2 py-1 bg-custom-gray-2 text-custom-black rounded-md hover:opacity-90 transition-opacity"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmId(archive.account_archive_id)}
                          className="text-xs border-custom-blue text-custom-blue hover:bg-blue-50 gap-1"
                        >
                          <ArchiveRestore size={12} />
                          Restore
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Sub-component: ProductsTab ──────────────────────────────────────────────
const ProductsTab = ({ isActive }) => {
  const [archives,    setArchives]    = useState([]);
  const [isFetching,  setIsFetching]  = useState(false);
  const [restoringId, setRestoringId] = useState(null);
  const [confirmId,   setConfirmId]   = useState(null);
  const [feedback,    setFeedback]    = useState(null);

  const fetchArchives = useCallback(async () => {
    if (!isActive) return;
    setIsFetching(true);
    setFeedback(null);
    try {
      const data = await getArchivedProducts();
      setArchives(data);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setIsFetching(false);
    }
  }, [isActive]);

  useEffect(() => { fetchArchives(); }, [fetchArchives]);

  const handleRestore = async (archiveId) => {
    setRestoringId(archiveId);
    setConfirmId(null);
    try {
      const result = await restoreProduct(archiveId);
      setArchives((prev) => prev.filter((a) => a.product_archive_id !== archiveId));
      setFeedback({ type: "success", message: result.message });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setRestoringId(null);
    }
  };

  // Gender badge color helper
  const genderColor = (gender) => {
    if (!gender) return "border-custom-gray text-custom-gray";
    switch (gender.toLowerCase()) {
      case "male":   return "border-custom-blue text-custom-blue";
      case "female": return "border-custom-purple text-custom-purple";
      default:       return "border-custom-green text-custom-green";
    }
  };

  return (
    <div>
      {/* Feedback banner */}
      {feedback && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2 ${
          feedback.type === "success"
            ? "bg-green-50 text-custom-green border border-green-200"
            : "bg-red-50 text-custom-red border border-red-200"
        }`}>
          {feedback.type === "success" ? "✓" : "✕"} {feedback.message}
        </div>
      )}

      {isFetching && (
        <div className="flex items-center justify-center py-16 gap-3 text-custom-gray">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Loading archived products…</span>
        </div>
      )}

      {!isFetching && archives.length === 0 && !feedback && (
        <div className="text-center py-16 text-custom-gray">
          <Package size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No archived products</p>
          <p className="text-xs mt-1">Archived products will appear here</p>
        </div>
      )}

      {!isFetching && archives.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-custom-gray uppercase border-b border-custom-gray-2">
              <tr>
                <th className="px-4 py-3 font-medium">Archive ID</th>
                <th className="px-4 py-3 font-medium">Product ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Gender</th>
                <th className="px-4 py-3 font-medium">Archived By</th>
                <th className="px-4 py-3 font-medium">Date Archived</th>
                <th className="px-4 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {archives.map((archive, index) => {
                const isRestoring  = restoringId === archive.product_archive_id;
                const isConfirming = confirmId   === archive.product_archive_id;

                const dateStr = archive.date_archived
                  ? new Date(archive.date_archived).toLocaleDateString("en-PH", {
                      year: "numeric", month: "short", day: "numeric",
                    })
                  : "—";

                return (
                  <tr
                    key={archive.product_archive_id}
                    className={`transition-opacity duration-300 ${isRestoring ? "opacity-40" : ""} ${
                      index % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-custom-gray text-xs">
                      {archive.product_archive_display_id}
                    </td>
                    <td className="px-4 py-3 font-medium text-custom-black">
                      {archive.product_display_id}
                    </td>
                    <td className="px-4 py-3 font-semibold text-custom-black">
                      {archive.product_name}
                    </td>
                    <td className="px-4 py-3 text-custom-gray">{archive.product_type}</td>
                    <td className="px-4 py-3 text-custom-gray">{archive.product_note || "—"}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs ${genderColor(archive.product_gender)}`}
                      >
                        {archive.product_gender || "—"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-custom-gray">{archive.archived_by}</td>
                    <td className="px-4 py-3 text-custom-gray">{dateStr}</td>
                    <td className="px-4 py-3 text-center">
                      {isRestoring ? (
                        <Loader2 size={16} className="animate-spin text-custom-gray mx-auto" />
                      ) : isConfirming ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs text-custom-gray whitespace-nowrap">Restore?</span>
                          <button
                            onClick={() => handleRestore(archive.product_archive_id)}
                            className="text-xs px-2 py-1 bg-custom-green text-custom-white rounded-md hover:opacity-90 transition-opacity"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="text-xs px-2 py-1 bg-custom-gray-2 text-custom-black rounded-md hover:opacity-90 transition-opacity"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmId(archive.product_archive_id)}
                          className="text-xs border-custom-purple text-custom-purple hover:bg-purple-50 gap-1"
                        >
                          <ArchiveRestore size={12} />
                          Restore
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ── Main page ───────────────────────────────────────────────────────────────
const ArchivesPage = () => {
  // "accounts" | "products"
  const [activeTab, setActiveTab] = useState("accounts");

  const tabClass = (tab) =>
    `px-6 py-2 text-sm font-medium rounded-md transition-colors ${
      activeTab === tab
        ? "bg-custom-primary text-custom-black shadow-sm"
        : "text-custom-gray hover:text-custom-black"
    }`;

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-1">
        <Archive size={28} className="text-custom-black" />
        <div>
          <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none">
            Archives
          </h1>
          <p className="text-custom-gray text-sm mt-1">
            Restore archived accounts and products
          </p>
        </div>
      </div>

      {/* ── TAB SWITCHER ────────────────────────────────────────────────── */}
      <div className="flex gap-2 my-6 bg-custom-gray-2 p-1 rounded-lg w-fit border border-custom-gray-2">
        <button onClick={() => setActiveTab("accounts")} className={tabClass("accounts")}>
          <span className="flex items-center gap-2">
            <ArchiveRestore size={14} />
            Accounts
          </span>
        </button>
        <button onClick={() => setActiveTab("products")} className={tabClass("products")}>
          <span className="flex items-center gap-2">
            <Package size={14} />
            Products
          </span>
        </button>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}
      {/*
        We pass `isActive` so each tab only fetches when it's the active one.
        Both tabs remain mounted (no conditional render) so switching tabs is
        instant after the first load — the data is already in local state.
        We re-fetch each time a tab becomes active so restores made in one tab
        are reflected if you switch back. (See useCallback + useEffect in each.)
      */}
      <div className="bg-custom-white rounded-xl border border-custom-gray-2 p-6 flex-1">
        {activeTab === "accounts" && (
          <AccountsTab isActive={activeTab === "accounts"} />
        )}
        {activeTab === "products" && (
          <ProductsTab isActive={activeTab === "products"} />
        )}
      </div>

      {/* Warning footer */}
      <div className="mt-4 flex items-center gap-2 text-xs text-custom-yellow">
        <span className="text-base">⚠</span>
        <span>
          Restoring an account re-enables the employee&apos;s system access.
          Restoring a product makes it visible in inventory again.
        </span>
      </div>
    </div>
  );
};

export default ArchivesPage;
