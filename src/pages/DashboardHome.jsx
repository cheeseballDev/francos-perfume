import React from 'react';

const DashboardHome = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-[32px] font-bold text-gray-900 mb-2 leading-none tracking-tight">
        Dashboard
      </h1>
      <p className="text-gray-500 text-sm mb-8">System overview and quick metrics.</p>
      
      {/* This is where future charts and graphs will go */}
      <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 bg-white">
        Metrics Dashboard Placeholder
      </div>
    </div>
  );
};

export default DashboardHome;