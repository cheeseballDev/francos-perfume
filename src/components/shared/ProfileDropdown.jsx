import { ArrowRightLeft, LogOut, Settings, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import LogoutModal from './LogoutModal';

const ProfileDropdown = ({ user, onSwitchAccess, onLogout /*theme = 'dark' */ }) => {
  const canSwitchAccess = user.trueRole === 'manager';
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayUsername = user.email ? user.email.split('@')[0] : 'Employee Name';

  /* Adapts the text color based on where you put the component
  const triggerTextColor = theme === 'dark'
    ? 'text-custom-gray hover:text-custom-white'
    : 'text-custom-black hover:text-custom-black/70';
    */

    
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 pt-2" ref={dropdownRef}>

      {/* The Clickable Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 cursor-pointer transition-colors text-custom-gray hover:text-custom-white`}
      >
        <User size={20} />
        <span className="font-medium text-[15px]">{displayUsername}</span>
        <span className="text-xs">▼</span>
      </div>
      {/* The Floating Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-48 bg-custom-black text-custom-white rounded shadow-2xl overflow-hidden flex flex-col border border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors">
            <Settings size={18} className="text-custom-gray-2" />
            <span className="text-sm font-medium">Settings</span>
          </div>

          {canSwitchAccess && (
            <div
              onClick={() => {
                setIsOpen(false);
                onSwitchAccess();
              }}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <ArrowRightLeft size={18} className="text-custom-gray-2" />
              <span className="text-sm font-medium">Switch Access</span>
            </div>
          )}

          <div
            onClick={() => {
              setIsOpen(false);
              setShowLogoutModal(true);
            }}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-custom-red hover:bg-custom-red/80 transition-colors"
          >
            <LogOut size={18} className="text-custom-white" />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <LogoutModal
          setShowLogoutModal={setShowLogoutModal}
          onLogout={onLogout}
          />
      )}
    </div>
  );
};

export default ProfileDropdown;
