// Key Metrics Section Component
import React from 'react';
import { TrendingUp, RefreshCw } from 'lucide-react';
import StatCard from './StatCard';

const KeyMetricsSection = ({ loading, stats }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <TrendingUp size={16} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Key Metrics</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4).fill(0).map((_, index) => (
              <StatCard 
                key={index} 
                title="Loading..." 
                value={0} 
                icon="RefreshCw" 
                color="bg-gray-300" 
                isLoading={true} 
              />
            ))
          : stats.map((stat, index) => (
              <StatCard 
                key={index} 
                {...stat} 
                isLoading={false} 
              />
            ))
        }
      </div>
    </section>
  );
};

export default KeyMetricsSection;

