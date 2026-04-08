import React, { useState, useEffect } from 'react';

const EditAccountModal = ({ isOpen, onClose, account, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    address: '',
    email: '',
    branch: '',
    role: ''
  });

  // Pre-fill the form when an account is selected
  useEffect(() => {
    if (account) {
      const names = account.name.split(' ');
      setFormData({
        firstName: account.firstName || names[0] || '',
        lastName: account.lastName || names[names.length - 1] || '',
        middleName: account.middleName || 'Joever',
        contactNo: account.contactNo || '4206967211738',
        address: account.address || '67 BLK 420 STREET 69 FLOOR',
        email: account.email || '',
        branch: account.branch || '',
        role: account.role?.toUpperCase() || 'STAFF'
      });
    }
  }, [account, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedAccount = {
      ...account,
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`,
    };

    /* 🔌 BACKEND TEMPLATE: UPDATE ACCOUNT
       try {
         const response = await fetch(`https://localhost:5001/api/accounts/${account.id}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         });
         if (response.ok) {
            onSave(updatedAccount);
            onClose();
         }
       } catch (err) { console.error("Update failed:", err); }
    */

    onSave(updatedAccount);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[60] animate-fade-in font-montserrat">
      <div className="bg-[#F8F9FB] rounded-2xl shadow-xl w-full max-w-[650px] p-10 relative">
        <button onClick={onClose} className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        
        <h2 className="text-4xl font-extrabold text-[#333] text-center mb-10 tracking-tight">Edit Account Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="First name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input 
              type="text" placeholder="Last name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Middle name"
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value})}
            />
            <input 
              type="text" placeholder="Contact no."
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.contactNo} onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
            />
          </div>

          <input 
            type="text" placeholder="Full address"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
          />

          <input 
            type="email" placeholder="Email" required
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          <div className="grid grid-cols-2 gap-4">
            <select 
              required className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm text-gray-500"
              value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})}
            >
              <option value="Sta. Lucia">Sta. Lucia</option>
              <option value="Riverbanks">Riverbanks</option>
            </select>
            <select 
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm text-gray-500"
              value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="STAFF">STAFF</option>
              <option value="MANAGER">MANAGER</option>
            </select>
          </div>

          <div className="flex justify-center gap-6 pt-6">
            <button 
              type="button" onClick={onClose}
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm text-gray-700"
            >
              <span className="text-lg">✕</span> Discard Changes
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-6 py-2 rounded-md font-medium text-sm transition-colors shadow-sm text-gray-700"
            >
              <span className="text-lg">✓</span> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAccountModal;