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
import { UseAuth } from './services/UseAuth';

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) return <Navigate to="/login" />
  if (allowedRoles && !allowedRoles.includes(user.trueRole)) { return <Navigate to="/home" replace />; };
  return <Outlet />;
}

const App = () => {
  const { user, login, logout, switchRole } = UseAuth();

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobileView) { return <MobileBlocker />; }
  

  return (
    <Router>
      <Routes>
        <Route path='/login' 
          element={
            !user ? <LoginPage onLogin={login} /> : <Navigate to={user.activeRole === 'cashier' ? '/pos' : '/home'} replace />
          }
        />

        <Route path='/home'
          element={
            user ? <DashboardLayout user={user} onRoleSwitch={switchRole} onLogout={logout} /> : <Navigate to='/login' replace /> 
          }
        >

        <Route index element={<HomePage role={user?.trueRole} />} />
        <Route path="inventory" element={<InventoryPage role={user?.trueRole} />} />
        <Route path="requests" element={<RequestPage />} />
        <Route path="forecast" element={<ForecastPage />} />

        {/* Manager ONLY */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['manager']} />}>
              <Route path="barcode" element={<BarcodePage />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="discount" element={<DiscountPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="archives" element={<ArchivesPage />} />
              <Route path="audit" element={<AuditLogPage />} />
          </Route>
        </Route>
        
        <Route element={<ProtectedRoute user={user} allowedRoles={['manager', 'cashier']} />}>
          <Route path="/pos" element={<PointOfSalePage user={user} onLogout={logout} />} />
        </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;