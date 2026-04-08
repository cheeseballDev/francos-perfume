import React, { useState } from 'react';

const CreateAccountModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    address: '',
    email: '',
    branch: '',
    role: 'STAFF' // Default from your design
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Generate temporary ID and date for the table
    const newAccount = {
      id: Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      email: formData.email,
      name: `${formData.firstName} ${formData.lastName}`,
      role: formData.role,
      branch: formData.branch,
      date: new Date().toLocaleDateString('en-GB'), // DD/MM/YYYY
      status: 'Active'
    };

    /* 🔌 BACKEND TEMPLATE: POST NEW ACCOUNT
       try {
         const response = await fetch('https://localhost:5001/api/accounts', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         });
         if (response.ok) {
            const savedData = await response.json();
            onSave(savedData);
         }
       } catch (err) { console.error(err); }
    */

    onSave(newAccount);
    setFormData({ firstName: '', lastName: '', middleName: '', contactNo: '', address: '', email: '', branch: '', role: 'STAFF' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in font-montserrat">
      <div className="bg-[#F8F9FB] rounded-2xl shadow-xl w-full max-w-[650px] p-10 relative">
        <button onClick={onClose} className="absolute top-4 right-6 text-gray-400 hover:text-gray-700 text-2xl">✕</button>
        
        <h2 className="text-4xl font-extrabold text-[#333] text-center mb-10 tracking-tight">Create New Account:</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ROW 1: Names */}
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Enter first name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            />
            <input 
              type="text" placeholder="Enter last name" required
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            />
          </div>

          {/* ROW 2: Middle Name & Contact */}
          <div className="grid grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Enter middle name"
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.middleName} onChange={(e) => setFormData({...formData, middleName: e.target.value})}
            />
            <input 
              type="text" placeholder="Enter contact no."
              className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
              value={formData.contactNo} onChange={(e) => setFormData({...formData, contactNo: e.target.value})}
            />
          </div>

          {/* FULL WIDTH: Address */}
          <input 
            type="text" placeholder="Enter full address"
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}
          />

          {/* FULL WIDTH: Email */}
          <input 
            type="email" placeholder="Enter email" required
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm"
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
          />

          {/* ROW 3: Branch & Role */}
          <div className="grid grid-cols-2 gap-4">
            <select 
              required className="border border-gray-300 rounded-md p-3 text-sm focus:outline-none bg-white shadow-sm text-gray-500"
              value={formData.branch} onChange={(e) => setFormData({...formData, branch: e.target.value})}
            >
              <option value="" disabled>Select branch</option>
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

          {/* BUTTONS */}
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

export default CreateAccountModal;