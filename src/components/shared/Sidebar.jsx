import {
  Archive,
  Barcode,
  Boxes,
  ChartNoAxesCombined,
  FileClock,
  HandHelping,
  LayoutDashboard,
  Logs,
  Tag,
  UserPen
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/FrancoPerfumeLogo.png";

const Sidebar = ({ user }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const companyPictureAlt = "Franco's Logo";
  const isManager = user.trueRole === "manager";

  const getTabClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center w-full gap-2 cursor-pointer p-5 transition-colors duration-300
    ${
      isActive
        ? "bg-custom-primary/20 text-custom-white border-r-4 border-custom-primary"
        : "hover:bg-white/10 text-custom-gray"
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
          to="/home"
          onClick={() => setActiveTab("Dashboard")}
          className={getTabClass("/home")}
        >
          <LayoutDashboard size={24} />
          <p className="text-base">Dashboard</p>
        </Link>

        {/* INVENTORY */}
        <Link
          to="/home/inventory"
          onClick={() => setActiveTab("Inventory")}
          className={getTabClass("/home/inventory")}
        >
          <Boxes size={24} />
          <p className="text-base">Inventory</p>
        </Link>

        {/* REQUESTS */}
        <Link
          to="/home/requests"
          onClick={() => setActiveTab("Requests")}
          className={getTabClass("/home/requests")}
        >
          <HandHelping size={24} />
          <p className="text-base">Requests</p>
        </Link>

        {/* FORECAST */}
        <Link
          to="/home/forecast"
          onClick={() => setActiveTab("Forecast")}
          className={getTabClass("/home/forecast")}
        >
          <ChartNoAxesCombined size={24} />
          <p className="text-base">Forecast</p>
        </Link>

        {isManager && (
          <>
            {/* TRANSACTIONS */}
            <Link
              to="/home/transactions"
              onClick={() => setActiveTab("Transactions")}
              className={getTabClass("/home/transactions")}
            >
              <FileClock size={24} />
              <p className="text-base">Transactions</p>
            </Link>

            {/* BARCODE */}
            <Link
              to="/home/barcode"
              onClick={() => setActiveTab("Barcode")}
              className={getTabClass("/home/barcode")}
            >
              <Barcode size={24} />
              <p className="text-base">Barcode</p>
            </Link>

            {/* DISCOUNT - Restored! */}
            <Link
              to="/home/discount"
              onClick={() => setActiveTab("Discount")}
              className={getTabClass("/home/discount")}
            >
              <Tag size={24} />
              <p className="text-base">Discount</p>
            </Link>

            {/* ACCOUNTS */}
            <Link
              to="/home/accounts"
              onClick={() => setActiveTab("Accounts")}
              className={getTabClass("/home/accounts")}
            >
              <UserPen size={24} />
              <p className="text-base">Accounts</p>
            </Link>

            <Link
              to="/home/audit"
              onClick={() => setActiveTab("Audit Log")}
              className={getTabClass("/home/audit")}
            >
              <Logs size={24} />
              <p className="text-base">Audit Log</p>
            </Link>

            {/* ARCHIVES */}
            <Link
              to="/home/archives"
              onClick={() => setActiveTab("Archives")}
              className={getTabClass("/home/archives")}
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