// Message Card List Component (Mobile View)
import React from 'react';
import MessageCard from './MessageCard';

const MessageCardList = ({ 
  messages, 
  onReply, 
  onDelete 
}) => {
  return (
    <div className="lg:hidden space-y-4">
      {messages.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          onReply={onReply}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default MessageCardList;

