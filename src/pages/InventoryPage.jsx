
import { useState } from 'react';
import DataTable from '../components/dashboard_components/DataTable';
import AddProductModal from '../components/inventory_components/AddProductModal';
import EditProductModal from '../components/inventory_components/EditProductModal';
// ============================================================================
// 🚨 DELETE THIS CODE IF CONNECTED TO THE API
// ============================================================================

const productTableHeaders = [
  { label: 'ID', key: 'id'},
  { label: 'Perfume', key:'name'},
  { label: 'Type', key: 'type'},
  { label: 'Branch', key: 'branch'},
  { label: 'Note', key: 'note'},
  { label: 'Gender', key: 'gender'},
  { label: 'Date Created', key: 'date'},
  { label: 'Quantity', key: 'qty'}
];

const productTableData = [
  { id: '01', name: 'Apricot', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '02', name: 'Ocean Breeze', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Female', date: '09-09-2025', qty: 100 },
  { id: '03', name: 'Midnight Wood', type: 'Premium', branch: 'Sta. Lucia', note: 'Karat', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '04', name: 'Citrus Bloom', type: 'Premium', branch: 'Sta. Lucia', note: 'Apricot', gender: 'Male', date: '09-09-2025', qty: 100 },
  { id: '05', name: 'Velvet Rose', type: 'Premium', branch: 'Sta. Lucia', note: 'Apricot', gender: 'Female', date: '09-09-2025', qty: 100 },
];
// ============================================================================

const Inventory = ({ role }) => {
  const isManager = role === 'manager';
  // --- STATE ---
  // MOVED THIS INSIDE THE COMPONENT!
  const [searchQuery, setSearchQuery] = useState('');
  
  const [inventory, setInventory] = useState(productTableData);
  
  // States for the Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
//States for the add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
          <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none mb-2">Inventory</h1>
          <p className="text-custom-gray text-sm">Overview of all available parfum products</p>
        </div>
        
        {/* We put the buttons in a flex container so they sit next to each other */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#E3D7C6] hover:bg-[#D6C9B8] text-gray-800 px-4 py-2 rounded font-medium transition-colors text-sm shadow-sm">
            <span className="text-lg">▤</span> Scan barcode
          </button>

          {/* 
            CHECK IF USER IS MANAGER
          */}

          {isManager && (
            <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-[#94BE9F] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-[#7fa78a] transition-colors shadow-sm">
              + ADD PRODUCT
            </button>
          )}
        </div>
      </div>

      {/* FILTERS SECTION */}
      <div className="flex gap-4 mb-6">
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

      <DataTable 
        headers={productTableHeaders}
        data={filteredInventory}
        renderActions={(item) => {
          return(
          <>
            <button onClick={() => handleIncreaseQty(item.id)} className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded text-gray-800 font-bold transition-colors">+</button>
            <button onClick={() => handleDecreaseQty(item.id)} className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded text-gray-800 font-bold transition-colors">-</button>
            <button onClick={() => handleOpenEditModal(item.id)} className="w-7 h-7 bg-[#E3D7C6] hover:bg-[#D6C9B8] rounded flex items-center justify-center transition-colors text-xs">📝</button>
          </>
        )}}
      />
      

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

      <AddProductModal 
      isOpen={isAddModalOpen} 
      onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default Inventory;