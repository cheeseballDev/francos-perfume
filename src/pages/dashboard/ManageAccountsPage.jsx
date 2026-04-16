import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import AccountInfoModal from "../../components/features/accounts_components/AccountInfoModal";
import CreateAccountModal from "../../components/features/accounts_components/CreateAccountModal";
import EditAccountModal from "../../components/features/accounts_components/EditAccountModal";
import FilterBar from "../../components/shared/FilterDropDown";
import SearchBar from "../../components/shared/SearchBar";

const initialAccounts = [
  { id: "001", email: "johnsmith@gmail.com", name: "John Smith", role: "Staff", branch: "Sta. Lucia", date: "09/09/2025", status: "Active" },
  { id: "002", email: "jdoe@gmail.com", name: "Jane Doe", role: "Manager", branch: "Riverbanks", date: "09/10/2025", status: "Active" },
  { id: "003", email: "r_williams@gmail.com", name: "Robert Williams", role: "Staff", branch: "Sta. Lucia", date: "10/11/2025", status: "Inactive" },
  { id: "004", email: "m_brown@gmail.com", name: "Michael Brown", role: "Staff", branch: "Riverbanks", date: "11/12/2025", status: "Active" },
  { id: "005", email: "s_davis@gmail.com", name: "Sarah Davis", role: "Staff", branch: "Sta. Lucia", date: "12/01/2026", status: "Active" },
  { id: "006", email: "k_miller@gmail.com", name: "Kevin Miller", role: "Staff", branch: "Sta. Lucia", date: "01/02/2026", status: "Active" },
  { id: "007", email: "a_wilson@gmail.com", name: "Ashley Wilson", role: "Manager", branch: "Riverbanks", date: "02/03/2026", status: "Active" },
  { id: "008", email: "d_moore@gmail.com", name: "David Moore", role: "Staff", branch: "Sta. Lucia", date: "02/04/2026", status: "Inactive" },
];

const ManageAccountsPage = () => {
  // --- STATE ---
  const [accounts, setAccounts] = useState(initialAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ role: "", status: "" });
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false); // Create Modal
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false); // Info/View Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit Modal
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // --- FILTER ENGINE ---
  const filteredData = accounts.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.id.includes(searchLower);
    
    const matchesRole = !filters.role || filters.role === "All Roles" || user.role === filters.role;
    const matchesStatus = !filters.status || filters.status === "All Status" || user.status === filters.status;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // --- PAGINATION MATH ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentAccounts = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // --- HANDLERS ---
  const handleSaveNewAccount = (newAcc) => {
    // FIXED: Was previously 'setRequests' which broke the app
    setAccounts([newAcc, ...accounts]);
  };

  const handleUpdateAccount = (updatedAcc) => {
    setAccounts(accounts.map(acc => acc.id === updatedAcc.id ? updatedAcc : acc));
  };

  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat">
      {/* HEADER */}
      <h1 className="text-[32px] font-bold text-[#333] mb-1 tracking-tight leading-none">
        Manage Accounts
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Manage, create, and modify accounts of each user
      </p>

      {/* TOP CONTROLS */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target ? e.target.value : e)}
          />
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            filterSelections={[
              { key: "role", label: "Filter: Role", options: ["All Roles", "Staff", "Manager"] },
              { key: "status", label: "Filter: Status", options: ["All Status", "Active", "Inactive"] },
            ]}
          />
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <span className="text-xl leading-none">+</span> Create New Account
        </Button>
      </div>

      <h2 className="text-2xl font-bold text-[#333] mb-6">Accounts List</h2>

      {/* DATA TABLE */}
      <div className="overflow-hidden min-h-[450px]">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-[12px] text-gray-400 uppercase bg-transparent border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium">User ID</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Branch</th>
              <th className="px-4 py-3 font-medium">Date Created</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-center font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.length > 0 ? (
              currentAccounts.map((user, index) => (
                <tr
                  key={user.id}
                  className={`${index % 2 === 0 ? "bg-[#E3DFD6]/50" : "bg-white"}`}
                >
                  <td className="px-4 py-4 text-gray-700">{user.id}</td>
                  <td className="px-4 py-4">{user.email}</td>
                  <td className="px-4 py-4 text-gray-700">{user.name}</td>
                  <td className="px-4 py-4">{user.role}</td>
                  <td className="px-4 py-4">{user.branch}</td>
                  <td className="px-4 py-4">{user.date}</td>
                  <td className={`px-4 py-4 font-medium ${user.status === 'Active' ? 'text-green-600' : 'text-red-400'}`}>{user.status}</td>
                  <td className="px-4 py-4 text-center">
                    <Button variant="primary" size="sm" onClick={() => { setSelectedAccount(user); setIsInfoModalOpen(true); }}>
                      ••• View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-10 text-center text-gray-400 italic">
                  No accounts found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="flex justify-between items-center mt-auto pt-6 text-sm text-gray-400">
        <p>
          Showing{" "}
          {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
          {filteredData.length} entries
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`text-2xl transition-colors ${currentPage === 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}
          >
            ‹
          </button>
          <span className="text-gray-500 font-medium">{currentPage} / {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`text-2xl transition-colors ${currentPage === totalPages || totalPages === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-500 hover:text-gray-800"}`}
          >
            ›
          </button>
        </div>
      </div>

      {/* MODALS */}
      <CreateAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewAccount}
      />

      <AccountInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        account={selectedAccount}
        // FIXED: Renamed from 'onEdit' to 'onEditClick' to match AccountInfoModal props
        onEditClick={() => {
          setIsInfoModalOpen(false); // Close Info
          setTimeout(() => setIsEditModalOpen(true), 150);  // Open Edit (slight delay for smoother transition)
        }}
      />

      <EditAccountModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        account={selectedAccount}
        onSave={handleUpdateAccount}
      />
    </div>
  );
};

export default ManageAccountsPage;