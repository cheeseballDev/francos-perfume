import React from "react";
import { X } from "lucide-react";

const CheckoutModal = ({ isOpen, onClose, grandTotal, onPaymentSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[650px] overflow-hidden animate-fade-in relative flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 relative">
          <h2 className="text-xl font-bold text-gray-500 uppercase tracking-wide">
            TOTAL AMOUNT: 
            <span className="text-2xl font-extrabold text-gray-900 ml-3">
              ₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors absolute right-6 top-1/2 -translate-y-1/2"
          >
            <X size={28} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex p-8 gap-8">
          
          {/* LEFT COLUMN: SHOP POLICY */}
          <div className="flex-1 bg-[#1A1A1A] text-white p-6 rounded-lg text-sm leading-relaxed flex flex-col justify-center text-center tracking-wider font-medium">
            <p>SHOP POLICY HERE</p>
            <p>SHOP POLICY HERE</p>
            <p>SHOP POLICY HERE</p>
            <p>SHOP POLICY HERE</p>
            <p>SHOP POLICY HERE</p>
            <p>SHOP POLICY HERE</p>
            <p>SHOP POLICY HERE</p>
          </div>

          {/* RIGHT COLUMN: PAYMENT OPTIONS */}
          <div className="flex-1 flex flex-col justify-center pl-2">
            <p className="text-gray-500 font-medium text-sm mb-4">PAYMENT OPTIONS:</p>
            
            <div className="flex flex-col gap-4">
              {/* GCash Button */}
              <button 
                onClick={() => onPaymentSelect('GCash')}
                className="w-full bg-[#E5D5C1] hover:bg-[#d4c2ab] text-[#0052FE] font-bold text-xl py-4 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2"
              >
                {/* Approximated GCash Icon using Tailwind */}
                <span className="bg-[#0052FE] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs italic font-black">
                  G
                </span> 
                GCash
              </button>
              
              {/* Cash Button */}
              <button 
                onClick={() => onPaymentSelect('Cash')}
                className="w-full bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 font-bold text-xl py-4 rounded-lg shadow-sm transition-colors"
              >
                Cash
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;