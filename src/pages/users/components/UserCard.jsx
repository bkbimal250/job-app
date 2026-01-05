// User Card Component (Mobile)
import React from 'react';
import { Mail, Phone, User, Shield, Trash2 } from 'lucide-react';
import { getRoleBadgeColor, getUserDisplayName } from '../utils/userUtils';
import UserAvatar from './UserAvatar';

const UserCard = ({ 
  user, 
  onDelete 
}) => {
  const displayName = getUserDisplayName(user);

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* User Info */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <UserAvatar user={user} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 text-base mb-1">{displayName}</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Phone size={14} className="text-gray-400" />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Role & Gender */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
              <Shield size={14} />
              {user.role || 'user'}
            </span>
          </div>
          {user.gender && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
              <User size={14} className="text-gray-400" />
              <span>{user.gender}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={() => onDelete && onDelete(user)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

