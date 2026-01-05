// System Status Section Component
import React from 'react';
import { Shield, Zap, Target, Globe } from 'lucide-react';
import { formatLastUpdated } from '../utils/statUtils';

const SystemStatusCard = ({ title, status, lastChecked, icon: Icon, color }) => (
  <div className="card p-6 hover:shadow-lg transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">System component</p>
        </div>
      </div>
      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
        {status}
      </span>
    </div>
    <p className="text-xs text-gray-500">Last checked: {lastChecked}</p>
  </div>
);

const SystemStatusSection = ({ loading, lastUpdated }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Shield size={16} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="card p-6 animate-pulse">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))
        ) : (
          <>
            <SystemStatusCard 
              title="API Status" 
              status="Operational" 
              lastChecked={formatLastUpdated(lastUpdated)}
              icon={Zap}
              color="from-blue-500 to-indigo-600"
            />
            <SystemStatusCard 
              title="Database Status" 
              status="Operational" 
              lastChecked={formatLastUpdated(lastUpdated)}
              icon={Target}
              color="from-green-500 to-emerald-600"
            />
            <SystemStatusCard 
              title="Server Status" 
              status="Operational" 
              lastChecked={formatLastUpdated(lastUpdated)}
              icon={Globe}
              color="from-purple-500 to-pink-600"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default SystemStatusSection;

