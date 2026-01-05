// User Table Row Component (Desktop)
import React from 'react';
import { Mail, Phone, User, Shield, Trash2 } from 'lucide-react';
import { getRoleBadgeColor, getUserDisplayName } from '../utils/userUtils';
import UserAvatar from './UserAvatar';

const UserRow = ({ 
  user, 
  onDelete 
}) => {
  const displayName = getUserDisplayName(user);

  return (
    <tr className="hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} size="md" />
          <div>
            <div className="font-semibold text-gray-900">{displayName}</div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Mail size={16} className="text-gray-400" />
          <span className="truncate">{user.email}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Phone size={16} className="text-gray-400" />
          <span>{user.phone || 'N/A'}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
          <Shield size={14} />
          {user.role || 'user'}
        </span>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={16} className="text-gray-400" />
          <span>{user.gender || 'N/A'}</span>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDelete && onDelete(user)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            title="Delete user"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;

