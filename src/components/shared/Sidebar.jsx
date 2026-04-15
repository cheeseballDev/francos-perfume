import {
  Archive,
  Barcode,
  Boxes,
  ChartNoAxesCombined,
  FileClock,
  HandHelping,
  LayoutDashboard,
  Logs,
  UserPen,
  Tag // Added for Discount
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/FrancoPerfumeLogo.png";

const Sidebar = ({ role, activeTab, setActiveTab }) => {
  const companyPictureAlt = "Franco's Logo";
  const normalizedRole = role ? role.toLowerCase() : "";
  const isManager = normalizedRole === "manager";

  const getTabClass = (tabName) => {
    return `flex items-center w-full gap-2 cursor-pointer p-5 transition-colors duration-300
    ${
      activeTab === tabName
        ? "bg-custom-primary/20 text-custom-white border-r-4 border-custom-primary"
        : "hover:bg-white/10"
    }`;
  };

  return (
    <div className="w-64 bg-custom-black text-custom-white flex flex-col z-20 shrink-0 h-full">
      <div className="py-6 px-6 border-b border-white/10 flex flex-col items-center justify-center ">
        <img
          src={logo}
          alt={companyPictureAlt}
          className="h-24 w-auto object-contain mb-6"
        />
        <span className="text-sm tracking-widest text-custom-gray font-semibold uppercase">
          Main Menu
        </span>
      </div>

      <div className="w-full flex flex-col gap-2 overflow-y-auto sidebar-scroll pb-4">
        {/* DASHBOARD */}
        <Link
          to="/"
          onClick={() => setActiveTab("Dashboard")}
          className={getTabClass("Dashboard")}
        >
          <LayoutDashboard size={24} />
          <p className="text-base">Dashboard</p>
        </Link>

        {/* INVENTORY */}
        <Link
          to="/inventory"
          onClick={() => setActiveTab("Inventory")}
          className={getTabClass("Inventory")}
        >
          <Boxes size={24} />
          <p className="text-base">Inventory</p>
        </Link>

        {/* REQUESTS */}
        <Link
          to="/requests"
          onClick={() => setActiveTab("Requests")}
          className={getTabClass("Requests")}
        >
          <HandHelping size={24} />
          <p className="text-base">Requests</p>
        </Link>

        {/* FORECAST */}
        <Link
          to="/forecast"
          onClick={() => setActiveTab("Forecast")}
          className={getTabClass("Forecast")}
        >
          <ChartNoAxesCombined size={24} />
          <p className="text-base">Forecast</p>
        </Link>

        {isManager && (
          <>
            {/* TRANSACTIONS */}
            <Link
              to="/transactions"
              onClick={() => setActiveTab("Transactions")}
              className={getTabClass("Transactions")}
            >
              <FileClock size={24} />
              <p className="text-base">Transactions</p>
            </Link>

            {/* BARCODE */}
            <Link
              to="/barcode"
              onClick={() => setActiveTab("Barcode")}
              className={getTabClass("Barcode")}
            >
              <Barcode size={24} />
              <p className="text-base">Barcode</p>
            </Link>

            {/* DISCOUNT - Restored! */}
            <Link
              to="/discount"
              onClick={() => setActiveTab("Discount")}
              className={getTabClass("Discount")}
            >
              <Tag size={24} />
              <p className="text-base">Discount</p>
            </Link>

            {/* ACCOUNTS */}
            <Link
              to="/accounts"
              onClick={() => setActiveTab("Accounts")}
              className={getTabClass("Accounts")}
            >
              <UserPen size={24} />
              <p className="text-base">Accounts</p>
            </Link>

            <Link
              to="/audit"
              onClick={() => setActiveTab("Audit Log")}
              className={getTabClass("Audit Log")}
            >
              <Logs size={24} />
              <p className="text-base">Audit Log</p>
            </Link>

            {/* ARCHIVES */}
            <Link
              to="/archives"
              onClick={() => setActiveTab("Archives")}
              className={getTabClass("Archives")}
            >
              <Archive size={24} />
              <p className="text-base">Archives</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;