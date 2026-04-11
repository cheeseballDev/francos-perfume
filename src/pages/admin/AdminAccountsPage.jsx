import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { addEmployee, getAllEmployees, updateAuth, updateProfile } from "../../services/EmployeeService";
import { archiveAccount } from "../../services/ArchiveService";

/*
  AdminAccountsPage
  ─────────────────────────────────────────────────────────────────────────────
  MATCHES PROTOTYPES:
    ADMIN - ACCOUNTS.png      → main table
    ADMIN - INFORMATION.png   → AccountInfoModal
    ADMIN - CREATE.png        → CreateAccountModal
    ADMIN - EDIT.png          → EditAccountModal
    ADMIN - DISABLE.png       → DisableConfirmModal
    ADMIN - RESET.png         → ResetPasswordConfirmModal

  DATA FLOW:
    Mount → getAllEmployees() → GET /api/employees/displayAll
    Admin scope: the server returns ALL employees across all branches
    (vs. manager/staff who only see their own branch).

  MODAL FLOW:
    Table row "View" → AccountInfoModal
      ├─ "Edit Account"       → EditAccountModal (replaces InfoModal)
      ├─ "Reset Password"     → ResetPasswordConfirmModal
      ├─ "Deactivate Account" → DisableConfirmModal
      └─ "Archive Account"    → calls archiveAccount() directly + optimistic remove

  normalizeEmployee():
    Maps the raw API shape to the flat object the table + modals expect.
    The raw shape varies slightly between endpoints so we normalise once here.
  ─────────────────────────────────────────────────────────────────────────────
*/

// ── normalizeEmployee ─────────────────────────────────────────────────────────
const normalizeEmployee = (emp) => ({
  // Numeric PK — needed for API calls
  _numId:  emp.employee_id ?? emp.employeeId,
  // Display fields
  id:      emp.employee_display_id   ?? emp.employeeDisplayId ?? "—",
  email:   emp.email                 ?? "—",
  name:    emp.full_name             ?? emp.fullName           ?? "—",
  role:    emp.employee_role         ?? emp.role               ?? "—",
  branch:  emp.branch_location       ?? emp.branchLocation     ?? emp.branch ?? "—",
  branchId: emp.branch_id            ?? emp.branchId           ?? 1,
  date:    emp.account_created_at
    ? new Date(emp.account_created_at).toLocaleDateString("en-PH")
    : "—",
  status:  emp.account_status        ?? "Active",
  // Extra detail fields shown in AccountInfo
  contactNo:  emp.contact_number  ?? "—",
  address:    emp.address         ?? "—",
  firstName:  (emp.full_name ?? "").split(" ")[0]  ?? "",
  lastName:   (emp.full_name ?? "").split(" ").slice(-1)[0] ?? "",
});

// ── AccountInfoModal ───────────────────────────────────────────────────────────
// Read-only view of one account. Prototype: ADMIN - INFORMATION.png
// Four actions: Edit Account | Reset Password | Deactivate Account | Archive Account
const AccountInfoModal = ({ isOpen, account, onClose, onEdit, onReset, onDisable, onArchive }) => {
  if (!isOpen || !account) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in font-montserrat">
      <div className="bg-custom-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-5 text-custom-gray hover:text-custom-black text-xl"
        >‹</button>
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-custom-gray hover:text-custom-black"
        >✕</button>

        <h2 className="text-2xl font-extrabold text-custom-black text-center mb-6 tracking-tight">
          Account Information
        </h2>

        <div className="space-y-3 text-sm">
          <Row label="Full Name:" value={account.name} />
          <Row label="Email:"     value={account.email} />
          <Row label="Branch:"    value={account.branch} />
          <Row label="Role:"      value={account.role} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-8">
          <button
            onClick={onEdit}
            className="py-2.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black text-sm font-medium rounded-md transition-colors"
          >
            Edit Account
          </button>
          <button
            onClick={onReset}
            className="py-2.5 border border-custom-gray-2 text-custom-gray hover:text-custom-black text-sm font-medium rounded-md transition-colors"
          >
            Reset Password
          </button>
          <button
            onClick={onDisable}
            className="py-2.5 border border-custom-red text-custom-red hover:bg-red-50 text-sm font-medium rounded-md transition-colors"
          >
            Deactivate Account
          </button>
          <button
            onClick={onArchive}
            className="py-2.5 border border-custom-red text-custom-red hover:bg-red-50 text-sm font-medium rounded-md transition-colors"
          >
            Archive Account
          </button>
        </div>
      </div>
    </div>
  );
};

// Small label+value row used inside AccountInfoModal
const Row = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <span className="text-custom-gray w-28 shrink-0">{label}</span>
    <span className="font-semibold text-custom-black">{value}</span>
  </div>
);

// ── CreateAccountModal ─────────────────────────────────────────────────────────
// Prototype: ADMIN - CREATE.png
// Fields: Full Name, Email, Branch (select), Role (select)
const CreateAccountModal = ({ isOpen, onClose, onSave }) => {
  const EMPTY = { full_name: "", email: "", branch_id: 1, employee_role: "staff" };
  const [form,    setForm]    = useState(EMPTY);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await addEmployee(form);
      onSave();
      onClose();
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in font-montserrat">
      <div className="bg-custom-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-5 text-custom-gray hover:text-custom-black">✕</button>

        <h2 className="text-2xl font-extrabold text-custom-black text-center mb-6">Create New Account:</h2>

        {error && (
          <div className="mb-4 text-sm text-custom-red bg-red-50 border border-red-200 px-3 py-2 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" required placeholder="Enter full name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm outline-none focus:border-custom-primary"
          />
          <input
            type="email" required placeholder="Enter email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm outline-none focus:border-custom-primary"
          />
          <select
            value={form.branch_id}
            onChange={(e) => setForm({ ...form, branch_id: Number(e.target.value) })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm text-custom-gray outline-none"
          >
            <option value={1}>Sta. Lucia</option>
            <option value={2}>Riverbanks</option>
          </select>
          <select
            value={form.employee_role}
            onChange={(e) => setForm({ ...form, employee_role: e.target.value })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm text-custom-gray outline-none"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-custom-gray-2 text-custom-gray text-sm font-medium rounded-md hover:bg-custom-gray-2 transition-colors"
            >
              ✕ Cancel Changes
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black text-sm font-medium rounded-md transition-colors"
            >
              {saving ? "Saving…" : "✓ Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── EditAccountModal ───────────────────────────────────────────────────────────
// Prototype: ADMIN - EDIT.png
// Pre-filled with the selected account's current data.
const EditAccountModal = ({ isOpen, account, onClose, onSave }) => {
  const [form,   setForm]   = useState({});
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState(null);

  // Pre-fill whenever the account changes or modal opens
  useEffect(() => {
    if (!account) return;
    setForm({
      full_name:     account.name    ?? "",
      email:         account.email   ?? "",
      branch_id:     account.branchId ?? 1,
      employee_role: account.role?.toLowerCase() ?? "staff",
    });
  }, [account, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return;
    setSaving(true);
    setError(null);
    try {
      // updateProfile handles name/branch; updateAuth handles email/role
      await Promise.all([
        updateProfile(account._numId, { full_name: form.full_name, branch_id: form.branch_id }),
        updateAuth(account._numId,    { email: form.email, employee_role: form.employee_role }),
      ]);
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !account) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] animate-fade-in font-montserrat">
      <div className="bg-custom-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-5 text-custom-gray hover:text-custom-black">✕</button>

        <h2 className="text-2xl font-extrabold text-custom-black text-center mb-6">Edit Account Details:</h2>

        {error && (
          <div className="mb-4 text-sm text-custom-red bg-red-50 border border-red-200 px-3 py-2 rounded-md">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text" required placeholder="Full Name"
            value={form.full_name ?? ""}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm outline-none focus:border-custom-primary"
          />
          <input
            type="email" required placeholder="Email"
            value={form.email ?? ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm outline-none focus:border-custom-primary"
          />
          <select
            value={form.branch_id ?? 1}
            onChange={(e) => setForm({ ...form, branch_id: Number(e.target.value) })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm text-custom-gray outline-none"
          >
            <option value={1}>Sta. Lucia</option>
            <option value={2}>Riverbanks</option>
          </select>
          <select
            value={form.employee_role ?? "staff"}
            onChange={(e) => setForm({ ...form, employee_role: e.target.value })}
            className="w-full border border-custom-gray-2 rounded-md p-3 text-sm text-custom-gray outline-none"
          >
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>

          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-custom-gray-2 text-custom-gray text-sm font-medium rounded-md hover:bg-custom-gray-2 transition-colors"
            >
              ✕ Cancel Changes
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black text-sm font-medium rounded-md transition-colors"
            >
              {saving ? "Saving…" : "✓ Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── ConfirmDialog ─────────────────────────────────────────────────────────────
// Reusable YES/NO confirm dialog.
// Prototypes: ADMIN - DISABLE.png and ADMIN - RESET.png both use this pattern.
const ConfirmDialog = ({ isOpen, title, message, subtext, onYes, onNo }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] animate-fade-in">
      <div className="bg-custom-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
        <h3 className="text-lg font-bold text-custom-black mb-2">{title}</h3>
        {message && <p className="text-sm text-custom-gray mb-1">{message}</p>}
        {subtext  && <p className="text-xs text-custom-gray mb-6">{subtext}</p>}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onYes}
            className="flex-1 py-2.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black font-bold text-sm rounded-md transition-colors"
          >
            YES
          </button>
          <button
            onClick={onNo}
            className="flex-1 py-2.5 border border-custom-gray-2 text-custom-gray font-bold text-sm rounded-md hover:bg-custom-gray-2 transition-colors"
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const AdminAccountsPage = () => {
  const [accounts,    setAccounts]    = useState([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [error,       setError]       = useState(null);
  const [feedback,    setFeedback]    = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter,  setRoleFilter]  = useState("All");
  const [statusFilter,setStatusFilter]= useState("All");

  // ── Which modal is open ──────────────────────────────────────────────────
  const [selected,     setSelected]     = useState(null); // the account being acted on
  const [infoOpen,     setInfoOpen]     = useState(false);
  const [createOpen,   setCreateOpen]   = useState(false);
  const [editOpen,     setEditOpen]     = useState(false);
  const [disableOpen,  setDisableOpen]  = useState(false);
  const [resetOpen,    setResetOpen]    = useState(false);
  const [archiving,    setArchiving]    = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllEmployees();
      setAccounts(data.map(normalizeEmployee));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAccounts(); }, [fetchAccounts]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const openInfo = (account) => { setSelected(account); setInfoOpen(true); };
  const closeAll = () => {
    setInfoOpen(false); setEditOpen(false); setCreateOpen(false);
    setDisableOpen(false); setResetOpen(false);
  };

  // ── Archive (directly from InfoModal) ────────────────────────────────────
  const handleArchive = async () => {
    if (!selected) return;
    setArchiving(true);
    closeAll();
    try {
      await archiveAccount(selected._numId);
      setAccounts((prev) => prev.filter((a) => a._numId !== selected._numId));
      setFeedback({ type: "success", message: `${selected.name} has been archived.` });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    } finally {
      setArchiving(false);
    }
  };

  // ── Deactivate ────────────────────────────────────────────────────────────
  const handleDisable = async () => {
    if (!selected) return;
    setDisableOpen(false);
    try {
      // 🔌 TODO: call updateAuth(selected._numId, { account_status: "inactive" })
      setAccounts((prev) =>
        prev.map((a) => a._numId === selected._numId ? { ...a, status: "Inactive" } : a)
      );
      setFeedback({ type: "success", message: `${selected.name} has been deactivated.` });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  // ── Reset Password ─────────────────────────────────────────────────────────
  const handleResetPassword = async () => {
    if (!selected) return;
    setResetOpen(false);
    try {
      // 🔌 TODO: POST /api/employees/resetPassword/${selected._numId}
      setFeedback({ type: "success", message: `Password reset email sent to ${selected.email}.` });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = accounts.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch  = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    const matchesRole    = roleFilter   === "All" || a.role.toLowerCase()   === roleFilter.toLowerCase();
    const matchesStatus  = statusFilter === "All" || a.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full animate-fade-in">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div className="mb-1">
        <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none">
          Manage Accounts
        </h1>
        <p className="text-custom-gray text-sm mt-1">Manage, create, and modify accounts of each User</p>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 my-6">
        <input
          type="text"
          placeholder="Search…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm outline-none flex-1 max-w-xs"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-gray outline-none"
        >
          <option value="All">Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="staff">Staff</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-custom-gray-2 rounded-md px-3 py-2 text-sm text-custom-gray outline-none"
        >
          <option value="All">Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button
          onClick={() => setCreateOpen(true)}
          className="ml-auto flex items-center gap-1.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black text-sm font-medium px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          + Create New Account
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

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-custom-red">
          {error} — <button onClick={fetchAccounts} className="underline">retry</button>
        </div>
      )}

      {/* ── TABLE ───────────────────────────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-custom-black mb-4">Accounts List</h2>
        <div className="bg-custom-white border border-custom-gray-2 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-custom-gray uppercase border-b border-custom-gray-2">
              <tr>
                <th className="px-5 py-4 font-medium">User ID</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Branch</th>
                <th className="px-5 py-4 font-medium">Date Created</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center text-custom-gray italic">
                    Loading accounts…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-5 py-10 text-center text-custom-gray italic">
                    No accounts found.
                  </td>
                </tr>
              ) : (
                filtered.map((account, index) => (
                  <tr
                    key={account._numId}
                    className={index % 2 === 0 ? "bg-custom-primary/20" : "bg-custom-white"}
                  >
                    <td className="px-5 py-3 text-custom-gray font-mono text-xs">{account.id}</td>
                    <td className="px-5 py-3 text-custom-gray">{account.email}</td>
                    <td className="px-5 py-3 font-medium text-custom-black">{account.name}</td>
                    <td className="px-5 py-3 text-custom-gray capitalize">{account.role}</td>
                    <td className="px-5 py-3 text-custom-gray">{account.branch}</td>
                    <td className="px-5 py-3 text-custom-gray">{account.date}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        account.status === "Active"
                          ? "bg-green-100 text-custom-green"
                          : "bg-custom-gray-2 text-custom-gray"
                      }`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => openInfo(account)}
                        className="text-xs font-semibold px-3 py-1.5 bg-custom-primary hover:bg-custom-primary/80 text-custom-black rounded-md transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODALS ──────────────────────────────────────────────────────── */}

      {/* Account Info */}
      <AccountInfoModal
        isOpen={infoOpen}
        account={selected}
        onClose={closeAll}
        onEdit={() => { setInfoOpen(false); setEditOpen(true); }}
        onReset={() => { setInfoOpen(false); setResetOpen(true); }}
        onDisable={() => { setInfoOpen(false); setDisableOpen(true); }}
        onArchive={handleArchive}
      />

      {/* Edit Account */}
      <EditAccountModal
        isOpen={editOpen}
        account={selected}
        onClose={closeAll}
        onSave={() => { closeAll(); fetchAccounts(); }}
      />

      {/* Create Account */}
      <CreateAccountModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={() => { setCreateOpen(false); fetchAccounts(); }}
      />

      {/* Disable / Deactivate confirm — ADMIN - DISABLE.png */}
      <ConfirmDialog
        isOpen={disableOpen}
        title="Are you sure you want to disable this account?"
        onYes={handleDisable}
        onNo={() => setDisableOpen(false)}
      />

      {/* Reset Password confirm — ADMIN - RESET.png */}
      <ConfirmDialog
        isOpen={resetOpen}
        title="Are you sure you want to reset the password for this account?"
        subtext="The owner of the account will be notified and sent an email for the one-time generated password"
        onYes={handleResetPassword}
        onNo={() => setResetOpen(false)}
      />

      {/* Archiving spinner overlay */}
      {archiving && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[80]">
          <div className="bg-custom-white rounded-xl px-8 py-6 flex items-center gap-3 shadow-xl">
            <Loader2 size={20} className="animate-spin text-custom-gray" />
            <span className="text-sm text-custom-black font-medium">Archiving account…</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountsPage;
