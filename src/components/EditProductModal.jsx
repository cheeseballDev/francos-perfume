import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const EditProductModal = ({ isOpen, onClose, product, onSave }) => {
  // Local state to hold the "draft" edits
  const [formData, setFormData] = useState({
    name: '', type: '', branch: '', note: '', gender: '', qty: 0
  });

  // Whenever the modal opens with a new product, populate the form with its current data
  useEffect(() => {
    if (product && isOpen) {
      setFormData(product);
    }
  }, [product, isOpen]);

  // If the modal isn't supposed to be open, render nothing
  if (!isOpen || !product) return null;

  // Handle typing in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      // Ensure quantity stays a number, otherwise just update the text string
      [name]: name === 'qty' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSaveClick = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all p-4 font-montserrat">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
            Edit Product <span className="text-gray-400 text-lg ml-2">#{product.id}</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
            <X size={26} />
          </button>
        </div>
        
        {/* Form Body */}
        <div className="p-6 flex flex-col gap-4">
          
          <div>
            <label className="block text-[13px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Perfume Name</label>
            <input 
              type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500 bg-white">
                <option value="Premium">Premium</option>
                <option value="Classic">Classic</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 rounded text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500 bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
            <label className="block text-[13px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Note</label>
            <input 
              type="text" name="note" value={formData.note} onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500"
            />
          </div>
          
            <div>
              <label className="block text-[13px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Stock Qty</label>
              <input 
                type="number" name="qty" value={formData.qty} onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded text-[15px] font-medium text-gray-800 focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-2 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded hover:bg-gray-50 transition-colors tracking-wide"
          >
            DISCARD CHANGES
          </button>
          <button 
            onClick={handleSaveClick}
            className="flex-1 bg-[#529E58] text-white font-extrabold py-3 rounded hover:bg-[#438748] transition-colors tracking-widest shadow-sm"
          >
            SAVE CHANGES
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProductModal;