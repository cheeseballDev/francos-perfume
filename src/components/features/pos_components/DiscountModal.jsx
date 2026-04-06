import React, { useState } from 'react';
import { X } from 'lucide-react';

const DiscountModal = ({ isOpen, onClose, onApply }) => {
  // The modal manages its own local state for the form inputs
  const [discountPrefix, setDiscountPrefix] = useState('PWD');
  const [recipients, setRecipients] = useState(1);

  // If the modal isn't supposed to be open, render absolutely nothing
  if (!isOpen) return null;

  const handleApplyClick = () => {
    // We send the 20% mock discount back up to the parent POS component
    onApply(0.20); 
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-200">
        
        <div className="flex justify-between items-center p-6 pb-4">
          <h3 className="text-2xl font-bold text-gray-800">Add Discount</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
            <X size={28} />
          </button>
        </div>
        
        <div className="p-6 pt-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <label className="text-[15px] text-gray-600 font-medium">Enter discount prefix:</label>
            <select 
              value={discountPrefix} 
              onChange={(e) => setDiscountPrefix(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1.5 text-sm w-36 focus:outline-none focus:border-gray-800 bg-white cursor-pointer"
            >
              <option value="PWD">PWD</option>
              <option value="SENIOR">SENIOR</option>
              <option value="PROMO">PROMO</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-[15px] text-gray-600 font-medium">Enter number of recipients:</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setRecipients(Math.max(1, recipients - 1))}
                className="w-10 h-8 flex items-center justify-center bg-[#E5D5C5] text-gray-800 font-bold rounded hover:bg-[#d6c4b2] transition-colors"
              >
                -
              </button>
              <div className="w-14 h-8 flex items-center justify-center border border-gray-400 rounded bg-white font-bold text-[15px]">
                {recipients}
              </div>
              <button 
                onClick={() => setRecipients(recipients + 1)}
                className="w-10 h-8 flex items-center justify-center bg-[#E5D5C5] text-gray-800 font-bold rounded hover:bg-[#d6c4b2] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <button 
            onClick={handleApplyClick}
            className="w-full bg-[#529E58] text-white font-extrabold py-3.5 rounded mt-4 hover:bg-[#438748] transition-colors tracking-widest text-[15px]"
          >
            APPLY DISCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;