import { useEffect, useState } from 'react';
import Header from '../components/general_components/Header';
import Sidebar from '../components/general_components/Sidebar';
import DashboardHome from './DashboardHomePage'; // NEW IMPORT
import Inventory from './InventoryPage';
import POS from './PointOfSalePage';

const DashboardLayout = ({ trueRole, activeRole: initialActiveRole, userEmail, onLogout }) => {
  const baseRole = trueRole ? trueRole.toLowerCase() : '';
  const [currentActiveRole, setCurrentActiveRole] = useState(initialActiveRole ? initialActiveRole.toLowerCase() : baseRole);

  const isCashier = currentActiveRole === 'cashier staff' || currentActiveRole === 'cashier';
  const [activeTab, setActiveTab] = useState(isCashier ? 'POS' : 'Dashboard'); 

  useEffect(() => {
    if (currentActiveRole === 'cashier staff') {
      setActiveTab('POS');
    } else if (currentActiveRole === 'manager') {
      setActiveTab('Dashboard');
    }
  }, [currentActiveRole]);

  const handleSwitchAccess = () => {
    if (currentActiveRole === 'manager') {
      setCurrentActiveRole('cashier staff');
    } else {
      setCurrentActiveRole('manager');
    }
  };

  const canSwitchAccess = baseRole === 'manager';

  // FULL SCREEN TAKEOVER FOR POS
  if (activeTab === 'POS') {
    return (
      <POS 
        userEmail={userEmail}
        onLogout={onLogout}
        canSwitchAccess={canSwitchAccess}
        onSwitchAccess={handleSwitchAccess}
      />
    );
  }

  // STANDARD DASHBOARD LAYOUT
  return (
    <div className="flex h-screen bg-[#F7F7F9] text-[#333] font-montserrat text-[16px]">
      <Sidebar role={currentActiveRole} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          role={currentActiveRole} 
          userEmail={userEmail} 
          onLogout={onLogout} 
          canSwitchAccess={canSwitchAccess} 
          onSwitchAccess={handleSwitchAccess} 
        />
        
        <main className="flex-1 p-8 overflow-auto bg-[#F7F7F9]">
          
          {/* LOOK HOW CLEAN THIS IS NOW */}
          {activeTab === 'Dashboard' && <DashboardHome />}
          {activeTab === 'Inventory' && <Inventory role ={currentActiveRole}/>}
          
          {/* You can do the exact same thing for these three pages next! */}
          {activeTab === 'Requests' && <h1 className="text-[32px] font-bold">Delivery Requests</h1>}
          {activeTab === 'Transaction History' && <h1 className="text-[32px] font-bold">Transaction History</h1>}
          {activeTab === 'Forecast' && <h1 className="text-[32px] font-bold">Sales Forecasting</h1>}

        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;