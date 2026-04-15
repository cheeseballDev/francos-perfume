import React from 'react';

const AccountInfoModal = ({ isOpen, onClose, account, onEditClick }) => {
  if (!isOpen || !account) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-2xl leading-none">‹</span>
          </button>
          <h2 className="text-2xl font-bold text-[#333]">Account Information</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <span className="text-xl leading-none">✕</span>
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">First name:</p>
              <p className="font-bold text-[#333] text-lg">{account.name.split(' ')[0]}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Middle name:</p>
              <p className="font-bold text-[#333] text-lg">Joever</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Last name:</p>
              <p className="font-bold text-[#333] text-lg">{account.name.split(' ').slice(1).join(' ')}</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-gray-400 mb-1">Address:</p>
            <p className="font-bold text-[#333] text-lg uppercase">67 BLK 420 STREET 69 FLOOR</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">Email:</p>
              <p className="font-bold text-[#333] text-lg">{account.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Contact no.:</p>
              <p className="font-bold text-[#333] text-lg">4206967211738</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs text-gray-400 mb-1">Branch:</p>
              <p className="font-bold text-[#333] text-lg">{account.branch}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Role:</p>
              <p className="font-bold text-[#333] text-lg uppercase">{account.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { onClose(); onEditClick(); }}
              className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#333] py-2.5 rounded-md font-medium transition-colors"
            >
              Edit Account
            </button>
            <button className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">
              Reset Password
            </button>
            <button className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">
              Deactivate Account
            </button>
            <button className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 py-2.5 rounded-md font-medium transition-colors">
              Archive Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoModal;