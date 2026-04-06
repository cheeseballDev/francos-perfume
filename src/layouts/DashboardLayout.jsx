import { useEffect, useState } from 'react';
import Header from '../components/shared/Header';
import Sidebar from '../components/shared/Sidebar';
import POS from '../pages/cashier/PointOfSalePage';
import Forecast from '../pages/dashboard/ForecastPage';
import DashboardHome from '../pages/dashboard/HomePage'; // NEW IMPORT
import Inventory from '../pages/dashboard/InventoryPage';
import Request from '../pages/dashboard/RequestPage';
import Transaction from '../pages/dashboard/TransactionsPage';

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
    currentActiveRole === 'manager' ? setCurrentActiveRole('cashier staff') : setCurrentActiveRole('manager');
  };

  const canSwitchAccess = baseRole === 'manager';

  {
    /*
      SET UI TO POS
    */
  }
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
        
        {
          /* 
            ADD ALL PAGES HERE
          */
        }
        <main className="flex-1 p-8 overflow-auto bg-[#F7F7F9]">
          {activeTab === 'Dashboard' && <DashboardHome role ={currentActiveRole}/>}
          {activeTab === 'Inventory' && <Inventory role ={currentActiveRole}/>}
          {activeTab === 'Forecast' && <Forecast />}
          {activeTab === 'Requests' && <Request />}
          {activeTab === 'Transactions' && <Transaction />}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;