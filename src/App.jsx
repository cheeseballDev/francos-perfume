import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MobileBlocker from './components/features/pos_components/MobileBlocker';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';

// Pages - Ensure these paths match your actual file structure
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

const App = () => {
  const [user, setUser] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (isMobileView) {
    return <MobileBlocker />;
  }

  return (
    <Router>
      <Routes>
        {/* If not logged in, show Login. If logged in, redirect to Dashboard */}
        <Route 
          path="/login" 
          element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} 
        />

        {/* Dashboard Wrapper */}
        <Route 
          path="/" 
          element={
            user ? (
              <DashboardLayout 
                trueRole={user.trueRole} 
                activeRole={user.activeRole} 
                userEmail={user.email} 
                onLogout={handleLogout} 
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          {/* Sub-pages that show up inside the DashboardLayout Outlet */}
          <Route index element={<HomePage role={user?.activeRole} />} />
          <Route path="inventory" element={<InventoryPage role={user?.activeRole} />} />
          <Route path="requests" element={<RequestPage />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="barcode" element={<BarcodePage/>} />
          <Route path="transactions" element={<TransactionsPage />} /> {/* Correctly matches the import now */}
          <Route path="discount" element={<DiscountPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="archives" element={<ArchivesPage />} />
          <Route path="audit" element={<AuditLogPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;