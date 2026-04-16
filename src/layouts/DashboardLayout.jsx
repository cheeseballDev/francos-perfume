import { Outlet } from "react-router-dom"; // NEW: Outlet is the placeholder
import Header from "../components/shared/Header";
import Sidebar from "../components/shared/Sidebar";

const DashboardLayout = ({ user, onRoleSwitch, onLogout }) => {
  
  const { activeRole, email: userEmail } = user;

  const handleSwitchAccess = () => {
    const nextRole = activeRole === 'manager' ? 'cashier' : 'manager';
    onRoleSwitch(nextRole);
  };

  return (
    <div className="flex h-screen bg-[#F7F7F9] text-[#333] font-montserrat text-[16px]">
      <Sidebar
        user={user}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          user={user}
          onLogout={onLogout}
          onSwitchAccess={handleSwitchAccess}
        />

        <main className="flex-1 p-8 overflow-auto bg-[#F7F7F9]">
          <Outlet context={{ activeRole, userEmail }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
