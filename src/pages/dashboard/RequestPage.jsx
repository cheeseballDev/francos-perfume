import { useState, useEffect } from "react";
import FilterBar from "../../components/shared/FilterBar";
import SearchBar from "../../components/shared/SearchBar";
import CreateRequestModal from "../../components/features/request_components/CreateRequestModal";
import RequestDetailsModal from "../../components/features/request_components/RequestDetailsModal"; 

const initialRequestTableData = [
  { id: "REQ-001", perfume: "Apricot Spray", qty: 50, requestedFrom: "Sta. Lucia", sentTo: "Riverbanks", date: "2026/04/01", time: "12:00 PM", status: "PENDING" },
  { id: "REQ-002", perfume: "Ocean Breeze", qty: 30, requestedFrom: "Riverbanks", sentTo: "Sta. Lucia", date: "2026/04/02", time: "01:30 PM", status: "PENDING" },
  { id: "REQ-003", perfume: "Midnight Wood", qty: 100, requestedFrom: "Riverbanks", sentTo: "Sta. Lucia", date: "2026/04/03", time: "09:15 AM", status: "RECEIVED" },
  { id: "REQ-004", perfume: "Citrus Bloom", qty: 25, requestedFrom: "Riverbanks", sentTo: "Sta. Lucia", date: "2026/04/04", time: "11:45 AM", status: "PENDING" },
  { id: "REQ-005", perfume: "Velvet Rose", qty: 50, requestedFrom: "Riverbanks", sentTo: "Sta. Lucia", date: "2026/04/05", time: "02:00 PM", status: "CANCELLED" },
  { id: "REQ-006", perfume: "Apricot Spray", qty: 10, requestedFrom: "Riverbanks", sentTo: "Sta. Lucia", date: "2026/04/06", time: "04:20 PM", status: "PENDING" },
  { id: "REQ-007", perfume: "Ocean Breeze", qty: 60, requestedFrom: "Riverbanks", sentTo: "Sta. Lucia", date: "2026/04/07", time: "10:00 AM", status: "PENDING" },
  { id: "REQ-008", perfume: "Midnight Wood", qty: 45, requestedFrom: "Sta. Lucia", sentTo: "Riverbanks", date: "2026/04/08", time: "03:10 PM", status: "DENIED" },
  { id: "REQ-009", perfume: "Citrus Bloom", qty: 80, requestedFrom: "Sta. Lucia", sentTo: "Riverbanks", date: "2026/04/09", time: "08:30 AM", status: "PENDING" },
  { id: "REQ-010", perfume: "Velvet Rose", qty: 50, requestedFrom: "Riverbanks", sentTo: "Sta. Lucia", date: "2026/04/10", time: "01:00 PM", status: "RECEIVED" },
];

const filterSelectionsTop = [
  { key: "perfume", label: "Filter: Perfume", options: ["All Perfumes", "Apricot Spray", "Ocean Breeze", "Midnight Wood", "Citrus Bloom", "Velvet Rose"] },
  { key: "status", label: "Filter: Status", options: ["Pending", "Denied", "Cancelled", "Received"] },
];

const filterSelectionsBottom = [
  { key: "requested_from", label: "Requested From", options: ["All Branches", "Sta. Lucia", "Riverbanks"] },
  { key: "sent_to", label: "Sent To", options: ["All Branches", "Sta. Lucia", "Riverbanks"] },
];

const RequestPage = () => {
  const [requests, setRequests] = useState(initialRequestTableData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ perfume: "", status: "", requested_from: "", sent_to: "", date_created: "" });
  const [activeTab, setActiveTab] = useState("inbound");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // --- FILTER ENGINE ---
  const filteredData = requests.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = item.id.toLowerCase().includes(searchLower) || item.perfume.toLowerCase().includes(searchLower);
    const matchesPerfume = !filters.perfume || filters.perfume === "All Perfumes" || item.perfume === filters.perfume;
    const matchesStatus = !filters.status || item.status.toLowerCase() === filters.status.toLowerCase();
    const matchesFrom = !filters.requested_from || filters.requested_from === "All Branches" || item.requestedFrom === filters.requested_from;
    const matchesTo = !filters.sent_to || filters.sent_to === "All Branches" || item.sentTo === filters.sent_to;
    const formattedDate = filters.date_created ? filters.date_created.replace(/-/g, "/") : "";
    const matchesDate = !formattedDate || item.date === formattedDate;

    return matchesSearch && matchesPerfume && matchesStatus && matchesFrom && matchesTo && matchesDate;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, activeTab]);

  const handleClearFilters = () => {
    setFilters({ perfume: "", status: "", requested_from: "", sent_to: "", date_created: "" });
    setSearchQuery("");
    setCurrentPage(1);
  };

  // --- PAGINATION MATH ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTableData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage((prev) => prev + 1); };
  const handlePrevPage = () => { if (currentPage > 1) setCurrentPage((prev) => prev - 1); };

  const handleAddRequest = (newRequest) => {
    setRequests([newRequest, ...requests]);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      <h1 className="text-[32px] font-bold text-[#333] mb-1 leading-none tracking-tight">Request</h1>
      <p className="text-gray-400 text-sm mb-6">Check requests and confirm</p>

      {/* FILTER SECTION */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-4">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)} />
          <FilterBar filters={filters} setFilters={setFilters} filterSelections={filterSelectionsTop} />
        </div>

        <div className="flex items-center gap-4">
          <FilterBar filters={filters} setFilters={setFilters} filterSelections={filterSelectionsBottom} />
          <div className="relative">
            <span className="absolute -top-4 left-0 text-[10px] text-gray-500">Date Created:</span>
            <input type="date" value={filters.date_created} onChange={(e) => setFilters({ ...filters, date_created: e.target.value })} className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400" />
          </div>
          <button onClick={handleClearFilters} className="border border-dashed border-[#D47B7B] text-[#D47B7B] px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-50 transition-colors flex items-center gap-2">
            <span className="text-lg leading-none">✕</span> Clear filters
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-[#333] mb-1">Existing Requests</h2>
      <p className="text-gray-400 text-sm mb-4">List of all previous existing requests</p>

      <div className="flex justify-between items-center mb-4">
        <div className="flex bg-[#EAEAEA] p-1 rounded-md border border-gray-300">
          <button onClick={() => setActiveTab("inbound")} className={`px-6 py-1.5 text-sm rounded-sm font-medium transition-colors ${activeTab === "inbound" ? "bg-[#E5D5C1] text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Inbound (4)</button>
          <button onClick={() => setActiveTab("outbound")} className={`px-6 py-1.5 text-sm rounded-sm font-medium transition-colors ${activeTab === "outbound" ? "bg-[#E5D5C1] text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>Outbound (4)</button>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-5 py-2 rounded font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <span className="text-lg leading-none">+</span> Create a new request
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="rounded-md border border-gray-200 bg-white overflow-hidden mt-4 shadow-sm min-h-[400px]">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-gray-500 bg-white border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium">REQ ID</th>
              <th className="px-4 py-3 font-medium">Perfume</th>
              <th className="px-4 py-3 font-medium text-center">Quantity</th>
              <th className="px-4 py-3 font-medium">Requested From</th>
              <th className="px-4 py-3 font-medium">Sent To</th>
              <th className="px-4 py-3 font-medium">Date Created</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.length > 0 ? (
              currentTableData.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-[#F8F9FB]" : "bg-white"}>
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.perfume}</td>
                  <td className="px-4 py-3 text-center">{item.qty}</td>
                  <td className="px-4 py-3">{item.requestedFrom}</td>
                  <td className="px-4 py-3">{item.sentTo}</td>
                  <td className="px-4 py-3">{item.date}</td>
                  <td className="px-4 py-3">{item.time}</td>
                  <td className="px-4 py-3 font-medium">{item.status}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        setSelectedRequest(item);
                        setIsDetailsOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 bg-[#E5D5C1] hover:bg-[#d4c2ab] px-3 py-1.5 rounded text-gray-800 text-xs font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-4 py-8 text-center text-gray-400">No requests match your search criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER SECTION */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
        <p>Showing {filteredData.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries</p>
        <div className="flex gap-2">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className={`p-1 font-bold transition-colors text-lg ${currentPage === 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}>{"<"}</button>
          <span className="px-2 py-1 font-medium text-gray-500 flex items-center">{currentPage} / {totalPages || 1}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className={`p-1 font-bold transition-colors text-lg ${currentPage === totalPages || totalPages === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}>{">"}</button>
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>Export</button>
        <button className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Import</button>
      </div>

      <RequestDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} request={selectedRequest} />
      <CreateRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddRequest} />
    </div>
  );
};

export default RequestPage;