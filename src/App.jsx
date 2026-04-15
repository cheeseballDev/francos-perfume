import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MobileBlocker from './components/features/pos_components/MobileBlocker';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import ArchivesPage from './pages/dashboard/ArchivesPage';
import AuditLogPage from './pages/dashboard/AuditLogPage';
import BarcodePage from './pages/dashboard/BarcodePage';
import DiscountPage from './pages/dashboard/DiscountPage';
import ForecastPage from './pages/dashboard/ForecastPage';
import HomePage from './pages/dashboard/HomePage';
import InventoryPage from './pages/dashboard/InventoryPage';
import AccountsPage from './pages/dashboard/ManageAccountsPage';
import RequestPage from './pages/dashboard/RequestPage';
import TransactionsPage from './pages/dashboard/TransactionsPage';
import PointOfSalePage from './pages/pos/PointOfSalePage';

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) return <Navigate to="/login" />

  if (allowedRoles && !allowedRoles.includes(user.trueRole)) return <Navigate to="/home" replace />;

  return <Outlet />;
}

const App = () => {

  const [user, setUser] = useState(() => {
    const savedEmail = sessionStorage.getItem("email");
    const savedToken = sessionStorage.getItem("token");
    const savedTrueRole = sessionStorage.getItem("trueRole");
    const savedActiveRole = sessionStorage.getItem("activeRole");

    if (savedEmail && savedToken) {
      return { 
        email: savedEmail,
        token: savedToken,
        trueRole: savedTrueRole,
        activeRole: savedActiveRole
      };
    }

    return null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    
    sessionStorage.setItem("email", userData.email);
    sessionStorage.setItem("token", userData.token);
    sessionStorage.setItem("trueRole", userData.trueRole);
    sessionStorage.setItem("activeRole", userData.activeRole);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  const handleRoleSwitch = (role) => {
    setUser(prev => ({
      ...prev,
      activeRole: role
    }));
    sessionStorage.setItem('activeRole', role);
  }


  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobileView) {
    return <MobileBlocker />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={handleLogin} user={user} /> : <Navigate to={user.activeRole === 'cashier' ? '/pos' : '/home'} replace />} 
        />

        {/* Dashboard Wrapper */}
        <Route 
          path="/home" 
          element={
            user ? (
              <DashboardLayout 
                user={user}
                onRoleSwitch={handleRoleSwitch}
                onLogout={handleLogout} 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Sub-pages that show up inside the DashboardLayout Outlet */}
          <Route index element={<HomePage role={user?.trueRole} />} />
          <Route path="/home/inventory" element={<InventoryPage role={user?.trueRole} />} />
          <Route path="/home/requests" element={<RequestPage />} />
          <Route path="/home/forecast" element={<ForecastPage />} />

          {/* Manager ONLY */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['manager']} />}>
            <Route path="/home/barcode" element={<BarcodePage/>} />
            <Route path="/home/transactions" element={<TransactionsPage />} /> {/* Correctly matches the import now */}
            <Route path="/home/discount" element={<DiscountPage />} />
            <Route path="/home/accounts" element={<AccountsPage />} /> 
            <Route path="/home/archives" element={<ArchivesPage />} />
            <Route path="/home/audit" element={<AuditLogPage />} />
          </Route>

        </Route>

          <Route path="/pos"
            element={
              <ProtectedRoute user={user} allowedRoles={['manager', 'cashier']}>
                <PointOfSalePage user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;