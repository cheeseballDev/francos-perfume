import React, { useState } from "react";
import { X, FileText, FileSpreadsheet, FileOutput, Loader2 } from "lucide-react";

const ExportTransactionModal = ({ isOpen, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // ==========================================
  // 🔌 API TEMPLATE: EXPORT TRANSACTIONS
  // ==========================================
  const handleExport = async () => {
    if (!selectedFormat) return;

    try {
      setIsExporting(true);
      
      console.log(`Exporting as ${selectedFormat} from ${dateFrom || 'start'} to ${dateTo || 'end'}`);

      // --- UNCOMMENT AND UPDATE WHEN BACKEND IS READY ---
      // const queryParams = new URLSearchParams({
      //   format: selectedFormat,
      //   ...(dateFrom && { startDate: dateFrom }),
      //   ...(dateTo && { endDate: dateTo }),
      // });
      //
      // const response = await fetch(`YOUR_API_URL/transactions/export?${queryParams}`, {
      //   method: 'GET',
      // });
      // 
      // if (!response.ok) throw new Error("Export failed");
      //
      // // Download the file
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `transactions_export_${new Date().toISOString().split('T')[0]}.${selectedFormat}`;
      // a.click();
      // window.URL.revokeObjectURL(url);
      // --------------------------------------------------

      // Simulated delay for UI template
      setTimeout(() => {
        setIsExporting(false);
        onClose(); // Close modal on success
        setSelectedFormat(null); // Reset state
      }, 1500);

    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-8 relative">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center text-[#333] mb-8 tracking-tight">
          Export To:
        </h2>

        {/* FORMAT SELECTION CARDS */}
        <div className="flex justify-center gap-6 mb-8">
          {/* PDF OPTION */}
          <button 
            onClick={() => setSelectedFormat('pdf')}
            className={`flex flex-col items-center justify-center p-6 w-32 h-32 rounded-xl border-2 transition-all ${
              selectedFormat === 'pdf' 
                ? 'border-gray-800 bg-gray-50 scale-105 shadow-md' 
                : 'border-transparent hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <FileText size={56} className="text-[#333] mb-2" strokeWidth={1.5} />
            <span className="font-bold text-[#333] text-xl tracking-wide">PDF</span>
          </button>

          {/* EXCEL OPTION */}
          <button 
            onClick={() => setSelectedFormat('xlsx')}
            className={`flex flex-col items-center justify-center p-6 w-32 h-32 rounded-xl border-2 transition-all ${
              selectedFormat === 'xlsx' 
                ? 'border-gray-800 bg-gray-50 scale-105 shadow-md' 
                : 'border-transparent hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <FileSpreadsheet size={56} className="text-[#333] mb-2" strokeWidth={1.5} />
            <span className="font-bold text-[#333] text-xl tracking-wide">EXCEL</span>
          </button>

          {/* CSV OPTION */}
          <button 
            onClick={() => setSelectedFormat('csv')}
            className={`flex flex-col items-center justify-center p-6 w-32 h-32 rounded-xl border-2 transition-all ${
              selectedFormat === 'csv' 
                ? 'border-gray-800 bg-gray-50 scale-105 shadow-md' 
                : 'border-transparent hover:bg-gray-50 hover:scale-105'
            }`}
          >
            <FileOutput size={56} className="text-[#333] mb-2" strokeWidth={1.5} />
            <span className="font-bold text-[#333] text-xl tracking-wide">CSV</span>
          </button>
        </div>

        {/* DATE RANGE INPUTS */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-3">Select a date (optional):</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">Date From:</p>
              <div className="relative">
                <input 
                  type="date" 
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400" 
                />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Date To:</p>
              <div className="relative">
                <input 
                  type="date" 
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-center">
          <button 
            onClick={handleExport}
            disabled={!selectedFormat || isExporting}
            className={`bg-[#E5D5C1] text-gray-800 px-8 py-3 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2 min-w-[200px] ${
              !selectedFormat || isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d4c2ab]'
            }`}
          >
            {isExporting && <Loader2 size={16} className="animate-spin" />}
            {isExporting ? "Exporting..." : "Continue to export"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExportTransactionModal;