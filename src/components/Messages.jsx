import React, { useState, useEffect } from 'react';
import { Search, Calendar, Mail, Star, Trash2, Reply, Archive, AlertCircle, Check, Loader } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../utils/getToken';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { useAuthUser } from '../auth/AuthContext';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [messageCount, setMessageCount] = useState(0);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState(null);

  const user = useAuthUser();

  useEffect(() => {
    fetchMessages();
  }, [currentPage]);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // Build the query parameters
      let url = `${BASE_URL}/messages?page=${currentPage}`;
      if (startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Transform API response to match component's expected format
        const formattedMessages = response.data.data.map(msg => ({
          id: msg._id,
          sender: msg.name,
          senderEmail: msg.email,
          subject: msg.subject,
          snippet: msg.message.substring(0, 100) + (msg.message.length > 100 ? '...' : ''),
          fullMessage: msg.message,
          date: new Date(msg.createdAt).toLocaleDateString(),
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: msg.status,
          important: msg.subject === 'jobs' || msg.subject === 'employer', // Mark job-related messages as important
          location: msg.location,
          phone: msg.phone,
          replyMessage: msg.replyMessage,
          repliedBy: msg.repliedBy || null,
          repliedAt: msg.repliedAt ? new Date(msg.repliedAt).toLocaleString() : ''
        }));
        
        setMessages(formattedMessages);
        setTotalPages(response.data.pages || 1);
        setMessageCount(response.data.total || 0);
      } else {
        setError("Failed to fetch messages");
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.response?.data?.error || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMessages();
  };



  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const token = getToken();
      
      await axios.delete(`${BASE_URL}/messages/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove message from the local state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleReply = (message) => {
    setReplyingTo(message);
    setReplyText('');
    setReplyError(null);
    setReplyModalOpen(true);
  };

  const sendReply = async () => {
    if (!replyText.trim()) {
      setReplyError('Reply message cannot be empty.');
      return;
    }
    setReplyLoading(true);
    setReplyError(null);
    try {
      const token = getToken();
      await axios.post(`${BASE_URL}/messages/${replyingTo.id}/reply`,
        {
          replyMessage: replyText,
          repliedBy: {
            name: user?.name || 'Admin',
            email: user?.email || ''
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setReplyModalOpen(false);
      setReplyingTo(null);
      setReplyText('');
      await fetchMessages();
    } catch (error) {
      setReplyError(error.response?.data?.error || 'Failed to send reply');
    } finally {
      setReplyLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    return status === 'unread' 
      ? <Mail size={20} className="text-blue-600" /> 
      : <Mail size={20} className="text-gray-400" />;
  };

  // Filter messages by search term
  const filteredMessages = messages.filter(msg => 
    msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
        
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End date"
              />
            </div>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Loader className="h-8 w-8 mx-auto text-blue-500 animate-spin" />
            <p className="mt-2 text-gray-600">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <AlertCircle className="h-8 w-8 mx-auto text-red-500" />
            <p className="mt-2 text-red-600">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <Mail className="h-10 w-10 mx-auto text-gray-400" />
            <p className="mt-2 text-gray-600">No messages found</p>
          </div>
        ) : (
          <>
            <table className="w-full min-w-[700px] overflow-x-auto text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Sender</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Preview</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Reply</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-violet-50">
                    <td className="px-4 py-2 whitespace-nowrap font-medium">
                      <div>{message.sender}</div>
                      <div className="text-xs text-gray-500">{message.senderEmail}</div>
                      <div className="text-xs text-gray-400">{message.phone || '-'}</div>
                    </td>
                    <td className="px-4 py-2 max-w-xs truncate text-gray-700">{message.snippet}</td>
                    <td className="px-4 py-2">
                      {message.replyMessage ? (
                        <div className="bg-green-50 border border-green-200 rounded p-2 text-green-700 text-xs">
                          <b>Reply:</b> {message.replyMessage}
                          {(message.repliedBy || message.repliedAt) && (
                            <div className="mt-1 text-green-800 text-xxs">
                              <span>
                                By: {message.repliedBy && `${message.repliedBy.firstname} ${message.repliedBy.lastname}`}
                                {message.repliedBy && message.repliedBy.email && (
                                  <span> ({message.repliedBy.email})</span>
                                )}
                                {message.repliedAt && <span> | {message.repliedAt}</span>}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No reply yet</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-500">
                      <div>{message.date}</div>
                      <div className="text-xs">{message.time}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <button 
                        className="text-red-600 hover:text-red-900 mr-2" 
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title={message.replyMessage ? 'Update Reply' : 'Reply'}
                        onClick={e => {
                          e.stopPropagation();
                          handleReply(message);
                        }}
                      >
                        <Reply size={16} /> {message.replyMessage ? 'Update Reply' : 'Reply'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{messages.length}</span> of{' '}
                <span className="font-medium">{messageCount}</span> messages
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-gray-100 rounded">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reply Modal */}
      <Modal open={replyModalOpen} onClose={() => setReplyModalOpen(false)} center>
        <h2 className="text-lg font-bold mb-2">Reply to {replyingTo?.sender}</h2>
        {replyingTo && (
          <div className="mb-2 p-2 bg-gray-50 border border-gray-200 rounded text-gray-700 text-xs">
            <b>Original Message:</b>
            <div className="whitespace-pre-line">{replyingTo.fullMessage}</div>
            {replyingTo.replyMessage && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-xs">
                <b>Existing Reply:</b> {replyingTo.replyMessage}
                {replyingTo.repliedBy && (
                  <div className="mt-1 text-green-800 text-xxs">
                    <span>
                      By: {replyingTo.repliedBy.firstname} {replyingTo.repliedBy.lastname}
                      {replyingTo.repliedBy.email && (
                        <span> ({replyingTo.repliedBy.email})</span>
                      )}
                    </span>
                    {replyingTo.repliedAt && <span> | {replyingTo.repliedAt}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <textarea
          className="w-full border rounded p-2 mb-2"
          rows={5}
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder="Type your reply here..."
          disabled={replyLoading}
        />
        {replyError && <div className="text-red-600 mb-2">{replyError}</div>}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={sendReply}
          disabled={replyLoading}
        >
          {replyLoading ? 'Sending...' : 'Send Reply'}
        </button>
      </Modal>
    </div>
  );
};

export default Messages;