import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  FileText,
  MessageSquare,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/users", icon: Users, label: "Users" },
    { path: "/spas", icon: Building2, label: "Spas" },
    { path: "/addSpa ", icon: Building2, label: "Add spa " },
    { path: "/add-spa-job", icon: Building2, label: "Add jobs" },
    { path: "/jobs", icon: Briefcase, label: "Jobs" },
    { path: "/applications", icon: FileText, label: "Job Applications" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 transition-colors ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <item.icon size={20} className="mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
