// Message Header Component
import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';

const MessageHeader = ({ messageCount }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 mb-6 text-white">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
          <Mail size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Messages Management</h1>
          <div className="flex items-center gap-2 text-indigo-100">
            <MessageSquare size={16} />
            <p className="text-sm font-medium">
              {messageCount} {messageCount === 1 ? 'message' : 'messages'} total
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;

