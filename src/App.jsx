import { useState } from "react";
import DashboardLayout from "./pages/DashboardLayout";
import RoleLogin from "./pages/RoleLogin";
import StaffLogin from "./pages/StaffLogin";

function App() {
  const [view, setView] = useState("gateway");
  const [selectedRole, setSelectedRole] = useState("");
  const [userEmail, setUserEmail] = useState(""); 

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    setView("login");
  };

  const handleGoBack = () => {
    setView("gateway");
  };

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setView("dashboard");
  };

  const handleLogout = () => {
    setUserEmail(""); 
    setSelectedRole(""); 
    setView("gateway"); 
  };

  return (
    <div className="font-sans min-h-screen">
      {view === "gateway" && <RoleLogin onSelect={handleRoleSelect} />}
      
      {view === "login" && (
        <StaffLogin 
          role={selectedRole} 
          onBack={handleGoBack} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}
      
      {view === "dashboard" && (
        <DashboardLayout 
          role={selectedRole} 
          userEmail={userEmail} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default App;