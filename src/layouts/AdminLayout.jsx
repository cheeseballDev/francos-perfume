import { Archive, LayoutDashboard, Logs, Server, UserPen } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/FrancoPerfumeLogo.png";

/*
  AdminLayout
  ─────────────────────────────────────────────────────────────────────────────
  PURPOSE:
    Wrapper layout for all /admin/* routes. Replaces DashboardLayout for users
    whose role is "admin". The admin has a completely separate navigation set:

      Dashboard  → /admin
      Accounts   → /admin/accounts
      Audit Log  → /admin/audit-log
      Backups    → /admin/backups

    Admins do NOT see Inventory, Requests, POS, Forecast, etc. They manage
    the system — accounts, audit records, and database restore points.

  SIDEBAR ACTIVE STATE:
    We derive the active item from the current URL (`useLocation`) instead of
    a stateful `activeTab` variable. This means the correct item highlights on
    a hard refresh or direct URL navigation — a more robust pattern.

  PROPS:
    userEmail  — shown in the header user area
    onLogout   — clears the user state in App.jsx and redirects to /login
  ─────────────────────────────────────────────────────────────────────────────
*/

// Sidebar nav items — each maps a label to a route
const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin",          icon: LayoutDashboard },
  { label: "Accounts",  to: "/admin/accounts", icon: UserPen         },
  { label: "Audit Log", to: "/admin/audit-log",icon: Logs            },
  { label: "Backups",   to: "/admin/backups",  icon: Server          },
];

const AdminLayout = ({ userEmail, onLogout }) => {
  const location = useLocation();

  // Determine which nav item is "active" by comparing the current pathname.
  // "/admin" is an exact match; sub-routes use startsWith so "/admin/accounts"
  // correctly highlights the "Accounts" item.
  const isActive = (to) =>
    to === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(to);

  const tabClass = (to) =>
    `flex items-center gap-3 px-6 py-5 w-full cursor-pointer transition-colors duration-200 ${
      isActive(to)
        ? "bg-custom-primary/20 text-custom-white border-r-4 border-custom-primary"
        : "text-custom-gray hover:bg-white/10 hover:text-custom-white"
    }`;

  return (
    <div className="flex h-screen bg-custom-white text-custom-black font-montserrat text-[16px]">

      {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside className="w-64 bg-custom-black text-custom-white flex flex-col z-20 shrink-0">

        {/* Logo + role label */}
        <div className="py-6 px-6 border-b border-white/10 flex flex-col items-center">
          <img src={logo} alt="Franco's Logo" className="h-24 w-auto object-contain mb-4" />
          <span className="text-xs tracking-widest text-custom-gray font-semibold uppercase">
            Main Menu
          </span>
          {/* Admin badge — visually distinguishes the admin shell from the manager shell */}
          <span className="mt-2 text-[10px] bg-custom-primary/30 text-custom-primary border border-custom-primary/40 px-3 py-0.5 rounded-full font-bold tracking-wider uppercase">
            Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} className={tabClass(to)}>
              <Icon size={22} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout at the bottom of the sidebar */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={onLogout}
            className="w-full text-left text-xs text-custom-gray hover:text-custom-white transition-colors px-2 py-2"
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header bar */}
        <header className="h-14 border-b border-custom-gray-2 bg-custom-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6 text-sm text-custom-gray">
            {/* Date — rendered in the header as per the prototype */}
            <span>
              <strong className="text-custom-black">Date:</strong>{" "}
              {new Date().toLocaleDateString("en-PH", {
                year: "numeric", month: "2-digit", day: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-custom-gray">
            {/* Bell icon placeholder */}
            <button className="hover:text-custom-black transition-colors">🔔</button>

            {/* User display + logout */}
            <div className="flex items-center gap-2">
              <span className="text-custom-black font-medium">{userEmail ?? "Admin"}</span>
              <button
                onClick={onLogout}
                className="text-xs text-custom-gray hover:text-custom-red transition-colors"
              >
                ↓
              </button>
            </div>
          </div>
        </header>

        {/* Page content — Outlet renders the matched child route */}
        <main className="flex-1 p-8 overflow-auto bg-custom-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
