import { useState, useEffect } from "react";
import { Eye, ArchiveRestore, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewArchiveModal from "./ViewArchiveModal"; // Import the modal

const AccountsArchiveTable = () => {
  const [archives, setArchives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal State

  // ==========================================
  // 🔌 DATABASE / API CONNECTION TEMPLATE
  // ==========================================
  useEffect(() => {
    const fetchAccountArchives = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual fetch call
        // const response = await fetch('YOUR_BACKEND_URL/api/archives/accounts');
        // setArchives(await response.json());

        // Dummy Data
        const dummyData = [
          { id: "ACT-001", name: "John Smith", email: "johnsmith@gmail.com", role: "Staff", branch: "Sta. Lucia", dateArchived: "2026/04/10 - 12:00 PM" },
          { id: "ACT-002", name: "Jane Doe", email: "janedoe@gmail.com", role: "Manager", branch: "Riverbanks", dateArchived: "2026/04/11 - 01:30 PM" },
          { id: "ACT-003", name: "Mark Lee", email: "marklee@gmail.com", role: "Staff", branch: "Sta. Lucia", dateArchived: "2026/04/12 - 09:15 AM" },
        ];
        setArchives([...dummyData, ...dummyData, ...dummyData]); 
      } catch (error) {
        console.error("Failed to fetch account archives:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccountArchives();
  }, []);

  // Shared row rendering function used by both the main table and the modal
  const renderRow = (acc, idx) => (
    <tr key={`${acc.id}-${idx}`} className={idx % 2 === 0 ? "bg-[#EAE7DF]/30" : "bg-white"}>
      <td className="px-6 py-4 text-gray-600">{acc.id}</td>
      <td className="px-6 py-4 font-medium text-gray-800">{acc.name}</td>
      <td className="px-6 py-4 text-gray-600">{acc.email}</td>
      <td className="px-6 py-4 text-gray-600">{acc.role}</td>
      <td className="px-6 py-4 text-gray-600">{acc.branch}</td>
      <td className="px-6 py-4 text-gray-500">{acc.dateArchived}</td>
    </tr>
  );

  return (
    <section>
      <h2 className="text-2xl font-bold text-[#333] mb-6">Accounts Archives</h2>
      
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden shadow-sm min-h-[200px] mb-4">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9FB] text-gray-500 font-medium border-b border-gray-200">
            <tr>
              {["ID", "Name", "Email", "Role", "Branch", "Date and Time Archived"].map((col, i) => (
                <th key={i} className="px-6 py-4">{col} <span className="text-xs">▼</span></th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-400">Loading archives...</td></tr>
            ) : (
              archives.slice(0, 5).map(renderRow) // Show only 5 items on the main page
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">Actions:</span>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Eye className="mr-2" size={16} /> View All
          </Button>
          <Button variant="destructive-outline">
            <ArchiveRestore className="mr-2" size={16} /> Restore selected
          </Button>
        </div>
      </div>

      {/* RENDER THE REUSABLE MODAL */}
      <ViewArchiveModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Accounts Archives List"
        columns={["ID", "Name", "Email", "Role", "Branch", "Date and Time Archived"]}
        data={archives}
        renderRow={renderRow}
      />
    </section>
  );
};

export default AccountsArchiveTable;