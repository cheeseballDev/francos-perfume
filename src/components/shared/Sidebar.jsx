import { Archive, Barcode, Boxes, ChartNoAxesCombined, FileClock, HandHelping, LayoutDashboard, Logs, Tag, UserPen } from 'lucide-react';
import logo from '../../assets/FrancoPerfumeLogo.png';

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const companyPictureAlt = "Franco's Logo";

  const normalizedRole = role ? role.toLowerCase() : '';
  
  const isManager = normalizedRole === 'manager';

  const getTabClass = (tabName) => {
    return `flex items-center w-full gap-2 cursor-pointer p-5 transition-colors duration-300
    ${
      activeTab === tabName ? 'bg-custom-primary/20 text-custom-white border-r-20 border-custom-primary' : 'hover:bg-[#333]'
    }`;
  };

  return (
    <div className="w-64 bg-custom-black text-custom-white flex flex-col z-20 shrink-0">
      <div className="py-6 px-6 border-b border-[#333] flex flex-col items-center justify-center ">
        <img src={logo} alt={companyPictureAlt} className="h-24 w-auto object-contain mb-6" />
        <span className="text-1xl tracking-widest text-custom-gray font-semibold uppercase">Main Menu</span>
      </div>
      
      <div className="w-full flex flex-col gap-2 overflow-y-auto sidebar-scroll">
        <div onClick={() => setActiveTab('Dashboard')} className={getTabClass('Dashboard')}>
            <LayoutDashboard size={24}/>
            <p className="text-1xl">Dashboard</p>
        </div>
    
        <div onClick={() => setActiveTab('Inventory')} className={getTabClass('Inventory')}>
            <Boxes size={24}/>
            <p className="text-1xl">Inventory</p>
        </div>
      
        <div onClick={() => setActiveTab('Requests')} className={getTabClass('Requests')}>
            <HandHelping size={24}/>
            <p className="text-1xl">Requests</p>
        </div>
          
        <div onClick={() => setActiveTab('Forecast')} className={getTabClass('Forecast')}>
            <ChartNoAxesCombined size={24}/>
            <p className="text-1xl">Forecast</p>
        </div>

        {isManager && (
          <div onClick={() => setActiveTab('Transactions')} className={getTabClass('Transactions')}>
            <FileClock size={24}/>
             <p className="text-1xl">Transactions</p>
          </div>
        )}

        {isManager && (
          <div onClick={() => setActiveTab('Barcode')} className={getTabClass('Barcode')}>
            <Barcode size={24}/>
             <p className="text-1xl">Barcode</p>
          </div>
        )}

        {isManager && (
          <div onClick={() => setActiveTab('Discount')} className={getTabClass('Discount')}>
            <Tag size={24}/>
             <p className="text-1xl">Discount</p>
          </div>
        )}

        {isManager && (
          <div onClick={() => setActiveTab('Audit Log')} className={getTabClass('Audit Log')}>
            <Logs size={24}/>
             <p className="text-1xl">Audit Log</p>
          </div>
        )}

        {isManager && (
          <div onClick={() => setActiveTab('Accounts')} className={getTabClass('Accounts')}>
            <UserPen size={24}/>
             <p className="text-1xl">Accounts</p>
          </div>
        )}

        {isManager && (
          <div onClick={() => setActiveTab('Archives')} className={getTabClass('Archives')}>
            <Archive size={24}/>
             <p className="text-1xl">Archives</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;