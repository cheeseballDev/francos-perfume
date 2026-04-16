import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CashPaymentModal = ({ isOpen, onClose, grandTotal, onConfirmPayment }) => {
  const [amountReceived, setAmountReceived] = useState("");

  if (!isOpen) return null;

  // Auto-calculate change
  const receivedNum = parseFloat(amountReceived) || 0;
  const change = Math.max(0, receivedNum - grandTotal);
  
  // Only allow confirmation if the amount received is equal to or greater than the total
  const isSufficient = receivedNum >= grandTotal;

  const handleConfirm = () => {
    if (isSufficient) {
      onConfirmPayment({ method: "Cash", received: receivedNum, change });
      setAmountReceived(""); // Reset for next time
    }
  };

  const handleClose = () => {
    setAmountReceived(""); // Reset if canceled
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative p-10">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={handleClose} 
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col gap-8 mt-2 mb-10">
          {/* TOTAL AMOUNT */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium text-sm tracking-widest uppercase">
              Total Amount:
            </span>
            <span className="text-[28px] font-extrabold text-gray-800">
              ₱{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {/* AMOUNT RECEIVED */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium text-sm tracking-widest uppercase">
              Amount Received:
            </span>
            <input
              type="number"
              placeholder="Enter amount..."
              value={amountReceived}
              onChange={(e) => setAmountReceived(e.target.value)}
              className="border border-gray-400 rounded-md px-4 py-2 text-xl font-bold text-gray-800 w-48 text-right focus:outline-none focus:ring-2 focus:ring-custom-green transition-all"
              autoFocus
            />
          </div>

          {/* CHANGE */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 font-medium text-sm tracking-widest uppercase">
              Change:
            </span>
            <span className={`text-[28px] font-extrabold ${receivedNum > 0 && !isSufficient ? 'text-red-500' : 'text-gray-800'}`}>
              ₱{change.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* CONFIRM BUTTON */}
        <div className="flex justify-center">
          <Button
            variant="success"
            className="px-10 py-6 text-lg font-extrabold tracking-widest w-full max-w-[300px] shadow-md"
            disabled={!isSufficient}
            onClick={handleConfirm}
          >
            CONFIRM PAYMENT
          </Button>
        </div>

      </div>
    </div>
  );
};

export default CashPaymentModal;