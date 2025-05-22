import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingNavigator from './FloatingNavigator';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Layout = () => {
  const { user, role, logout } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    return fullName || user.email || 'User';
  };

  const userName = getUserDisplayName();
  const userRole = role || 'Unknown';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex justify-end items-center px-6 py-4">
            <div className="flex items-center">
              <div className="text-right mr-4">
                <div className="text-gray-700 font-medium">{userName}</div>
                <div className="text-gray-500 text-sm">{user?.email}</div>
                {user?.phone && (
                  <div className="text-gray-400 text-xs">{user.phone}</div>
                )}
              </div>
              <span className="mr-4 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {userRole}
              </span>
              
              {/* Enhanced Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-red-700 rounded-md hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
      <FloatingNavigator />
    </div>
  );
};

export default Layout;