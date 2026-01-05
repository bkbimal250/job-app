// Dashboard Header Component
import React from 'react';
import { BarChart2, RefreshCw, Clock } from 'lucide-react';
import { formatLastUpdated } from '../utils/statUtils';

const DashboardHeader = ({ lastUpdated, isRefreshing, onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div className="mb-4 sm:mb-0">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart2 size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome back! Here's what's happening today
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {lastUpdated && (
          <div className="text-sm text-gray-600 flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Clock size={16} className="mr-2 text-blue-500" />
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        )}
        <button 
          onClick={onRefresh} 
          disabled={isRefreshing}
          className={`btn btn-primary flex items-center ${
            isRefreshing ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg'
          }`}
        >
          <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;

