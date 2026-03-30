import React, { useState } from 'react';
import StaffLogin from './pages/StaffLogin';
import DashboardLayout from './pages/DashboardLayout';

const App = () => {
  // This state tracks if someone is logged in, and what their role/email is.
  // When it is 'null', they are forced to the login screen.
  const [user, setUser] = useState(null);

  // This gets passed to the StaffLogin component
  const handleLogin = (role, email) => {
    setUser({ role, email });
  };

  // This gets passed to the DashboardLayout Header component
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      {!user ? (
        <StaffLogin onLogin={handleLogin} />
      ) : (
        <DashboardLayout 
          role={user.role} 
          userEmail={user.email} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
};

export default App;