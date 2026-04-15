import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const GCashPaymentModal = ({ isOpen, onClose, onConfirmPayment }) => {
  const [referenceId, setReferenceId] = useState("");

  if (!isOpen) return null;

  // Only allow confirmation if they typed something in the reference ID box
  const isValid = referenceId.trim().length > 0;

  const handleConfirm = () => {
    if (isValid) {
      onConfirmPayment({ method: "GCash", referenceId: referenceId.trim() });
      setReferenceId(""); // Reset for next time
    }
  };

  const handleClose = () => {
    setReferenceId(""); // Reset if canceled
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative p-8">
        
        {/* This is where we add the X button if we ever decide to include it */}

        <div className="flex flex-col gap-8 mt-4 mb-8">
          
          {/* REFERENCE ID INPUT ROW */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-500 font-medium text-sm tracking-widest uppercase">
              REFERENCE ID:
            </span>
            <input
              type="text"
              placeholder="Enter reference ID..."
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="flex-1 border border-gray-400 rounded-md px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-custom-green transition-all"
              autoFocus
            />
          </div>

        </div>

        {/* CONFIRM BUTTON */}
        <div className="flex justify-center">
          <Button
            variant="success"
            className="px-8 py-5 text-lg font-extrabold tracking-widest shadow-md"
            disabled={!isValid}
            onClick={handleConfirm}
          >
            CONFIRM PAYMENT
          </Button>
        </div>

        {/* Optional: Cancel button to back out, since the mockup didn't show an 'X' */}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>

      </div>
    </div>
  );
};

export default GCashPaymentModal;