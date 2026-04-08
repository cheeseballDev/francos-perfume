import React from "react";

const AccountInfoModal = ({ isOpen, onClose, account, onEdit }) => {
  if (!isOpen || !account) return null;

  /* 🔌 BACKEND TEMPLATES FOR ACTIONS
     --------------------------------
     Edit: Navigate to edit form or toggle fields
     Reset Password: POST /api/accounts/${account.id}/reset-password
     Deactivate: PATCH /api/accounts/${account.id}/status { status: 'Inactive' }
     Archive: POST /api/accounts/${account.id}/archive
  */

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in font-montserrat">
      <div className="bg-[#F8F9FB] rounded-2xl shadow-xl w-full max-w-[600px] p-10 relative">
        {/* HEADER CONTROLS */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 text-xl"
        >
          ‹
        </button>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-4xl font-extrabold text-[#333] text-center mb-12 tracking-tight">
          Account Information
        </h2>

        {/* DATA GRID */}
        <div className="space-y-6 px-4">
          {/* NAMES ROW */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">First name:</p>
              <p className="text-sm font-extrabold text-[#333] mt-1">
                {account.firstName || account.name.split(" ")[0]}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Middle name:</p>
              <p className="text-sm font-extrabold text-[#333] mt-1">
                {account.middleName || "Joever"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Last name:</p>
              <p className="text-sm font-extrabold text-[#333] mt-1">
                {account.lastName || account.name.split(" ")[1]}
              </p>
            </div>
          </div>

          {/* ADDRESS */}
          <div>
            <p className="text-xs text-gray-400 font-medium">Address:</p>
            <p className="text-sm font-extrabold text-[#333] mt-1 uppercase">
              {account.address || "67 BLK 420 STREET 69 FLOOR"}
            </p>
          </div>

          {/* EMAIL & CONTACT */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Email:</p>
              <p className="text-sm font-extrabold text-[#333] mt-1">
                {account.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Contact no.:</p>
              <p className="text-sm font-extrabold text-[#333] mt-1">
                {account.contactNo || "4206967211738"}
              </p>
            </div>
          </div>

          {/* BRANCH & ROLE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">Branch:</p>
              <p className="text-sm font-extrabold text-[#333] mt-1">
                {account.branch}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Role:</p>
              <p className="text-sm font-extrabold text-[#333] mt-1 uppercase">
                {account.role}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mt-12 px-4">
          <button
            onClick={onEdit} // This triggers the edit flow
            className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-600 font-medium py-2.5 rounded-md text-sm transition-colors shadow-sm"
          >
            Edit Account
          </button>
          <button className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 font-medium py-2.5 rounded-md text-sm transition-colors">
            Reset Password
          </button>
          <button className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 font-medium py-2.5 rounded-md text-sm transition-colors">
            Deactivate Account
          </button>
          <button className="border border-[#D47B7B] text-[#D47B7B] hover:bg-red-50 font-medium py-2.5 rounded-md text-sm transition-colors">
            Archive Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoModal;
