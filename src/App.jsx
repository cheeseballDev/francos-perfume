import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MobileBlocker from './components/features/pos_components/MobileBlocker';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';

// Pages - Ensure these paths match your actual file structure
import Discount from './pages/dashboard/DiscountPage';
import Forecast from './pages/dashboard/ForecastPage';
import DashboardHome from './pages/dashboard/HomePage';
import Inventory from './pages/dashboard/InventoryPage';
import ManageAccounts from './pages/dashboard/ManageAccountsPage';
import Request from './pages/dashboard/RequestPage';
import TransactionsPage from './pages/dashboard/TransactionsPage'; // FIXED: Changed 'Transaction' to 'TransactionsPage'

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
          <Route index element={<DashboardHome role={user?.activeRole} />} />
          <Route path="inventory" element={<Inventory role={user?.activeRole} />} />
          <Route path="requests" element={<Request />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="transactions" element={<TransactionsPage />} /> {/* Correctly matches the import now */}
          <Route path="discount" element={<Discount />} />
          <Route path="accounts" element={<ManageAccounts />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;