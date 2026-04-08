import { useState, useEffect } from "react";
import SearchBar from "../../components/shared/SearchBar";

// --- DUMMY DATA (Simulating POS Sales & Inventory Restocks) ---
const initialTransactions = [
  { id: '20260328-001', details: 'Sale: 1x perfume', processedBy: 'John Smith', amount: 300.00, type: 'Sale', time: '12:24 PM', date: '2025-09-09' },
  { id: '20260328-002', details: 'Restock: 5x perfume', processedBy: 'John Smith', amount: -3000.00, type: 'Restock', time: '12:24 PM', date: '2025-09-09' },
  { id: '20260328-003', details: 'Sale: 1x perfume', processedBy: 'John Smith', amount: 300.00, type: 'Sale', time: '12:24 PM', date: '2025-09-09' },
  { id: '20260328-004', details: 'Sale: 2x perfume', processedBy: 'Jane Doe', amount: 600.00, type: 'Sale', time: '01:15 PM', date: '2025-09-10' },
  { id: '20260328-005', details: 'Restock: 1x perfume', processedBy: 'John Smith', amount: -300.00, type: 'Restock', time: '02:00 PM', date: '2025-09-10' },
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ details: 'All', processedBy: 'All', dateFrom: '', dateTo: '' });
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* 🔌 BACKEND GUIDE: FETCHING FROM POS DATABASE
     --------------------------------------------
     useEffect(() => {
       const fetchTransactions = async () => {
         try {
           const response = await fetch('https://localhost:5001/api/transactions');
           const data = await response.json();
           setTransactions(data);
         } catch (err) { console.error("Database connection failed", err); }
       };
       fetchTransactions();
     }, []);
  */

  // --- FILTER ENGINE ---
  const filteredData = transactions.filter((t) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = t.id.toLowerCase().includes(searchLower) || t.processedBy.toLowerCase().includes(searchLower);
    
    const matchesType = filters.details === 'All' || t.type === filters.details;
    const matchesStaff = filters.processedBy === 'All' || t.processedBy === filters.processedBy;

    // Date Range Logic
    const matchesDateFrom = !filters.dateFrom || new Date(t.date) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(t.date) <= new Date(filters.dateTo);

    return matchesSearch && matchesType && matchesStaff && matchesDateFrom && matchesDateTo;
  });

  const handleClearFilters = () => {
    setFilters({ details: 'All', processedBy: 'All', dateFrom: '', dateTo: '' });
    setSearchQuery("");
  };

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat">
      <div className="flex justify-between items-start mb-1">
        <div>
          <h1 className="text-[32px] font-bold text-[#333] tracking-tight leading-none">Transaction History</h1>
          <p className="text-gray-400 text-sm mt-1">Review all sales and restock activities</p>
        </div>
        <button className="bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 shadow-sm">
          🔄 Refresh Status
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 my-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-[200px]">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)} placeholder="Search transaction..." />
        </div>
        
        <select value={filters.details} onChange={(e) => setFilters({...filters, details: e.target.value})} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 outline-none">
          <option value="All">Details</option>
          <option value="Sale">Sales Only</option>
          <option value="Restock">Restocks Only</option>
        </select>

        <select value={filters.processedBy} onChange={(e) => setFilters({...filters, processedBy: e.target.value})} className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 outline-none">
          <option value="All">Processed By</option>
          <option value="John Smith">John Smith</option>
          <option value="Jane Doe">Jane Doe</option>
        </select>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute -top-4 left-0 text-[10px] text-gray-400">Date From:</span>
            <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-600" />
          </div>
          <div className="relative">
            <span className="absolute -top-4 left-0 text-[10px] text-gray-400">Date To:</span>
            <input type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} className="border border-gray-300 rounded-md px-2 py-1.5 text-sm text-gray-600" />
          </div>
        </div>

        <button onClick={handleClearFilters} className="border border-dashed border-[#D47B7B] text-[#D47B7B] px-3 py-2 rounded-md text-xs font-bold hover:bg-red-50 transition-colors">
          ✕ Clear filters
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden bg-white rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-400 uppercase text-[11px] border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-medium">Transaction ID ▾</th>
              <th className="px-6 py-4 font-medium">Details ▾</th>
              <th className="px-6 py-4 font-medium">Processed By ▾</th>
              <th className="px-6 py-4 font-medium">Amount ▾</th>
              <th className="px-6 py-4 font-medium">Time ▾</th>
              <th className="px-6 py-4 font-medium text-center">Date ▾</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((t, index) => (
              <tr key={t.id} className={index % 2 === 0 ? "bg-[#E3DFD6]/40" : "bg-white"}>
                <td className="px-6 py-4 text-gray-500">{t.id}</td>
                <td className="px-6 py-4 text-gray-700 font-medium">{t.details}</td>
                <td className="px-6 py-4 text-gray-600">{t.processedBy}</td>
                <td className={`px-6 py-4 font-bold ${t.amount > 0 ? 'text-[#94BE9F]' : 'text-[#902A3C]'}`}>
                  {t.amount > 0 ? `+ ₱${t.amount.toFixed(2)}` : `- ₱${Math.abs(t.amount).toFixed(2)}`}
                </td>
                <td className="px-6 py-4 text-gray-500">{t.time}</td>
                <td className="px-6 py-4 text-gray-500 text-center">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-400">Showing {currentData.length} of {filteredData.length} entries</p>
        <div className="flex gap-4">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="text-2xl text-gray-400 hover:text-gray-800">‹</button>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} className="text-2xl text-gray-400 hover:text-gray-800">›</button>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm">
          📊 Export
        </button>
        <button className="flex items-center gap-2 bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-800 px-4 py-2 rounded font-medium text-sm transition-colors shadow-sm">
          📥 Import
        </button>
      </div>
    </div>
  );
};

export default TransactionsPage;