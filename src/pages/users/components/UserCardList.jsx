// User Card List Component (Mobile View)
import React from 'react';
import UserCard from './UserCard';

const UserCardList = ({ 
  users, 
  onDelete 
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {users.map((user, index) => (
        <UserCard
          key={user._id || index}
          user={user}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default UserCardList;

