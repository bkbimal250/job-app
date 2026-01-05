// Charts Section Component
import React from 'react';
import { TrendingUp, Briefcase, Mail, Globe } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { toLineChartData, toVisitChartData } from '../utils/chartUtils';
import { CHART_COLORS } from '../constants';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

export const ChartSkeleton = ({ height = "h-64" }) => (
  <div className={`${height} w-full animate-pulse bg-gray-100 rounded-xl`}></div>
);

const ChartsSection = ({ loading, chartData, error }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* User Growth Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <TrendingUp size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
        </div>
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line 
              data={toLineChartData(chartData?.userData, "Users", CHART_COLORS.SECONDARY)}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>

      {/* Job Growth Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Job Growth</h3>
        </div>
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line 
              data={toLineChartData(chartData?.jobData, "Jobs", CHART_COLORS.PRIMARY)}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>

      {/* Message Volume Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center">
            <Mail size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Message Volume</h3>
        </div>
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line 
              data={toLineChartData(chartData?.messageData, "Messages", CHART_COLORS.WARNING)}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>

      {/* Website Visits Chart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Globe size={16} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Website Visits (30d)</h3>
        </div>
        {loading ? (
          <ChartSkeleton />
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <div className="h-64 w-full">
            <Line 
              data={toVisitChartData(chartData?.visitData)}
              options={{
                responsive: true,
                plugins: { legend: { display: true, position: 'top' }, title: { display: false } },
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;

