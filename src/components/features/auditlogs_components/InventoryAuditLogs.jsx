import { useState, useEffect, useRef } from "react";
import { Eye, Download, Upload, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewAuditLogsModal from "./ViewAuditLogsModal";

const InventoryAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // ==========================================
  // 🔌 1. API TEMPLATE: FETCH LOGS
  // ==========================================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        // --- UNCOMMENT WHEN BACKEND IS READY ---
        // const response = await fetch('YOUR_API_URL/audit/inventory');
        // const data = await response.json();
        // setLogs(data);
        
        // --- REMOVE DUMMY DATA LATER ---
        const dummyData = [
          { id: "10001", timestamp: "09/09/2025 00:00", user: "John Smith", action: "Added 50 QTY of Perfume" },
          { id: "10002", timestamp: "09/09/2025 00:00", user: "John Smith", action: "Requested 100 QTY" },
          { id: "10003", timestamp: "09/09/2025 00:00", user: "John Smith", action: "Deleted account" },
          { id: "10004", timestamp: "09/09/2025 00:00", user: "John Smith", action: "Deducted 50 QTY of Perfume" },
          { id: "10005", timestamp: "09/09/2025 00:00", user: "John Smith", action: "Added 150 QTY of Perfume" },
        ];
        setLogs([...dummyData, ...dummyData]); 
      } catch (error) {
        console.error("Failed to fetch inventory logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // ==========================================
  // 🔌 2. API TEMPLATE: EXPORT DATA (CSV/PDF)
  // ==========================================
  const handleExport = async () => {
    try {
      setIsExporting(true);
      // --- UNCOMMENT WHEN BACKEND IS READY ---
      // const response = await fetch('YOUR_API_URL/audit/inventory/export', { method: 'GET' });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `inventory_audit_logs.csv`;
      // a.click();

      // Simulated delay for UI template
      setTimeout(() => setIsExporting(false), 1500);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    }
  };

  // ==========================================
  // 🔌 3. API TEMPLATE: IMPORT DATA
  // ==========================================
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // --- UNCOMMENT WHEN BACKEND IS READY ---
      // const formData = new FormData();
      // formData.append('file', file);
      // await fetch('YOUR_API_URL/audit/inventory/import', {
      //   method: 'POST',
      //   body: formData,
      // });
      // alert("Import successful!");
      
      console.log("File ready for import:", file.name);
    } catch (error) {
      console.error("Import failed:", error);
    }
    // Reset file input so you can upload the same file again if needed
    event.target.value = null; 
  };

  const renderRow = (item, idx) => (
    <tr key={`${item.id}-${idx}`} className={idx % 2 === 0 ? "bg-[#EAE7DF]/30" : "bg-white"}>
      <td className="px-6 py-4 text-gray-600">{item.id}</td>
      <td className="px-6 py-4 text-gray-500">{item.timestamp}</td>
      <td className="px-6 py-4 font-medium text-gray-800">{item.user}</td>
      <td className="px-6 py-4 text-gray-600">{item.action}</td>
    </tr>
  );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#333] mb-4">Inventory Audit Logs</h2>
      
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm min-h-[200px] mb-4">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9FB] text-gray-500 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Log ID</th>
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Action done by user</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Loading logs...</td></tr>
            ) : (
              logs.slice(0, 5).map(renderRow)
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 font-medium mr-1">Actions:</span>
          
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Eye className="mr-2" size={16} /> View All
          </Button>
          
          <Button variant="primary" onClick={handleExport} disabled={isExporting || logs.length === 0}>
            {isExporting ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Download className="mr-2" size={16} />}
            {isExporting ? "Exporting..." : "Export"}
          </Button>

          {/* Hidden file input triggered by the Import button */}
          <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".csv, .xlsx" />
          <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2" size={16} /> Import
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Button variant="ghost" size="icon-sm" className="hover:bg-transparent">
            <ChevronLeft size={20} />
          </Button>
          <span>1 of 1513</span>
          <Button variant="ghost" size="icon-sm" className="hover:bg-transparent">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <ViewAuditLogsModal 
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        title="Inventory Audit Logs" data={logs} renderRow={renderRow}
      />
    </section>
  );
};

export default InventoryAuditLogs;