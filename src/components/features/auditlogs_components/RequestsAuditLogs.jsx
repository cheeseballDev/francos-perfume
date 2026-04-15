import { useState, useEffect, useRef } from "react";
import { Eye, Download, Upload, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewAuditLogsModal from "./ViewAuditLogsModal";

const RequestAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  // ==========================================
  // 🔌 API TEMPLATE: FETCH LOGS
  // ==========================================
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        // --- UNCOMMENT WHEN BACKEND IS READY ---
        // const response = await fetch('YOUR_API_URL/audit/requests');
        // const data = await response.json();
        // setLogs(data);
        
        // --- REMOVE DUMMY DATA LATER ---
        const dummyData = [
          { id: "30001", timestamp: "09/09/2025 10:00", user: "System", action: "Approved inbound transfer" },
          { id: "30002", timestamp: "09/09/2025 11:45", user: "Manager", action: "Cancelled outbound request" },
        ];
        setLogs([...dummyData, ...dummyData]); 
      } catch (error) {
        console.error("Failed to fetch request logs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    // API logic goes here (see InventoryAuditLogs for template)
    setTimeout(() => setIsExporting(false), 1500);
  };

  const handleImport = async (event) => {
    // API logic goes here (see InventoryAuditLogs for template)
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
    <section>
      <h2 className="text-2xl font-bold text-[#333] mb-4">Requests Audit Logs</h2>
      
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
          <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".csv, .xlsx" />
          <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2" size={16} /> Import
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Button variant="ghost" size="icon-sm" className="hover:bg-transparent"><ChevronLeft size={20} /></Button>
          <span>1 of 500</span>
          <Button variant="ghost" size="icon-sm" className="hover:bg-transparent"><ChevronRight size={20} /></Button>
        </div>
      </div>

      <ViewAuditLogsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Requests Audit Logs" data={logs} renderRow={renderRow} />
    </section>
  );
};

export default RequestAuditLogs;