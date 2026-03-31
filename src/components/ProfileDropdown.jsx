import React, { useState, useRef, useEffect } from 'react';
import { Settings, ArrowRightLeft, LogOut, User } from 'lucide-react';

const ProfileDropdown = ({ userEmail, onLogout, canSwitchAccess, onSwitchAccess, theme = 'dark' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const displayUsername = userEmail ? userEmail.split('@')[0] : 'Employee Name';

  // Adapts the text color based on where you put the component
  const triggerTextColor = theme === 'dark' 
    ? 'text-gray-400 hover:text-white' 
    : 'text-gray-700 hover:text-gray-900';

  // Bonus: This automatically closes the dropdown if the user clicks anywhere else on the screen!
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
        className={`flex items-center gap-2 cursor-pointer transition-colors ${triggerTextColor}`}
      >
        <User size={20} />
        <span className="font-medium text-[15px]">{displayUsername}</span>
        <span className="text-xs">▼</span>
      </div>

      {/* The Floating Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-48 bg-[#1E1E1E] text-white rounded shadow-2xl overflow-hidden flex flex-col border border-[#333]">
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#333] transition-colors">
            <Settings size={18} className="text-gray-300" />
            <span className="text-sm font-medium">Settings</span>
          </div>
          
          {canSwitchAccess && (
            <div 
              onClick={() => {
                setIsOpen(false);
                onSwitchAccess();
              }} 
              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#333] transition-colors"
            >
              <ArrowRightLeft size={18} className="text-gray-300" />
              <span className="text-sm font-medium">Switch Access</span>
            </div>
          )}
          
          <div 
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }} 
            className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-[#7D162E] hover:bg-[#631124] transition-colors"
          >
            <LogOut size={18} className="text-gray-100" />
            <span className="text-sm font-medium">Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;