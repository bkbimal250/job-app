import React, { useState, useEffect } from 'react';
import { Search, Calendar, Mail, Star, Trash2, Reply, Archive, AlertCircle, Check, Loader } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../utils/getToken';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [messageCount, setMessageCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [currentPage, statusFilter]);

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
      
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      
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
          phone: msg.phone
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

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const token = getToken();
      
      await axios.patch(`${BASE_URL}/messages/${messageId}`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Update the local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        )
      );
    } catch (error) {
      console.error('Error updating message status:', error);
    }
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

  const openMessageDetails = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Mark as read if it's unread
    if (message.status === 'unread') {
      handleStatusChange(message.id, 'read');
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
            
            <select
              className="border rounded-lg px-4 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
            
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
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 px-6 py-3">&nbsp;</th>
                  <th className="w-8 px-6 py-3">&nbsp;</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={`cursor-pointer ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
                    onClick={() => openMessageDetails(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusIcon(message.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {message.important && <Star size={20} className="text-yellow-500 fill-current" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{message.sender}</div>
                        <div className="text-sm text-gray-500">{message.senderEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{message.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{message.phone}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-md">{message.snippet}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{message.date}</div>
                      <div className="text-sm text-gray-500">{message.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3" 
                        title="Mark as replied"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(message.id, 'replied');
                        }}
                      >
                        <Reply size={18} />
                      </button>
                      <button 
                        className="text-gray-600 hover:text-gray-900 mr-3" 
                        title="Mark as closed"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(message.id, 'closed');
                        }}
                      >
                        <Archive size={18} />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900" 
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(message.id);
                        }}
                      >
                        <Trash2 size={18} />
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

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="font-semibold text-lg">{selectedMessage.sender}</div>
                  <div className="text-gray-600">{selectedMessage.senderEmail}</div>
                  {selectedMessage.phone && (
                    <div className="text-gray-600">{selectedMessage.phone}</div>
                  )}
                  {selectedMessage.location && (
                    <div className="text-gray-600">{selectedMessage.location}</div>
                  )}
                </div>
                <div className="text-gray-500 text-right">
                  <div>{selectedMessage.date}</div>
                  <div>{selectedMessage.time}</div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line">{selectedMessage.fullMessage}</div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Status: <span className="inline-flex items-center ml-1">
                      {selectedMessage.status === 'unread' && <span className="text-blue-600 font-medium">Unread</span>}
                      {selectedMessage.status === 'read' && <span className="text-green-600 font-medium">Read</span>}
                      {selectedMessage.status === 'replied' && <span className="text-purple-600 font-medium">Replied</span>}
                      {selectedMessage.status === 'closed' && <span className="text-gray-600 font-medium">Closed</span>}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                      onClick={() => {
                        handleStatusChange(selectedMessage.id, 'replied');
                        setSelectedMessage({...selectedMessage, status: 'replied'});
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Reply size={16} />
                        <span>Mark as Replied</span>
                      </div>
                    </button>
                    <button 
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      onClick={() => {
                        handleStatusChange(selectedMessage.id, 'closed');
                        setSelectedMessage({...selectedMessage, status: 'closed'});
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Check size={16} />
                        <span>Mark as Closed</span>
                      </div>
                    </button>
                    <button 
                      className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                      onClick={() => {
                        handleDelete(selectedMessage.id);
                        setShowModal(false);
                      }}
                    >
                      <div className="flex items-center gap-1">
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  onClick={() => {
                    // Open default email client
                    window.location.href = `mailto:${selectedMessage.senderEmail}?subject=Re: ${selectedMessage.subject}`;
                    // Mark as replied
                    handleStatusChange(selectedMessage.id, 'replied');
                    setSelectedMessage({...selectedMessage, status: 'replied'});
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Reply size={20} />
                    <span>Reply via Email</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;