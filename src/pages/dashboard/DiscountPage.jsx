import { useState } from "react";
import SearchBar from "../../components/shared/SearchBar";

const initialDiscounts = [
  { prefix: "SEN", name: "Senior Citizen", percent: 20, status: "Active" },
  { prefix: "PWD", name: "Person with Disability", percent: 20, status: "Active" },
  { prefix: "EMP", name: "Employee Discount", percent: 15, status: "Active" },
  { prefix: "VIP", name: "VIP Member", percent: 10, status: "Active" },
  { prefix: "HOL", name: "Holiday Special", percent: 25, status: "Inactive" },
];

const DiscountPage = () => {
  // --- STATE ---
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [newDiscount, setNewDiscount] = useState({
    name: "",
    prefix: "",
    percent: "",
    status: "Active",
  });

  // --- HANDLERS ---
  const handleAddDiscount = (e) => {
    e.preventDefault();
    if (!newDiscount.name || !newDiscount.prefix || !newDiscount.percent) return;
    
    setDiscounts([...discounts, newDiscount]);
    setNewDiscount({ name: "", prefix: "", percent: "", status: "Active" });

    /* 🔌 BACKEND GUIDE: 
       POST to your .NET API here. 
       await fetch('https://localhost:5001/api/discounts', { ... }) 
    */
  };

  const handleDelete = (prefix) => {
    setDiscounts(discounts.filter((d) => d.prefix !== prefix));
  };

  const toggleStatus = (prefix) => {
    setDiscounts(
      discounts.map((d) =>
        d.prefix === prefix
          ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" }
          : d
      )
    );
  };

  // --- FILTER LOGIC ---
  const filteredDiscounts = discounts.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.prefix.toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = discounts.filter(d => d.status === "Active").length;

  return (
    <div className="flex flex-col h-full animate-fade-in relative font-montserrat">
      {/* HEADER */}
      <h1 className="text-[32px] font-bold text-[#333] mb-1 leading-none tracking-tight">Discount Management</h1>
      <p className="text-gray-400 text-sm mb-8">Create, remove, and change discounts</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        
        {/* LEFT COLUMN: ACTIVE DISCOUNTS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm self-start">
          <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-6">Active Discount Types</h2>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)} />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="All">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100">
                <th className="text-left font-medium py-3">Prefix</th>
                <th className="text-left font-medium py-3">Discount Name</th>
                <th className="text-left font-medium py-3">Percentage</th>
                <th className="text-left font-medium py-3">Status</th>
                <th className="text-center font-medium py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDiscounts.map((d, index) => (
                <tr key={d.prefix} className={`${index % 2 === 0 ? 'bg-[#F8F9FB]' : 'bg-white'}`}>
                  <td className="py-4 px-2 font-medium text-gray-500 uppercase">{d.prefix}</td>
                  <td className="py-4 text-gray-700">{d.name}</td>
                  <td className="py-4 text-gray-700">{d.percent}%</td>
                  <td className="py-4 text-gray-700">{d.status}</td>
                  <td className="py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1.5 hover:bg-gray-200 rounded transition-colors text-gray-600">📝</button>
                      <button onClick={() => handleDelete(d.prefix)} className="p-1.5 bg-[#902A3C] hover:bg-red-700 text-white rounded transition-colors text-xs">🗑</button>
                      <button 
                        onClick={() => toggleStatus(d.prefix)}
                        className={`p-1.5 rounded transition-colors text-xs ${d.status === 'Active' ? 'bg-[#E5D5C1] text-gray-800' : 'bg-gray-800 text-white'}`}
                      >
                        {d.status === 'Active' ? '⏸' : '▶'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-6 text-sm font-bold text-gray-600">Total Active Discounts: {totalActive}</p>
        </div>

        {/* RIGHT COLUMN: ADD NEW FORM */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm self-start">
          <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-8">Add New Discount Types</h2>
          
          <form onSubmit={handleAddDiscount} className="space-y-6">
            <div>
              <label className="block text-gray-600 text-sm mb-2 font-medium">Discount Name:</label>
              <input 
                type="text" 
                placeholder="Enter an appropriate name"
                value={newDiscount.name}
                onChange={(e) => setNewDiscount({...newDiscount, name: e.target.value})}
                className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-1 focus:ring-gray-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="text-gray-600 text-sm font-medium w-32">Discount Prefix:</label>
              <input 
                type="text" 
                maxLength={3}
                placeholder="ABC"
                value={newDiscount.prefix}
                onChange={(e) => setNewDiscount({...newDiscount, prefix: e.target.value.toUpperCase()})}
                className="w-20 border border-gray-300 rounded-md p-2 text-center text-sm focus:ring-1 focus:ring-gray-400 outline-none uppercase"
              />
              <span className="text-[10px] text-gray-400 uppercase font-bold">(3 Characters Maximum)</span>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-gray-600 text-sm font-medium w-32">Discount Percent:</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  value={newDiscount.percent}
                  onChange={(e) => setNewDiscount({...newDiscount, percent: e.target.value})}
                  className="w-20 border border-gray-300 rounded-md p-2 text-center text-sm focus:ring-1 focus:ring-gray-400 outline-none"
                />
                <span className="text-lg text-gray-400">%</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-gray-600 text-sm font-medium w-32">Discount Status:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={newDiscount.status === 'Active'} 
                    onChange={() => setNewDiscount({...newDiscount, status: 'Active'})}
                    className="accent-gray-800" 
                  /> Active
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="radio" 
                    checked={newDiscount.status === 'Inactive'} 
                    onChange={() => setNewDiscount({...newDiscount, status: 'Inactive'})}
                    className="accent-gray-800" 
                  /> Inactive
                </label>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                className="w-full bg-[#E5D5C1] hover:bg-[#d4c2ab] text-gray-700 font-medium py-3 rounded-md shadow-sm transition-colors"
              >
                Save as new discount
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default DiscountPage;