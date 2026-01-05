// Quick Actions Section Component
import React from 'react';
import { Zap, Plus, FileText, Users, Activity, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <div 
    className="card p-6 cursor-pointer hover:shadow-lg transition-all duration-300 group"
    onClick={onClick}
  >
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <ArrowUp size={16} className="text-gray-400 group-hover:text-blue-500 transition-colors transform rotate-45" />
    </div>
  </div>
);

const QuickActionsSection = () => {
  const navigate = useNavigate();
  
  const actions = [
    {
      title: "Add New Job",
      description: "Post a new job opening",
      icon: Plus,
      color: "from-blue-500 to-indigo-600",
      onClick: () => navigate('/add-spa-job')
    },
    {
      title: "View Applications",
      description: "Review job applications",
      icon: FileText,
      color: "from-green-500 to-emerald-600",
      onClick: () => navigate('/applications')
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      onClick: () => navigate('/users')
    },
    {
      title: "Send Notifications",
      description: "Send job alerts to subscribers",
      icon: Activity,
      color: "from-orange-500 to-red-600",
      onClick: () => navigate('/suscribers')
    }
  ];

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Zap size={16} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </section>
  );
};

export default QuickActionsSection;

