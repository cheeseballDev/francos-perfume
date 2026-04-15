import InventoryArchiveTable from "../../components/features/archive_components/InventoryArchiveTable";
import AccountsArchiveTable from "../../components/features/archive_components/AccountsArchiveTable";

const ArchivesPage = () => {
  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat pb-8">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-[32px] font-bold text-[#333] mb-2 tracking-tight">Archives</h1>
        <p className="text-gray-400 text-sm">
          A list of all archived items. Items stored for more than 30 days will be automatically deleted.
        </p>
      </header>

      <InventoryArchiveTable />
      <AccountsArchiveTable />
    </div>
  );
};

export default ArchivesPage;