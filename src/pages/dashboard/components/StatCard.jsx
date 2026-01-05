// Stat Card Component
import React from 'react';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: IconName, 
  color, 
  change, 
  changeType, 
  isLoading, 
  link 
}) => {
  const navigate = useNavigate();
  
  // Get icon component from lucide-react
  const Icon = LucideIcons[IconName] || RefreshCw;

  const handleClick = () => {
    if (link) navigate(link);
  };

  // Color mapping for better visual consistency
  const getColorClasses = (color) => {
    const colorMap = {
      'bg-pink-500': 'from-pink-500 to-rose-600',
      'bg-green-500': 'from-green-500 to-emerald-600',
      'bg-blue-500': 'from-blue-500 to-indigo-600',
      'bg-purple-500': 'from-purple-500 to-violet-600',
      'bg-orange-500': 'from-orange-500 to-amber-600',
      'bg-indigo-500': 'from-indigo-500 to-blue-600',
      'bg-green-300': 'from-green-400 to-emerald-500',
    };
    return colorMap[color] || 'from-blue-500 to-indigo-600';
  };

  return (
    <div
      className={`card card-interactive overflow-hidden transition-all duration-300 ${
        isLoading ? 'animate-pulse' : ''
      } ${link ? 'cursor-pointer group' : ''}`}
      onClick={link ? handleClick : undefined}
      tabIndex={link ? 0 : -1}
      role={link ? 'button' : undefined}
      aria-label={link ? `Go to ${title}` : undefined}
      onKeyDown={link ? (e) => { if (e.key === 'Enter') handleClick(); } : undefined}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 rounded shimmer"></div>
            ) : (
              <h3 className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                {value.toLocaleString()}
              </h3>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${getColorClasses(color)} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
        
        {!isLoading && change !== undefined && change !== null && (
          <div className="flex items-center justify-between">
            <div className={`flex items-center text-sm font-medium ${
              changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'increase' ? (
                <ArrowUp size={14} className="mr-1" />
              ) : (
                <ArrowDown size={14} className="mr-1" />
              )}
              <span>{change}%</span>
            </div>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        )}
      </div>
      
      {/* Gradient bottom border */}
      {!isLoading && (
        <div className={`h-1 w-full bg-gradient-to-r ${getColorClasses(color)} opacity-60`}></div>
      )}
    </div>
  );
};

export default StatCard;

