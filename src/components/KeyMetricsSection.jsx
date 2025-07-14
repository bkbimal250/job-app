import React from "react";
import { BarChart2, ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "./SectionHeader";

// ========== Component: StatCard ==========
export const StatCard = ({ title, value, icon: Icon, color, change, changeType, isLoading, link }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (link) navigate(link);
  };
  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition duration-300 hover:shadow-md ${isLoading ? 'animate-pulse' : ''} ${link ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''}`}
      onClick={link ? handleClick : undefined}
      tabIndex={link ? 0 : -1}
      role={link ? 'button' : undefined}
      aria-label={link ? `Go to ${title}` : undefined}
      onKeyDown={link ? (e) => { if (e.key === 'Enter') handleClick(); } : undefined}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 rounded mt-1"></div>
            ) : (
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{value.toLocaleString()}</h3>
            )}
            {!isLoading && change !== undefined && (
              <div className={`flex items-center mt-2 text-sm ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {changeType === 'increase' ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                <span>{change}%</span>
                <span className="text-gray-500 ml-1.5">vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color} transition-transform duration-300 hover:scale-110`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
      {!isLoading && (
        <div className={`h-1 w-full ${color.replace('bg-', 'bg-').replace('500', '400')}`}></div>
      )}
    </div>
  );
};

// ========== Component: KeyMetricsSection ==========
const KeyMetricsSection = ({ loading, stats }) => (
  <section className="mb-8">
    <SectionHeader title="Key Metrics" icon={BarChart2} />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {loading
        ? Array(5).fill(0).map((_, index) => (
            <StatCard 
              key={index} 
              title="Loading..." 
              value={0} 
              icon={RefreshCw} 
              color="bg-gray-300" 
              isLoading={true} 
            />
          ))
        : stats.map((stat, index) => <StatCard key={index} {...stat} isLoading={false} />)
      }
    </div>
  </section>
);

export default KeyMetricsSection;