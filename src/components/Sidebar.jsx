import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
  Mail,
  Plus,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { 
      path: "/dashboard", 
      icon: LayoutDashboard, 
      label: "Dashboard",
      description: "Overview & Analytics"
    },
    { 
      path: "/users", 
      icon: Users, 
      label: "Users",
      description: "Manage Users"
    },
    { 
      path: "/spas", 
      icon: Building2, 
      label: "Spas",
      description: "Spa Management"
    },
    { 
      path: "/addSpa", 
      icon: Plus, 
      label: "Add Spa",
      description: "Create New Spa"
    },
    { 
      path: "/add-spa-job", 
      icon: Briefcase, 
      label: "Add Jobs",
      description: "Post New Jobs"
    },
    { 
      path: "/jobs", 
      icon: Briefcase, 
      label: "Jobs",
      description: "Job Management"
    },
    { 
      path: "/applications", 
      icon: FileText, 
      label: "Applications",
      description: "Job Applications"
    },
    { 
      path: "/messages", 
      icon: MessageSquare, 
      label: "Messages",
      description: "User Messages"
    },
    { 
      path: "/suscribers", 
      icon: Mail, 
      label: "Subscribers",
      description: "Email Subscribers"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white w-64 min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 animate-pulse-slow">
        <Sparkles className="text-blue-400/20" size={16} />
      </div>
      <div className="absolute bottom-40 left-10 animate-pulse-slow" style={{ animationDelay: '1s' }}>
        <Sparkles className="text-purple-400/20" size={12} />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Spa Admin
              </h1>
              <p className="text-xs text-gray-400">Management Portal</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border border-blue-500/30 shadow-lg"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"></div>
                    )}
                    
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg" 
                          : "bg-gray-700/50 group-hover:bg-gray-600/50"
                      }`}>
                        <IconComponent size={18} className="transition-transform duration-200 group-hover:scale-110" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                          {item.description}
                        </div>
                      </div>
                      {/* Arrow Indicator */}
                      <ChevronRight 
                        size={16} 
                        className={`transition-all duration-200 ${
                          isActive 
                            ? "text-blue-400 transform translate-x-1" 
                            : "text-gray-500 group-hover:text-gray-400 group-hover:translate-x-1"
                        }`} 
                      />
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700/50">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg p-3 border border-blue-500/20">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300">System Online</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">All services operational</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
