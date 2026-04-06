import InventoryTable from "@/components/features/inventory_components/InventoryTable";
import { useState } from "react";
import AddProductModal from "../../components/features/inventory_components/AddProductModal";
import EditProductModal from "../../components/features/inventory_components/EditProductModal";
import FilterBar from "../../components/shared/FilterBar";
import SearchBar from "../../components/shared/SearchBar";

{
  /*
    TEMP DATA 
  */
}

const productTableData = [
  {
    id: "01",
    name: "Apricot",
    type: "Premium",
    branch: "Sta. Lucia",
    note: "Karat",
    gender: "Male",
    date: "09-09-2025",
    qty: 100,
  },
  {
    id: "02",
    name: "Ocean Breeze",
    type: "Premium",
    branch: "Sta. Lucia",
    note: "Karat",
    gender: "Female",
    date: "09-09-2025",
    qty: 100,
  },
  {
    id: "03",
    name: "Midnight Wood",
    type: "Premium",
    branch: "Sta. Lucia",
    note: "Karat",
    gender: "Male",
    date: "09-09-2025",
    qty: 100,
  },
  {
    id: "04",
    name: "Citrus Bloom",
    type: "Premium",
    branch: "Sta. Lucia",
    note: "Apricot",
    gender: "Male",
    date: "09-09-2025",
    qty: 100,
  },
  {
    id: "05",
    name: "Velvet Rose",
    type: "Premium",
    branch: "Sta. Lucia",
    note: "Apricot",
    gender: "Female",
    date: "09-09-2025",
    qty: 100,
  },
];

const filterSelections = [
  {
    key: "type",
    label: "Perfume Type",
    options: ["All Perfume Types", "Premium", "Classic"],
  },
  {
    key: "branch",
    label: "Branch",
    options: ["All Branches", "Sta. Lucia", "Riverbanks"],
  },
  {
    key: "gender",
    label: "Gender",
    options: ["All Genders", "Unisex", "Male", "Female"],
  },
];

{
  /*
    END OF TEMP DATA
  */
}

const Inventory = ({ role }) => {
  const isManager = role === "manager";

  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });

  const [filters, setFilters] = useState({
    type: "All Types",
    branch: "All Branches",
    gender: "All Genders",
  });

  const [inventory, setInventory] = useState(productTableData);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddProduct = (newProduct) => {
    // 1. Give it a temporary fake ID until you connect a real database later
    const productWithId = {
      ...newProduct,
      id: Math.floor(Math.random() * 1000).toString(),
    };

    // 2. Put the new product at the very top of the existing inventory list
    setInventory([productWithId, ...inventory]);
  };

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
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
    // 🔌 .NET API: await fetch(`.../api/inventory/${id}/increase`, { method: 'PUT' });
  };

  const handleDecreaseQty = async (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item,
      ),
    );
    // 🔌 .NET API: await fetch(`.../api/inventory/${id}/decrease`, { method: 'PUT' });
  };

  const handleOpenEditModal = (id, role) => {
    const productToEdit = inventory.find((item) => item.id === id);
    setEditingProduct(productToEdit);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedProduct) => {
    // 🚨 LOCAL UPDATE:
    setInventory((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item,
      ),
    );
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

  const handleResetFilters = () => {
    setFilters({
      type: "All Perfume Types",
      branch: "All Branches",
      gender: "All Genders",
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction:
            prev.direction === "ascending" ? "descending" : "ascending",
        };
      }
    });

    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.includes(searchQuery);

    const matchesType =
      filters.type === "" ||
      filters.type === "All Types" ||
      item.type === filters.type;
    const matchesBranch =
      filters.branch === "" ||
      filters.branch === "All Branches" ||
      item.branch === filters.branch;
    const matchesGender =
      filters.gender === "" ||
      filters.gender === "All Genders" ||
      item.gender === filters.gender;

    return matchesSearch && matchesType && matchesBranch && matchesGender
  });

  const sortedData = [...filteredInventory].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-custom-black tracking-tight leading-none mb-2">
            Inventory
          </h1>
          <p className="text-custom-gray text-sm">
            Overview of all available parfum products
          </p>
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
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#94BE9F] text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-[#7fa78a] transition-colors shadow-sm"
            >
              + ADD PRODUCT
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(value) => {
            const text = value?.target ? value.target.value : value;
            setSearchQuery(text);
          }}
        />

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          filterSelections={filterSelections}
        />
      </div>

      {/* TABLE SECTION */}

      <InventoryTable
        role={role}
        data={sortedData}
        onIncrease={handleIncreaseQty}
        onDecrease={handleDecreaseQty}
        onEdit={handleOpenEditModal}
      />

      <div className="py-4 flex justify-between items-center text-sm text-gray-500 border-t border-gray-100">
        <p>Showing {filteredInventory.length} entries</p>
        <div className="flex gap-2">
          <button className="p-1 hover:text-gray-800 font-bold transition-colors">
            {"<"}
          </button>
          <button className="p-1 hover:text-gray-800 font-bold transition-colors">
            {">"}
          </button>
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
        onSave={handleAddProduct}
      />
    </div>
  );
};

export default Inventory;
