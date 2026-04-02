import { Boxes, ChartNoAxesCombined, FileClock, HandHelping, LayoutDashboard } from 'lucide-react';
import logo from '../../assets/FrancoPerfumeLogo.png';

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
    return `flex items-center justify-start w-full gap-2 cursor-pointer p-5 transition-colors ${
      activeTab === tabName ? 'bg-custom-primary/20 text-custom-white border-r-20 border-custom-primary' : 'hover:bg-[#333]'
    }`;
  };

  return (
    <div className="w-64 bg-[#1E1E1E] text-white flex flex-col z-20 shrink-0">
      <div className="py-10 px-6 border-b border-[#333] flex flex-col items-center justify-center mb-4">
        <img src={logo} alt="Franco's Logo" className="h-24 w-auto object-contain mb-6" />
        <span className="text-1xl tracking-widest text-custom-gray font-semibold uppercase">Main Menu</span>
      </div>
      
      <div className="flex flex-col gap-2 overflow-y-auto ">
        {canSeeDashboard && (
          <div onClick={() => setActiveTab('Dashboard')} className={getTabClass('Dashboard')}>
             <LayoutDashboard size={32}/>
             <p className="text-xl">Dashboard</p>
          </div>
        )}
        
        {canSeeInventory && (
          <div onClick={() => setActiveTab('Inventory')} className={getTabClass('Inventory')}>
             <Boxes size={32}/>
             <p className="text-xl">Inventory</p>
          </div>
        )}
        
        {canSeeRequests && (
          <div onClick={() => setActiveTab('Requests')} className={getTabClass('Requests')}>
             <HandHelping size={32}/>
             <p className="text-xl">Requests</p>
          </div>
        )}

        {canSeeTransactionHistory && (
          <div onClick={() => setActiveTab('Transaction History')} className={getTabClass('Transaction History')}>
            <FileClock size={32}/>
             <p className="text-xl">Transactions</p>
          </div>
        )}
            
        {canSeeForecast && (
          <div onClick={() => setActiveTab('Forecast')} className={getTabClass('Forecast')}>
             <ChartNoAxesCombined size={32}/>
             <p className="text-xl">Forecast</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;