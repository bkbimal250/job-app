import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingNavigator from './FloatingNavigator';
import { LogOut, Settings, User, Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { constructImageUrl } from '../utils/constructImageUrl';

const Layout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const getUserDisplayName = () => {
    if (!user) return 'User';
    const firstName = user.firstName || user.firstname || '';
    const lastName = user.lastName || user.lastname || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.email || 'User';
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const first = user.firstName || user.firstname || '';
    const last = user.lastName || user.lastname || '';
    if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
    if (user.fullName) return user.fullName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const userName = getUserDisplayName();
  const userRole = role || 'Unknown';

  // Get profile image URL
  const imagePath = user?.profileimage || user?.profileImage || user?.avatar;
  const imageUrl = constructImageUrl(imagePath);

  const handleProfileClick = () => {
    setProfileMenuOpen((open) => !open);
  };

  const handleMenuOption = (path) => {
    setProfileMenuOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 relative">
          <div className="flex justify-between items-center px-6 py-4">
            {/* Left Section - Search and Menu */}
            <div className="flex items-center space-x-4">
              <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Menu size={20} className="text-gray-600" />
              </button>
              
              {/* Search Bar */}
              <div className="hidden md:flex relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Right Section - Notifications and Profile */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                >
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in">
                    <div className="p-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                        <p className="text-sm text-gray-700">New job application received</p>
                        <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                      </div>
                      <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                        <p className="text-sm text-gray-700">System update completed</p>
                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Section */}
              <div className="flex items-center gap-3">
                {/* Profile image */}
                <div className="relative">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;
                      }}
                      onClick={handleProfileClick}
                    />
                  ) : (
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-blue-200 shadow-sm cursor-pointer hover:border-blue-300 transition-colors"
                      onClick={handleProfileClick}
                    >
                      {getUserInitials()}
                    </div>
                  )}
                  
                  {/* Online Status Indicator */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                {/* User Info */}
                <div className="hidden sm:block text-right relative">
                  <div
                    className="text-gray-700 font-semibold cursor-pointer select-none hover:text-gray-900 transition-colors"
                    onClick={handleProfileClick}
                    tabIndex={0}
                    onBlur={() => setTimeout(() => setProfileMenuOpen(false), 150)}
                  >
                    {userName}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {user?.email}
                  </div>
                  {user?.phone && (
                    <div className="text-gray-400 text-xs">{user.phone}</div>
                  )}
                </div>

                {/* Role Badge */}
                <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full border border-blue-200">
                  {userRole}
                </span>

                {/* Profile Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=3b82f6&color=fff`;
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {getUserInitials()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{userName}</div>
                          <div className="text-sm text-gray-500">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => handleMenuOption('/view-profile')}
                      >
                        <User size={16} className="mr-3 text-gray-400" />
                        View Profile
                      </button>
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => handleMenuOption('/edit-profile')}
                      >
                        <Settings size={16} className="mr-3 text-gray-400" />
                        Edit Profile
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} className="mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
      <FloatingNavigator />
    </div>
  );
};

export default Layout;