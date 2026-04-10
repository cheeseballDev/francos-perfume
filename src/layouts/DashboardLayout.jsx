import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom"; // NEW: Outlet is the placeholder
import Header from "../components/shared/Header";
import Sidebar from "../components/shared/Sidebar";
import POS from "../pages/pos/PointOfSalePage";
import Discount from "../pages/dashboard/DiscountPage"; // NEW

const DashboardLayout = ({
  trueRole,
  activeRole: initialActiveRole,
  userEmail,
  onLogout,
}) => {
  const baseRole = trueRole ? trueRole.toLowerCase() : "";
  const [currentActiveRole, setCurrentActiveRole] = useState(
    initialActiveRole ? initialActiveRole.toLowerCase() : baseRole,
  );

  // We keep activeTab for now so the Sidebar knows what to highlight
  const isCashier =
    currentActiveRole === "cashier staff" || currentActiveRole === "cashier";
  const [activeTab, setActiveTab] = useState(isCashier ? "POS" : "Dashboard");

  // NEW: This helps keep the Sidebar in sync with the URL
  const location = useLocation();

  useEffect(() => {
    if (currentActiveRole === "cashier staff") {
      setActiveTab("POS");
    } else if (currentActiveRole === "manager") {
      setActiveTab("Dashboard");
    }
  }, [currentActiveRole]);

  const handleSwitchAccess = () => {
    currentActiveRole === "manager"
      ? setCurrentActiveRole("cashier staff")
      : setCurrentActiveRole("manager");
  };

  const canSwitchAccess = baseRole === "manager";

  // POS logic remains a "hijack" for now
  if (activeTab === "POS") {
    return (
      <POS
        userEmail={userEmail}
        onLogout={onLogout}
        canSwitchAccess={canSwitchAccess}
        onSwitchAccess={handleSwitchAccess}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#F7F7F9] text-[#333] font-montserrat text-[16px]">
      <Sidebar
        role={currentActiveRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header
          role={currentActiveRole}
          userEmail={userEmail}
          onLogout={onLogout}
          canSwitchAccess={canSwitchAccess}
          onSwitchAccess={handleSwitchAccess}
        />

        <main className="flex-1 p-8 overflow-auto bg-[#F7F7F9]">
          <Outlet context={{ role: currentActiveRole }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
