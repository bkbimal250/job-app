// Message Card Component (Mobile)
import React from 'react';
import { User, Mail, Phone, MapPin, Calendar, Reply, Trash2, MessageSquare } from 'lucide-react';
import { formatMessageDate } from '../utils/dateUtils';

const MessageCard = ({ 
  message, 
  onReply, 
  onDelete 
}) => {
  const dateInfo = formatMessageDate(message.createdAt);

  return (
    <div className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
      <div className="space-y-4">
        {/* Sender Info */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            message.status === 'unread' 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
              : 'bg-gradient-to-br from-gray-400 to-gray-500'
          }`}>
            <User size={20} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 text-base mb-1">{message.sender}</div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1 bg-gray-50 px-3 py-1.5 rounded-lg">
              <Mail size={14} className="text-gray-400" />
              <span className="truncate">{message.senderEmail}</span>
            </div>
            {message.phone && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1 bg-gray-50 px-3 py-1.5 rounded-lg">
                <Phone size={14} className="text-gray-400" />
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

        {/* Message Preview */}
        <div className="pb-4 border-b border-gray-100">
          {message.subject && (
            <div className="font-semibold text-gray-900 text-sm mb-2">{message.subject}</div>
          )}
          <div className="text-sm text-gray-600">{message.snippet}</div>
        </div>

        {/* Reply Status */}
        <div className="pb-4 border-b border-gray-100">
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
        </div>

        {/* Date & Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
            <Calendar size={14} className="text-indigo-500" />
            <div>
              <div className="font-medium">{dateInfo.date}</div>
              <div className="text-indigo-500">{dateInfo.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReply && onReply(message)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] ${
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
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;

