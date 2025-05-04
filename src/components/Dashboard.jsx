import React from 'react';
import { Building2, Users, Eye, FileText, Briefcase } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const stats = [
    { title: 'Total Spas', value: '125', icon: Building2, color: 'bg-blue-500' },
    { title: 'Total Users', value: '2,350', icon: Users, color: 'bg-green-500' },
    { title: 'Total Views', value: '15,342', icon: Eye, color: 'bg-purple-500' },
    { title: 'Total Applications', value: '856', icon: FileText, color: 'bg-orange-500' },
    { title: 'Total Jobs', value: '278', icon: Briefcase, color: 'bg-indigo-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;