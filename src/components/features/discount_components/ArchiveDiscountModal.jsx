import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ArchiveDiscountModal = ({ isOpen, onClose, onConfirm }) => {
  const [isArchiving, setIsArchiving] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsArchiving(true);
    
    // ==========================================
    // 🔌 API TEMPLATE: ARCHIVE DISCOUNT
    // ==========================================
    // try {
    //   await fetch(`YOUR_API_URL/discounts/archive`, { method: 'POST' });
    // } catch (error) {
    //   console.error("Failed to archive:", error);
    // }
    
    // Simulating database delay for UI template
    setTimeout(() => {
      setIsArchiving(false);
      onConfirm(); // This triggers the deletion in the parent state
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 relative text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-[#333] mb-10 mt-2 px-4 leading-snug">
          Are you sure you want to archive this discount?
        </h2>

        <div className="flex justify-center gap-6">
          <Button 
            variant="primary" 
            className="w-32 py-6 text-lg font-bold tracking-wider" 
            onClick={handleConfirm}
            disabled={isArchiving}
          >
            {isArchiving ? <Loader2 className="animate-spin" size={24} /> : "YES"}
          </Button>
          <Button 
            variant="destructive-outline" 
            className="w-32 py-6 text-lg font-bold tracking-wider" 
            onClick={onClose}
            disabled={isArchiving}
          >
            NO
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ArchiveDiscountModal;