// Daily Visits Chart Component
import React from 'react';
import { PieChart as PieIcon, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PIE_CHART_COLORS } from '../constants';

const DailyVisitsChart = ({ dailyVisits }) => {
  return (
    <>
      {/* Pie Chart */}
      <div className="card p-6 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <PieIcon size={16} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Daily Website Visits (Last 30 Days)</h2>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={dailyVisits}
              dataKey="views"
              nameKey="date"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, views }) => views > 0 ? views : ''}
            >
              {dailyVisits.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={PIE_CHART_COLORS[idx % PIE_CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${value} visits`, 'Visits']} 
              labelFormatter={label => {
                const entry = dailyVisits.find(d => new Date(d.date).toLocaleDateString() === label);
                return entry ? new Date(entry.date).toLocaleDateString() : label;
              }} 
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="card p-6 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <Calendar size={16} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Daily Website Visits (Last 30 Days)</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Visits</th>
              </tr>
            </thead>
            <tbody>
              {dailyVisits.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-gray-700">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{item.views || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DailyVisitsChart;

