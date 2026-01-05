// Message Table Row Component (Desktop)
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Reply, Trash2, MessageSquare } from 'lucide-react';
import { formatMessageDate } from '../utils/dateUtils';

const MessageRow = ({ 
  message, 
  onReply, 
  onDelete 
}) => {
  const dateInfo = formatMessageDate(message.createdAt);

  return (
    <tr className="hover:bg-purple-50/50 transition-all duration-200 border-b border-gray-100 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            message.status === 'unread' 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-500'
          }`}>
            <User size={18} className="text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 mb-1">{message.sender}</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
              <Mail size={13} className="text-gray-400" />
              <span className="truncate">{message.senderEmail}</span>
            </div>
            {message.phone && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <Phone size={13} className="text-gray-400" />
                <span>{message.phone}</span>
              </div>
            )}
            {message.location && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded mt-1">
                <MapPin size={12} className="text-gray-400" />
                <span>{message.location}</span>
              </div>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-5 max-w-md">
        <div className="space-y-1">
          {message.subject && (
            <div className="font-medium text-gray-900 text-sm mb-1">{message.subject}</div>
          )}
          <div className="text-sm text-gray-600 line-clamp-2">{message.snippet}</div>
        </div>
      </td>

      <td className="px-6 py-5">
        {message.replyMessage ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
            <div className="flex items-start gap-2 mb-2">
              <MessageSquare size={14} className="text-green-600 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-green-800 mb-1">Reply:</div>
                <div className="text-sm text-green-700">{message.replyMessage}</div>
              </div>
            </div>
            {(message.repliedBy || message.repliedAt) && (
              <div className="text-xs text-green-600 border-t border-green-200 pt-2 mt-2">
                {message.repliedBy && (
                  <div>
                    By: {message.repliedBy.firstname} {message.repliedBy.lastname}
                    {message.repliedBy.email && ` (${message.repliedBy.email})`}
                  </div>
                )}
                {message.repliedAt && (
                  <div className="text-green-500 mt-1">{message.repliedAt}</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400 italic text-sm">No reply yet</span>
        )}
      </td>

      <td className="px-6 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <Calendar size={14} className="text-gray-400" />
          <div>
            <div className="font-medium">{dateInfo.date}</div>
            <div className="text-xs text-gray-500">{dateInfo.time}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onReply && onReply(message)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${
              message.replyMessage
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Reply size={14} />
            {message.replyMessage ? 'Update' : 'Reply'}
          </button>
          <button
            onClick={() => onDelete && onDelete(message.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MessageRow;

