import React from 'react';

// DUMMY API DATA. 
// replace this with the actual API and state management once the backend is done.
const dummyData = [
  { id: '01', name: 'Apricot', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '02', name: 'Apricot', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Female', date: '09-09-2025', qty: 100 },
  { id: '03', name: 'Apricot', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '04', name: 'Apricot', type: 'Premium', branch: 'Sta. Lucia', note: 'Apricot', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '05', name: 'Apricot', type: 'Premium', branch: 'Sta. Lucia', note: 'Apricot', gender: 'Male', date: '09-09-2025', qty: 100 },
];

const Inventory = () => {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-gray-800 tracking-tight leading-none mb-2">Inventory</h1>
          <p className="text-gray-400 text-sm">Overview of all available parfum products</p>
        </div>
        <button className="flex items-center gap-2 bg-[#E3D7C6] hover:bg-[#D6C9B8] text-gray-800 px-4 py-2 rounded font-medium transition-colors text-sm">
          <span className="text-lg">▤</span> Scan barcode
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or id..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <select className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer w-40">
          <option>Perfume Type</option>
        </select>
        <select className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer w-40">
          <option>Branch</option>
        </select>
        <select className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer w-40">
          <option>Note</option>
        </select>
        <select className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 focus:outline-none cursor-pointer w-40">
          <option>Gender</option>
        </select>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 bg-white overflow-auto border border-gray-100 rounded-t-md">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfume</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Note ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date Created ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Available Qty ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* HOW TO MAP THE API DATA TO THE UI */}
            {dummyData.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F2F2F2]' : 'bg-white'}>
                <td className="py-3 px-4 text-sm text-gray-600">{item.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800 flex items-center gap-2">
                  <span className="text-xs">🧴</span> {item.name}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.type}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.branch}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.note}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.gender}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.date}</td>
                <td className="py-3 px-4 text-sm text-gray-600 text-center">{item.qty}</td>
                <td className="py-3 px-4 flex justify-center gap-1.5">
                  <button className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded text-gray-800 flex items-center justify-center font-bold transition-colors">+</button>
                  <button className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded text-gray-800 flex items-center justify-center font-bold transition-colors">-</button>
                  <button className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded text-gray-800 flex items-center justify-center transition-colors text-xs">📝</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION */}
      <div className="py-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100">
        <p>Showing 5 of 50 entries</p>
        <div className="flex gap-2">
          <button className="p-1 hover:text-gray-800">{"<"}</button>
          <button className="p-1 hover:text-gray-800">{">"}</button>
        </div>
      </div>

    </div>
  );
};

export default Inventory;