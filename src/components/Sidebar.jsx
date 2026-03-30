import React from 'react';
import logo from '../assets/FrancoPerfumeLogo.png';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const normalizedRole = role ? role.toLowerCase() : '';
  
  const isManager = normalizedRole === 'manager';
  const isInventoryStaff = normalizedRole === 'inventory staff' || normalizedRole === 'inventory';
  const isCashierStaff = normalizedRole === 'cashier staff' || normalizedRole === 'cashier';

  const canSeeDashboard = !isCashierStaff; 
  const canSeeInventory = isManager || isInventoryStaff;
  const canSeeRequests = isManager || isInventoryStaff;
  
  // NEW SEPARATED RULES
  const canSeePOS = isCashierStaff; 
  const canSeeTransactionHistory = isManager;
  
  const canSeeForecast = isManager;

  const getTabClass = (tabName) => {
    return `flex items-center gap-2 cursor-pointer p-3 rounded transition-colors ${
      activeTab === tabName ? 'bg-[#333] text-[#D4C4B0]' : 'hover:bg-[#333] text-gray-300'
    }`;
  };

  return (
    <div className="w-64 bg-[#1E1E1E] text-white flex flex-col z-20 shrink-0">
      <div className="py-10 px-6 border-b border-[#333] flex flex-col items-center justify-center mb-4">
        <img src={logo} alt="Franco's Logo" className="h-24 w-auto object-contain mb-6" />
        <span className="text-[12px] tracking-widest text-gray-500 font-semibold uppercase">Main Menu</span>
      </div>
      
      <div className="p-6 flex flex-col gap-2 overflow-y-auto">
        
        {canSeeDashboard && (
          <div onClick={() => setActiveTab('Dashboard')} className={getTabClass('Dashboard')}>
             <div className="w-4 h-4 bg-gray-400"></div>
             <p className="font-medium text-sm">Dashboard</p>
          </div>
        )}
        
        {canSeeInventory && (
          <div onClick={() => setActiveTab('Inventory')} className={getTabClass('Inventory')}>
             <div className="w-4 h-4 bg-gray-500"></div>
             <p className="font-medium text-sm">Inventory</p>
          </div>
        )}
        
        {canSeeRequests && (
          <div onClick={() => setActiveTab('Requests')} className={getTabClass('Requests')}>
             <div className="w-4 h-4 bg-gray-500"></div>
             <p className="font-medium text-sm">Requests</p>
          </div>
        )}

        {/* NEW POS TAB */}
        {canSeePOS && (
          <div onClick={() => setActiveTab('POS')} className={getTabClass('POS')}>
             <div className="w-4 h-4 bg-gray-500"></div>
             <p className="font-medium text-sm">Point of Sale (POS)</p>
          </div>
        )}

        {/* NEW TRANSACTION HISTORY TAB */}
        {canSeeTransactionHistory && (
          <div onClick={() => setActiveTab('Transaction History')} className={getTabClass('Transaction History')}>
             <div className="w-4 h-4 bg-gray-500"></div>
             <p className="font-medium text-sm">Transaction History</p>
          </div>
        )}
            
        {canSeeForecast && (
          <div onClick={() => setActiveTab('Forecast')} className={getTabClass('Forecast')}>
             <div className="w-4 h-4 bg-gray-500"></div>
             <p className="font-medium text-sm">Forecast</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;