import { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ user, onLogout, onSwitchAccess }) => {

  const canSwitchAccessAndChangeLocation = user.trueRole === 'manager';
  const [currentDate, setCurrentDate] = useState("");
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
             {canSwitchAccessAndChangeLocation ? (
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
          onLogout={onLogout}
          onSwitchAccess={onSwitchAccess}
          //theme='light'  // Uncomment this line if you want to use the light theme variant
        />
        
      </header>
    </>
  );
};

export default Header;