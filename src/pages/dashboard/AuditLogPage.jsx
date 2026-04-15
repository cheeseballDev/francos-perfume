import InventoryAuditLogs from "../../components/features/auditlogs_components/InventoryAuditLogs.jsx";
import AccountsAuditLogs from "../../components/features/auditlogs_components/AccountsAuditLogs.jsx";
import RequestAuditLogs from "../../components/features/auditlogs_components/RequestsAuditLogs.jsx";

const AuditLogPage = () => {
  return (
    <div className="flex flex-col h-full animate-fade-in font-montserrat pb-8">
      {/* HEADER */}
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h1 className="text-[32px] font-bold text-[#333] mb-2 tracking-tight">Audit Logs</h1>
        <p className="text-gray-400 text-sm">
          A comprehensive record of all system activities, inventory changes, and account modifications.
        </p>
      </header>

      {/* TABLES */}
      <div className="flex flex-col gap-12">
        <InventoryAuditLogs />
        <AccountsAuditLogs />
        <RequestAuditLogs />
      </div>
    </div>
  );
};

export default AuditLogPage;