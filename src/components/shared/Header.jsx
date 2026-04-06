import { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ role, userEmail, onLogout, canSwitchAccess, onSwitchAccess }) => {
  const [currentDate, setCurrentDate] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Sta. Lucia");
  

  useEffect(() => {
    const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
    const phtDate = new Intl.DateTimeFormat('en-CA', options).format(new Date());
    setCurrentDate(phtDate.replace(/-/g, '/'));
  }, []);

  const normalizedRole = role ? role.toLowerCase() : '';
  const canChangeLocation = normalizedRole === 'manager';

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
        <div className="flex gap-8 text-[14px] text-gray-600 items-center">
           <p><span className="font-semibold text-gray-800">Date:</span> {currentDate}</p>
           
           <div className="flex items-center gap-2">
             <span className="font-semibold text-gray-800">Location:</span>
             {canChangeLocation ? (
               <select 
                 value={selectedLocation}
                 onChange={(e) => setSelectedLocation(e.target.value)}
                 className="border border-[#C0C0C0] rounded px-2 py-1 text-gray-700 bg-white text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D4C4B0] transition-colors"
               >
                 <option value="All">All Branches</option>
                 <option value="Sta. Lucia">Sta. Lucia</option>
                 <option value="Riverbanks">Riverbanks</option>
               </select>
             ) : (
               <span className="text-gray-600">Sta. Lucia</span>
             )}
           </div>
        </div>
        
        {/* OUR CLEAN NEW COMPONENT */}
        <ProfileDropdown 
          userEmail={userEmail} 
          onLogout={() => setShowLogoutModal(true)} 
          canSwitchAccess={canSwitchAccess} 
          onSwitchAccess={onSwitchAccess} 
          theme="light" 
        />
        
      </header>

      {/* CONFIRMATION LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white p-8 rounded-md shadow-2xl max-w-sm w-full mx-4 border border-gray-100 animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Sign Out</h3>
            <p className="text-gray-600 mb-8 text-sm">Are you sure you want to end your current session?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="px-5 py-2.5 border border-[#C0C0C0] rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={onLogout} className="px-5 py-2.5 bg-[#7D162E] text-white rounded font-medium hover:bg-[#631124] transition-colors text-sm">
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;