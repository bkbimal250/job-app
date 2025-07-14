import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import FloatingNavigator from './FloatingNavigator';
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { constructImageUrl } from '../utils/constructImageUrl';

const Layout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex justify-end items-center px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Profile image */}
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-200 shadow"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;
                  }}
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border-2 border-blue-200 shadow">
                  {getUserInitials()}
                </div>
              )}
              <div className="text-right mr-4 relative">
                <div
                  className="text-gray-700 font-medium cursor-pointer select-none"
                  onClick={handleProfileClick}
                  tabIndex={0}
                  onBlur={() => setTimeout(() => setProfileMenuOpen(false), 150)}
                >
                  {userName}
                </div>
                <div
                  className="text-gray-500 text-sm cursor-pointer select-none"
                  onClick={handleProfileClick}
                  tabIndex={0}
                >
                  {user?.email}
                </div>
                {user?.phone && (
                  <div className="text-gray-400 text-xs">{user.phone}</div>
                )}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => handleMenuOption('/view-profile')}
                    >
                      View Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => handleMenuOption('/edit-profile')}
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                {userRole}
              </span>
              {/* Enhanced Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200"
              >
                <LogOut size={18} />
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