import React from "react";
import { X } from "lucide-react";

const ViewAuditLogsModal = ({ isOpen, onClose, title, data, renderRow }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        
        {/* MODAL HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
          <h2 className="text-[28px] font-bold text-[#333] tracking-tight">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        {/* MODAL TABLE (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8F9FB] text-gray-500 font-medium sticky top-0 z-10 shadow-sm border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Log ID</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action done by user</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400">No logs found.</td>
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

export default ViewAuditLogsModal;