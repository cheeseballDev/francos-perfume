import { Boxes, Clock, TrendingUpDownIcon, TriangleAlertIcon } from "lucide-react";
import StatusCard from "../../components/data_components/StatusCard";

const DashboardHome = ({ role }) => {

  const isManager = role === 'manager';
  
  {
    /* 
    TEMP DATA 
    */
  }
  const cards = [
    {title: "Total Inventory", mainValue: 1450, subText: "from last month", Icon: Boxes, color: "text-custom-green", secondValue: "+" + 12 + "%"},
    {title: "Pending Requests", mainValue: 5, subText: "outbound", Icon: Clock, color: "text-custom-blue", secondValue: 3, thirdValue: 2, secondSubText: "inbound"},
    {title: "Low Stock Perfumes", mainValue: 3, Icon: TriangleAlertIcon, color: "text-custom-yellow", secondValue: "Requires Attention"}
  ];

  if(isManager) {
    cards.push({title: "Total Revenue", mainValue: "₱"+420.69+"K", subText: "from last month", Icon: TrendingUpDownIcon, color: "text-custom-green", secondValue: 5 + "%"})
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-[32px] font-bold text-custom-black mb-2 leading-none tracking-tight">
        Dashboard
      </h1>
      <p className="text-custom-gray text-sm mb-8">System overview and quick metrics.</p>
      
      {
        /* 
          ADD A STATEMENT THAT CHANGES THE COLORS OF THE STATUS DEPENDING WHETHER ITS POSITIVE OR NOT
          THIS IS TO BE DONE IN THE FUTURE
        */
      }

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
        {cards.map((card, index) => (
          <StatusCard 
            key={index}
            title={card.title}
            mainValue={card.mainValue}
            subText={card.subText}
            Icon={card.Icon}
            color={card.color}
            secondValue={card.secondValue}
            thirdValue={card.thirdValue}
            secondSubText={card.secondSubText}
          />
        ))}
      </div>
  
      <div className="h-64 mt-8 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 bg-white">
        Metrics Dashboard Placeholder
        
      </div>
    </div>
  );
};

export default DashboardHome;