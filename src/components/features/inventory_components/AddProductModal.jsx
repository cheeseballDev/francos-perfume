import React, { useState } from 'react';

const AddProductModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    branch: "",
    note: "",
    gender: "",
    qty: 0,
  });

  const handleSubmit = () => {
    onSave(formData);

    setFormData({
      name: "",
      type: "",
      branch: "",
      note: "",
      gender: "",
      qty: 0,
    });
    onClose();
  };

 if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
      
      {/* THE MODAL BOX (Light background, rounded corners) */}
      <div className="bg-[#F8F9FB] rounded-2xl shadow-xl w-full max-w-[450px] p-8 relative">
        
        {/* CLOSE X BUTTON */}
        <button onClick={onClose} className="absolute top-4 right-5 text-gray-400 hover:text-gray-700 text-2xl font-bold">
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-[#333] text-center mb-6 tracking-tight">Add New Perfume</h2>

        {/* CIRCULAR IMAGE PLACEHOLDER */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 border border-gray-400 rounded-full flex items-center justify-center relative bg-[#F8F9FB]">
            {/* Mountain Image Icon */}
            <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            {/* Edit Square Icon (Bottom Right) */}
            <div className="absolute bottom-0 right-0 bg-[#F8F9FB] p-1">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            </div>
          </div>
        </div>

        {/* FORM GRID (Labels on left, inputs on right) */}
        <div className="grid grid-cols-[110px_1fr] gap-y-4 items-center">
          
          <span className="text-gray-500 text-sm">Perfume Name:</span>
          <input
            type="text"
            placeholder="Enter New Perfume Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border border-gray-400 p-2 rounded-md w-full focus:outline-none text-sm text-gray-700"
          />

          <span className="text-gray-500 text-sm">Perfume Type:</span>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border border-gray-400 p-2 rounded-md w-full focus:outline-none text-sm text-gray-400 bg-white"
          >
            <option value="" disabled>Select perfume type</option>
            <option value="Premium" className="text-gray-700">Premium</option>
            <option value="Standard" className="text-gray-700">Standard</option>
            <option value="Limited" className="text-gray-700">Limited</option>
          </select>

          <span className="text-gray-500 text-sm">Gender:</span>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className="border border-gray-400 p-2 rounded-md w-full focus:outline-none text-sm text-gray-400 bg-white"
          >
            <option value="" disabled>Select gender</option>
            <option value="Male" className="text-gray-700">Male</option>
            <option value="Female" className="text-gray-700">Female</option>
            <option value="Unisex" className="text-gray-700">Unisex</option>
          </select>

          <span className="text-gray-500 text-sm">Note:</span>
          <select
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="border border-gray-400 p-2 rounded-md w-full focus:outline-none text-sm text-gray-400 bg-white"
          >
            <option value="" disabled>Select note</option>
            <option value="Placeholder 1" className="text-gray-700">Placeholder 1</option>
            <option value="Placeholder 2" className="text-gray-700">Placeholder 2</option>
            <option value="Placeholder 3" className="text-gray-700">Placeholder 3</option>
          </select>

          <span className="text-gray-500 text-sm">Quantity:</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFormData({ ...formData, qty: formData.qty + 1 })}
              className="w-10 h-8 bg-[#E5D5C1] rounded-md font-bold text-gray-700 flex items-center justify-center hover:bg-[#d4c2ab] transition-colors"
            >+</button>
            <div className="w-16 h-8 border border-gray-400 rounded-md flex items-center justify-center bg-white text-sm font-medium">
              {formData.qty}
            </div>
            <button 
              onClick={() => setFormData({ ...formData, qty: Math.max(0, formData.qty - 1) })}
              className="w-10 h-8 bg-[#E5D5C1] rounded-md font-bold text-gray-700 flex items-center justify-center hover:bg-[#d4c2ab] transition-colors"
            >—</button>
          </div>

        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex gap-3 justify-center mt-8">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-[#E5D5C1] text-gray-700 rounded-md hover:bg-[#d4c2ab] font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <span className="text-lg">✕</span> Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2 bg-[#E5D5C1] text-gray-700 rounded-md hover:bg-[#d4c2ab] font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <span className="text-lg">✓</span> Save
          </button>
        </div>

      </div>
    </div>
  );
}
export default AddProductModal;
