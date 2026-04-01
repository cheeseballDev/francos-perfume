import { useEffect, useState } from 'react';
import MobileBlocker from './components/cashier_components/MobileBlocker';
import DashboardLayout from './components/layouts/DashboardLayout';
import StaffLogin from './pages/StaffLoginPage';

const App = () => {
  const [user, setUser] = useState(null);
  
  // NEW: State to track if the screen is too small
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // NEW: Actively listen for window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up the event listener when the app closes
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // NEW: If it's a mobile screen, completely hijack the app and show the blocker
  if (isMobileView) {
    return <MobileBlocker />;
  }

  // STANDARD APP RENDERING (Desktop/Large Tablet)
  return (
    <>
      {!user ? (
        <StaffLogin onLogin={handleLogin} />
      ) : (
        <DashboardLayout 
          trueRole={user.trueRole} 
          activeRole={user.activeRole} 
          userEmail={user.email} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
};

export default App;