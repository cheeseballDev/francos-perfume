import React, { useState, useEffect } from 'react';
import EditProductModal from '../components/EditProductModal';

// ============================================================================
// 🚨 DELETE THIS CODE IF CONNECTED TO THE API
// ============================================================================
const initialData = [
  { id: '01', name: 'Apricot', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '02', name: 'Ocean Breeze', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Female', date: '09-09-2025', qty: 100 },
  { id: '03', name: 'Midnight Wood', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '04', name: 'Citrus Bloom', type: 'Premium', branch: 'Sta. Lucia', note: 'Apricot', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '05', name: 'Velvet Rose', type: 'Premium', branch: 'Sta. Lucia', note: 'Apricot', gender: 'Female', date: '09-09-2025', qty: 100 },
];
// ============================================================================

const Inventory = () => {
  // --- STATE ---
  // MOVED THIS INSIDE THE COMPONENT!
  const [searchQuery, setSearchQuery] = useState('');
  
  const [inventory, setInventory] = useState(initialData);
  
  // States for the Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  /* // 🔌 UNCOMMENT WHEN .NET IS READY
  const [inventory, setInventory] = useState([]);
  useEffect(() => {
    fetch('https://localhost:5001/api/inventory') 
      .then(response => response.json())
      .then(data => setInventory(data));
  }, []);
  */

  // --- LOGIC: Qty Buttons ---
  const handleIncreaseQty = async (id) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
    // 🔌 .NET API: await fetch(`.../api/inventory/${id}/increase`, { method: 'PUT' });
  };

  const handleDecreaseQty = async (id) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item));
    // 🔌 .NET API: await fetch(`.../api/inventory/${id}/decrease`, { method: 'PUT' });
  };

  // --- LOGIC: Edit Modal Actions ---
  const handleOpenEditModal = (id) => {
    const productToEdit = inventory.find(item => item.id === id);
    setEditingProduct(productToEdit);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProduct) => {
    // 🚨 LOCAL UPDATE:
    setInventory(prev => prev.map(item => item.id === updatedProduct.id ? updatedProduct : item));
    setIsEditModalOpen(false);

    /*
    // 🔌 UNCOMMENT WHEN .NET IS READY
    try {
      const response = await fetch(`https://localhost:5001/api/inventory/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (response.ok) {
        setInventory(prev => prev.map(item => item.id === updatedProduct.id ? updatedProduct : item));
        setIsEditModalOpen(false);
      } else {
        alert("Failed to save changes to database.");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    */
  };

  // --- LOGIC: Search Filter ---
  // This looks at your search bar text and filters the table automatically
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id.includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat relative">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-gray-800 tracking-tight leading-none mb-2">Inventory</h1>
          <p className="text-gray-400 text-sm">Overview of all available parfum products</p>
        </div>
        <button className="flex items-center gap-2 bg-[#E3D7C6] hover:bg-[#D6C9B8] text-gray-800 px-4 py-2 rounded font-medium transition-colors text-sm shadow-sm">
          <span className="text-lg">▤</span> Scan barcode
        </button>
      </div>

      {/* FILTERS SECTION */}
      <div className="flex gap-4 mb-6">
        
        {/* RESTORED: Inline Search Bar connected to state */}
        <div className="relative flex-1 max-w-xs">
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or id..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
          <option>Gender</option>
        </select>
      </div>

      {/* TABLE SECTION */}
      <div className="flex-1 bg-white overflow-auto border border-gray-100 rounded-t-md shadow-sm custom-scrollbar">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Perfume</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Branch ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Note ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Qty ▾</th>
              <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {/* CHANGED: We now map over filteredInventory instead of inventory! */}
            {filteredInventory.map((item, index) => (
      <tr key={item.id} className={index % 2 === 0 ? 'bg-[#F9F9F9]' : 'bg-white hover:bg-gray-50 transition-colors'}>
        <td className="py-3 px-4 text-sm text-gray-600 font-medium">{item.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800 flex items-center gap-2 font-bold"><span className="text-xs">🧴</span> {item.name}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.type}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.branch}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.note}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{item.gender}</td>
                <td className={`py-3 px-4 text-sm text-center font-bold ${item.qty === 0 ? 'text-red-500' : 'text-gray-800'}`}>{item.qty}</td>
                
                <td className="py-3 px-4 flex justify-center gap-1.5">
                  <button onClick={() => handleIncreaseQty(item.id)} className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded text-gray-800 font-bold transition-colors">+</button>
                  <button onClick={() => handleDecreaseQty(item.id)} className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded text-gray-800 font-bold transition-colors">-</button>
                  
                  <button 
                    onClick={() => handleOpenEditModal(item.id)} 
                    className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded flex items-center justify-center transition-colors text-xs"
                  >
                    📝
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100">
        <p>Showing {filteredInventory.length} entries</p>
        <div className="flex gap-2">
          <button className="p-1 hover:text-gray-800 font-bold transition-colors">{"<"}</button>
          <button className="p-1 hover:text-gray-800 font-bold transition-colors">{">"}</button>
        </div>
      </div>

      {/* --- OUR NEW EDIT COMPONENT --- */}
      <EditProductModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveEdit}
      />

    </div>
  );
};

export default Inventory;