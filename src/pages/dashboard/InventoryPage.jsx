import DataTable from "@/components/data_components/DataTable";
import { Button } from "@/components/ui/button";
import { Edit, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AddProductModal from "../../components/features/inventory_components/AddProductModal";
import EditProductModal from "../../components/features/inventory_components/EditProductModal";
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";
import { fetchAllInventory } from "../../services/InventoryService";



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

const Inventory = ({ role }) => {
  const isManager = role === "manager";

  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState({
    type: "All Perfume Types",
    branch: "All Branches",
    gender: "All Genders",
  });

  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const getInventoryData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllInventory();
        console.log(data);
        setInventory(data);
      } catch (error) {
        alert("Inventory failed: " + error.message);
      }
    }
    getInventoryData();
  })


  const columns = [
  {
    header: 'ID',
    accessorKey: 'product_display_id',
    enableSorting: true,
  },
  {
    header: 'Perfume Name',
    accessorKey: 'product_name',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Perfume Type',
    accessorKey: 'product_type',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Branch',
    accessorKey: 'branch',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Note',
    accessorKey: 'product_note',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Gender',
    accessorKey: 'product_gender',
    sortingFn: 'alphanumeric',
  },
  {
    header: 'Date Created',
    accessorKey: 'product_date_created',
    sortingFn: 'datetime',
  },
  {
    header: 'Quantity',
    accessorKey: 'product_quantity',
    sortingFn: 'basic',
  },
  {
    header: 'Actions',
    id: 'actions',
    cell: ({row}) => {
      const item = row.original;
        return (
          <div className="flex gap-1">
            <Button variant="primary" size="icon-sm" onClick={() => increment(item.id)}><Plus size={14}/></Button>
            <Button variant="primary" size="icon-sm" onClick={() => decrement(item.id)}><Minus size={14}/></Button>
            <Button variant="primary" size="icon-sm" onClick={() => handleOpenEditModal(item.id, role)}><Edit size={14}/></Button>
          </div>
        )
      }
    }
  ];

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
  const increment = useCallback(async (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item,
      ),
    );
    // 🔌 .NET API: await fetch(`.../api/inventory/${id}/increase`, { method: 'PUT' });
  }, []);

  const decrement = useCallback(async (id) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(0, item.qty - 1) } : item,
      ),
    );
    // 🔌 .NET API: await fetch(`.../api/inventory/${id}/decrease`, { method: 'PUT' });
  }, []);


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


  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.includes(searchQuery);

    const matchesType =
      filters.type === "" ||
      filters.type === "All Perfume Types" ||
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
          <Button variant="primary">
            <span className="text-lg">▤</span> Scan barcode
          </Button>

          {/*
            CHECK IF USER IS MANAGER
          */}

          {isManager && (
            <Button variant="success" onClick={() => setIsAddModalOpen(true)}>
              + ADD PRODUCT
            </Button>
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

      <DataTable
        data={filteredInventory}
        columns={columns}
      />


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
