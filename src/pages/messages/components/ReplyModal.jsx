// Reply Modal Component
import React, { useState, useEffect } from 'react';
import { XCircle, Send, Loader } from 'lucide-react';

const ReplyModal = ({ 
  message, 
  isOpen, 
  onClose, 
  onSendReply, 
  loading,
  error: replyError
}) => {
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (message && message.replyMessage) {
      setReplyText(message.replyMessage);
    } else {
      setReplyText('');
    }
  }, [message]);

  if (!isOpen || !message) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSendReply(replyText);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Reply to {message.sender}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Original Message */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm font-semibold text-gray-700 mb-2">Original Message:</div>
            <div className="text-sm text-gray-600 whitespace-pre-line">{message.fullMessage}</div>
            {message.subject && (
              <div className="mt-2 text-xs text-gray-500">
                Subject: <span className="font-medium">{message.subject}</span>
              </div>
            )}
          </div>

          {/* Existing Reply */}
          {message.replyMessage && (
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <div className="text-sm font-semibold text-green-800 mb-2">Existing Reply:</div>
              <div className="text-sm text-green-700 mb-2">{message.replyMessage}</div>
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
          )}

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {message.replyMessage ? 'Update Reply' : 'Your Reply'}
              </label>
              <textarea
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                rows={6}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                disabled={loading}
              />
            </div>

            {replyError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                <p className="text-sm text-red-800">{replyError}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !replyText.trim()}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    {message.replyMessage ? 'Update Reply' : 'Send Reply'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;

