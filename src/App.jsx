import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { logout } from './services/LoginService';
import MobileBlocker from './components/features/pos_components/MobileBlocker';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import StaffLogin from './pages/auth/StaffLoginPage';

// ── Manager / Staff pages ────────────────────────────────────────────────────
import Inventory      from './pages/dashboard/InventoryPage';
import Request        from './pages/dashboard/RequestPage';
import Discount       from './pages/dashboard/DiscountPage';
import DashboardHome  from './pages/dashboard/HomePage';
import Forecast       from './pages/dashboard/ForecastPage';
import TransactionsPage from './pages/dashboard/TransactionsPage';
import ManageAccounts from './pages/dashboard/ManageAccountsPage';
import AuditLogPage   from './pages/dashboard/AuditLogPage';
import ArchivesPage   from './pages/dashboard/ArchivesPage';
import BarcodePage    from './pages/dashboard/BarcodePage';

// ── Admin pages ──────────────────────────────────────────────────────────────
// Admins have a completely separate layout and page set.
// They manage the system (accounts, audit logs, database backups) rather than
// day-to-day operations (inventory, POS, requests).
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAccountsPage  from './pages/admin/AdminAccountsPage';
import AdminAuditLogPage  from './pages/admin/AdminAuditLogPage';
import AdminBackupsPage   from './pages/admin/AdminBackupsPage';

const App = () => {
  const [user, setUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    logout(); // clears localStorage["token"]
    setUser(null);
  };

  if (isMobileView) return <MobileBlocker />;

  // Determine which home route to send the user to after login.
  // Admins go to /admin; everyone else goes to /.
  const isAdmin = user?.trueRole?.toLowerCase() === 'admin'
               || user?.activeRole?.toLowerCase() === 'admin';

  return (
    <Router>
      <Routes>
        {/* ── Login ─────────────────────────────────────────────────────── */}
        <Route
          path="/login"
          element={
            !user
              ? <StaffLogin onLogin={handleLogin} />
              : <Navigate to={isAdmin ? "/admin" : "/"} />
          }
        />

        {/* ── Admin shell (/admin/*) ─────────────────────────────────────
            Only rendered when the logged-in user has role "admin".
            Non-admin users who hit /admin are redirected to /.
        */}
        <Route
          path="/admin"
          element={
            user && isAdmin
              ? <AdminLayout userEmail={user.email} onLogout={handleLogout} />
              : <Navigate to={user ? "/" : "/login"} />
          }
        >
          {/* index = /admin */}
          <Route index              element={<AdminDashboardPage />} />
          <Route path="accounts"   element={<AdminAccountsPage />}  />
          <Route path="audit-log"  element={<AdminAuditLogPage />}  />
          <Route path="backups"    element={<AdminBackupsPage />}   />
        </Route>

        {/* ── Manager / Staff shell (/) ──────────────────────────────────
            Admins who visit / are redirected to /admin so they don't see
            the inventory/POS shell at all.
        */}
        <Route
          path="/"
          element={
            !user     ? <Navigate to="/login" /> :
            isAdmin   ? <Navigate to="/admin" /> :
            <DashboardLayout
              trueRole={user.trueRole}
              activeRole={user.activeRole}
              userEmail={user.email}
              onLogout={handleLogout}
            />
          }
        >
          <Route index              element={<DashboardHome role={user?.activeRole} />} />
          <Route path="inventory"   element={<Inventory role={user?.activeRole} />}     />
          <Route path="requests"    element={<Request />}                                />
          <Route path="forecast"    element={<Forecast />}                               />
          <Route path="transactions"element={<TransactionsPage />}                       />
          <Route path="discount"    element={<Discount />}                               />
          <Route path="accounts"    element={<ManageAccounts />}                         />
          <Route path="audit-log"   element={<AuditLogPage />}                           />
          <Route path="archives"    element={<ArchivesPage />}                           />
          <Route path="barcode"     element={<BarcodePage />}                            />
        </Route>

        {/* ── Fallback ───────────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to={user ? (isAdmin ? "/admin" : "/") : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;