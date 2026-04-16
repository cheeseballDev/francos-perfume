import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ user, onLogout, onSwitchAccess }) => {

  const canSwitchAccess = user.trueRole === 'manager';
  const canChangeLocation = user.trueRole === 'manager';
  const [currentDate, setCurrentDate] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Sta. Lucia");
  

  useEffect(() => {
    const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' };
    const phtDate = new Intl.DateTimeFormat('en-CA', options).format(new Date());
    setCurrentDate(phtDate.replace(/-/g, '/'));
  }, []);

  return (
    <>
      <header className="h-16 bg-white border-b border-custom-gray-2 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
        <div className="flex gap-8 text-[14px] text-custom-gray items-center">
           <p><span className="font-semibold text-custom-black">Date:</span> {currentDate}</p>

           <div className="flex items-center gap-2">
             <span className="font-semibold text-custom-black">Location:</span>
             {canChangeLocation ? (
               <select
                 value={selectedLocation}
                 onChange={(e) => setSelectedLocation(e.target.value)}
                 className="border border-custom-gray rounded px-2 py-1 text-custom-black bg-white text-sm cursor-pointer hover:border-custom-gray focus:outline-none focus:ring-1 focus:ring-custom-primary transition-colors"
               >
                 <option value="All">All Branches</option>
                 <option value="Sta. Lucia">Sta. Lucia</option>
                 <option value="Riverbanks">Riverbanks</option>
               </select>
             ) : (
               <span className="text-custom-gray">Sta. Lucia</span>
             )}
           </div>
        </div>
        
        {/* OUR CLEAN NEW COMPONENT */}
        <ProfileDropdown
          user={user}
          showLogoutModal={() => setShowLogoutModal(true)}
          onSwitchAccess={onSwitchAccess}
          //theme='light'  // Uncomment this line if you want to use the light theme variant
        />
        
      </header>

      {/* CONFIRMATION LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all">
          <div className="bg-white p-8 rounded-md shadow-2xl max-w-sm w-full mx-4 border border-custom-gray-2 animate-fade-in">
            <h3 className="text-2xl font-bold text-custom-black mb-2 tracking-tight">Sign Out</h3>
            <p className="text-custom-gray mb-8 text-sm">Are you sure you want to end your current session?</p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
              <Button variant="destructive" onClick={onLogout}>Yes, Sign Out</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;