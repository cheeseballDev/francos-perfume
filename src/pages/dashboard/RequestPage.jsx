import DataTable from "@/components/data_components/DataTable";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import CreateRequestModal from "../../components/features/request_components/CreateRequestModal";
import RequestDetailsModal from "../../components/features/request_components/RequestDetailsModal";
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";

const initialRequestTableData = [
  { id: "REQ-001", perfume: "Apricot Spray", qty: 50, requested_from: "Sta. Lucia", sent_to: "Riverbanks", date_created: "2026/04/01", time: "12:00 PM", status: "PENDING" },
  { id: "REQ-002", perfume: "Ocean Breeze", qty: 30, requested_from: "Riverbanks", sent_to: "Sta. Lucia", date_created: "2026/04/02", time: "01:30 PM", status: "PENDING" },
  { id: "REQ-003", perfume: "Midnight Wood", qty: 100, requested_from: "Riverbanks", sent_to: "Sta. Lucia", date_created: "2026/04/03", time: "09:15 AM", status: "RECEIVED" },
  { id: "REQ-004", perfume: "Citrus Bloom", qty: 25, requested_from: "Riverbanks", sent_to: "Sta. Lucia", date_created: "2026/04/04", time: "11:45 AM", status: "PENDING" },
  { id: "REQ-005", perfume: "Velvet Rose", qty: 50, requested_from: "Riverbanks", sent_to: "Sta. Lucia", date_created: "2026/04/05", time: "02:00 PM", status: "CANCELLED" },
  { id: "REQ-006", perfume: "Apricot Spray", qty: 10, requested_from: "Riverbanks", sent_to: "Sta. Lucia", date_created: "2026/04/06", time: "04:20 PM", status: "PENDING" },
  { id: "REQ-007", perfume: "Ocean Breeze", qty: 60, requested_from: "Riverbanks", sent_to: "Sta. Lucia", date_created: "2026/04/07", time: "10:00 AM", status: "PENDING" },
  { id: "REQ-008", perfume: "Midnight Wood", qty: 45, requested_from: "Sta. Lucia", sent_to: "Riverbanks", date_created: "2026/04/08", time: "03:10 PM", status: "DENIED" },
  { id: "REQ-009", perfume: "Citrus Bloom", qty: 80, requested_from: "Sta. Lucia", sent_to: "Riverbanks", date_created: "2026/04/09", time: "08:30 AM", status: "PENDING" },
  { id: "REQ-010", perfume: "Velvet Rose", qty: 50, requested_from: "Riverbanks", sent_to: "Sta. Lucia", date_created: "2026/04/10", time: "01:00 PM", status: "RECEIVED" },
];

const filterSelectionsTop = [
  { key: "perfume", label: "All Perfumes", options: ["All Perfumes", "Apricot Spray", "Ocean Breeze", "Midnight Wood", "Citrus Bloom", "Velvet Rose"] },
  { key: "status", label: "All Statuses", options: ["All Statuses", "Pending", "Denied", "Cancelled", "Received"] },
];

const filterSelectionsBottom = [
  { key: "requested_from", label: "Requested From", options: ["All Branches", "Sta. Lucia", "Riverbanks"] },
  { key: "sent_to", label: "Sent To", options: ["All Branches", "Sta. Lucia", "Riverbanks"] },
];

const RequestPage = () => {
  const [requests, setRequests] = useState(initialRequestTableData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ perfume: "All Perfumes", status: "All Statuses", requested_from: "", sent_to: "", date_created: "" });
  const [activeTab, setActiveTab] = useState("inbound");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const columns = [
    {
      header: 'REQ ID',
      accessorKey: 'id',
      enableSorting: true
    },
    {
      header: 'Perfume',
      accessorKey: 'perfume',
      enableSorting: true
    },
    {
      header: 'Quantity',
      accessorKey: 'qty',
      enableSorting: true
    },
    {
      header: 'Requested From',
      accessorKey: 'requested_from',
      enableSorting: true
    },
    {
      header: 'Sent To',
      accessorKey: 'sent_to',
      enableSorting: true
    },
    {
      header: 'Date Created',
      accessorKey: 'date_created',
      enableSorting: true
    },
    {
      header: 'Time',
      accessorKey: 'time',
      enableSorting: true
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortingFns: 'statusSort',
      enableSorting: true
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({row}) => {
        const item = row.original;
        return (
          <Button variant="primary" size="sm" onClick={() => { handleOpenDetails(item.id); }}><Eye size={14}/> View Details</Button>    
        )
      }
    }
  ];


  // --- FILTER ENGINE ---
  const filteredData = requests.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = item.id.toLowerCase().includes(searchLower) || item.perfume.toLowerCase().includes(searchLower);
    const matchesPerfume = !filters.perfume || filters.perfume === "All Perfumes" || item.perfume === filters.perfume;
    const matchesStatus = !filters.status || filters.status === "All Statuses" || item.status.toLowerCase() === filters.status.toLowerCase();
    const matchesFrom = !filters.requested_from || filters.requested_from === "All Branches" || item.requestedFrom === filters.requested_from;
    const matchesTo = !filters.sent_to || filters.sent_to === "All Branches" || item.sentTo === filters.sent_to;
    const formattedDate = filters.date_created ? filters.date_created.replace(/-/g, "/") : "";
    const matchesDate = !formattedDate || item.date === formattedDate;

    return matchesSearch && matchesPerfume && matchesStatus && matchesFrom && matchesTo && matchesDate;
  });

  useEffect(() => {
  }, [searchQuery, filters, activeTab]);

  const handleClearFilters = () => {
    setFilters({ perfume: "", status: "", requested_from: "", sent_to: "", date_created: "" });
    setSearchQuery("");
  };


  const handleAddRequest = (newRequest) => {
    setRequests([newRequest, ...requests]);
  };

  const handleOpenDetails = (id) => {
    setSelectedRequest(id)
    setIsDetailsOpen(true)
  };

  return (
    <div className="flex flex-col h-full animate-fade-in relative">
      <h1 className="text-[32px] font-bold text-custom-black mb-1 leading-none tracking-tight">Request</h1>
      <p className="text-custom-gray text-sm mb-6">Check requests and confirm</p>

      {/* FILTER SECTION */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-4">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)} />
          <FilterBar filters={filters} setFilters={setFilters} filterSelections={filterSelectionsTop} />
        </div>

        <div className="flex items-center gap-4">
          <FilterBar filters={filters} setFilters={setFilters} filterSelections={filterSelectionsBottom} />
          <div className="relative">
            <span className="absolute -top-4 left-0 text-[10px] text-custom-gray">Date Created:</span>
            <input type="date" value={filters.date_created} onChange={(e) => setFilters({ ...filters, date_created: e.target.value })} className="border border-custom-gray-2 rounded-md px-3 py-1.5 text-sm text-custom-gray focus:outline-none focus:ring-1 focus:ring-custom-gray" />
          </div>
          <Button variant="outline-destructive" onClick={handleClearFilters}>
            Clear filters
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-custom-black mb-1">Existing Requests</h2>
      <p className="text-custom-gray text-sm mb-4">List of all previous existing requests</p>

      <div className="flex justify-between items-center mb-4">
        <div className="flex bg-custom-gray-2 p-1 rounded-md border border-custom-gray-2">
          <button onClick={() => setActiveTab("inbound")} className={`px-6 py-1.5 text-sm rounded-sm font-medium transition-colors ${activeTab === "inbound" ? "bg-custom-primary text-custom-black shadow-sm" : "text-custom-gray hover:text-custom-black"}`}>Inbound (4)</button>
          <button onClick={() => setActiveTab("outbound")} className={`px-6 py-1.5 text-sm rounded-sm font-medium transition-colors ${activeTab === "outbound" ? "bg-custom-primary text-custom-black shadow-sm" : "text-custom-gray hover:text-custom-black"}`}>Outbound (4)</button>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <span className="text-lg leading-none">+</span> Create a new request
        </Button>
      </div>

      {/* DATA TABLE */}
      <DataTable 
        data={filteredData}
        columns={columns}
      />

      <RequestDetailsModal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} request={selectedRequest} />
      <CreateRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddRequest} />
    </div>
  );
};

export default RequestPage;