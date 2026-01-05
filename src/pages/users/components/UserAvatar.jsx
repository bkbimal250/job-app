// User Avatar Component
import React from 'react';
import { constructImageUrl } from '../../../utils/constructImageUrl';
import { getUserInitials } from '../utils/userUtils';

const UserAvatar = ({ user, size = 'md' }) => {
  const imagePath = user?.profileimage || user?.profileImage || user?.avatar;
  const imageUrl = constructImageUrl(imagePath);
  const initials = getUserInitials(user);
  const displayName = user?.fullName || user?.firstname || user?.email || 'User';

  // Size mapping with complete classes
  const sizeConfig = {
    sm: { container: 'h-8 w-8', text: 'text-xs' },
    md: { container: 'h-10 w-10', text: 'text-sm' },
    lg: { container: 'h-12 w-12', text: 'text-base' },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={displayName}
        className={`${config.container} rounded-full object-cover border-2 border-gray-200`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff&size=128`;
        }}
      />
    );
  }

  return (
    <div className={`${config.container} ${config.text} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-gray-200`}>
      {initials}
    </div>
  );
};

export default UserAvatar;

