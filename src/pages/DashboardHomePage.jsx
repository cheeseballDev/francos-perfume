import { Boxes, Clock } from "lucide-react";
import StatusCard from "../components/general_components/StatusCard";

const DashboardHome = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-[32px] font-bold text-gray-900 mb-2 leading-none tracking-tight">
        Dashboard
      </h1>
      <p className="text-gray-500 text-sm mb-8">System overview and quick metrics.</p>
      
      {/* This is where future charts and graphs will go */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        <StatusCard
        title={"Total Inventory"}
        mainValue={"1,450"}
        subText="from last month"
        Icon={Boxes}
        color={"text-custom-green"}
        secondValue={"12% "}

        />
        <StatusCard 
          title={"Pending Requests"}
          mainValue={"5"}
          Icon={Clock}
          color={"text-custom-blue"}
        />

        <StatusCard 
          title={"Pending Requests"}
          mainValue={"5"}
          Icon={Clock}
          color={"text-custom-blue"}
        />

        <StatusCard 
          title={"Pending Requests"}
          mainValue={"5"}
          Icon={Clock}
          color={"text-custom-blue"}
        />

      </div>
  
      <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 bg-white">
        Metrics Dashboard Placeholder
        
      </div>
    </div>
  );
};

export default DashboardHome;