import React, { useState } from "react";
import { ArchiveRestore, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ViewArchiveModal = ({ isOpen, onClose, title, columns, data, renderRow }) => {
  const [isRestoring, setIsRestoring] = useState(false);

  // ==========================================
  // 🔌 DATABASE / API CONNECTION TEMPLATE
  // ==========================================
  const handleRestoreSelected = async () => {
    try {
      setIsRestoring(true);

      // TODO: Replace with your actual array of selected item IDs 
      // (You will need to add checkbox state logic to the table later)
      const selectedIds = ["EXAMPLE-001"]; 

      // --- API ACTION TEMPLATE ---
      // const response = await fetch('YOUR_BACKEND_URL/api/archives/restore', {
      //   method: 'POST', // or PUT, depending on your backend setup
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ ids: selectedIds }),
      // });
      //
      // if (!response.ok) throw new Error('Failed to restore items');
      // 
      // // Success! Close the modal and tell the parent table to refresh its data
      // onClose(); 
      // ---------------------------

      console.log("API Template: Attempting to restore items...");
      
      // Simulating a database delay for the UI template
      setTimeout(() => {
        setIsRestoring(false);
      }, 1000);

    } catch (error) {
      console.error("Restore action failed:", error);
      setIsRestoring(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-[28px] font-bold text-[#333] tracking-tight">{title}</h2>
            
            {/* Connected the template function to the Restore Button */}
            <Button 
              variant="destructive-outline" 
              className="h-8 text-xs px-3"
              onClick={handleRestoreSelected}
              disabled={isRestoring || data.length === 0}
            >
              {isRestoring ? (
                <Loader2 className="mr-2 animate-spin" size={14} />
              ) : (
                <ArchiveRestore className="mr-2" size={14} />
              )}
              {isRestoring ? "Restoring..." : "Restore selected"}
            </Button>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* MODAL TABLE (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FB] text-gray-500 font-medium sticky top-0 z-10 shadow-sm border-b border-gray-200">
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="px-6 py-4">
                      {col} <span className="text-xs ml-1">▼</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-400">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => renderRow(item, idx))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewArchiveModal;