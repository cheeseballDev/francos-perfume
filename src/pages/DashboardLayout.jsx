
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Inventory from './Inventory';

const DashboardLayout = ({ role, userEmail, onLogout }) => {

  const isCashier = role && (role.toLowerCase() === 'cashier staff' || role.toLowerCase() === 'cashier');
  
  const [activeTab, setActiveTab] = useState(isCashier ? 'Transactions' : 'Dashboard');

  return (
    <div className="flex h-screen bg-[#F7F7F9] text-[#333] font-montserrat text-[16px]">
      
      
      <Sidebar 
        role={role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        
        <Header 
          role={role} 
          userEmail={userEmail} 
          onLogout={onLogout} 
        />

        
        <main className="flex-1 p-8 overflow-auto bg-[#F7F7F9]">
          
          {activeTab === 'Dashboard' && (
            <div className="animate-fade-in">
              <h1 className="text-[32px] font-bold text-gray-900 mb-2 leading-none tracking-tight">Dashboard</h1>
              <p className="text-gray-500 text-sm mb-8">System overview and quick metrics.</p>
              <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                Metrics Dashboard Placeholder
              </div>
            </div>
          )}

          {activeTab === 'Inventory' && <Inventory />}
          
          
          {activeTab === 'Requests' && <h1 className="text-[32px] font-bold text-gray-900">Delivery Requests</h1>}
          {activeTab === 'Transactions' && <h1 className="text-[32px] font-bold text-gray-900">Point of Sale (POS)</h1>}
          {activeTab === 'Forecast' && <h1 className="text-[32px] font-bold text-gray-900">Sales Forecasting</h1>}
          {activeTab === 'Accounts' && <h1 className="text-[32px] font-bold text-gray-900">Manage Accounts</h1>}
          {activeTab === 'Audit Logs' && <h1 className="text-[32px] font-bold text-gray-900">System Audit Logs</h1>}
          {activeTab === 'Archives' && <h1 className="text-[32px] font-bold text-gray-900">Archived Data</h1>}

        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;