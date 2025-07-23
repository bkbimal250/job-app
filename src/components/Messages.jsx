import React, { useState, useEffect } from 'react';
import { Search, Calendar, Mail, Star, Trash2, Reply, Archive, AlertCircle, Check, Loader } from 'lucide-react';
import axios from 'axios';
import { getToken } from '../utils/getToken';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

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
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState(null);

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
    setStatusUpdating(true);
    setStatusUpdateError(null);
    console.log('Updating status for message', messageId, 'to', newStatus);
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
      // Refetch messages to ensure consistency
      await fetchMessages();
    } catch (error) {
      console.error('Error updating message status:', error);
      setStatusUpdateError(error.response?.data?.error || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
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
            {statusUpdateError && (
              <div className="text-center py-2">
                <span className="text-red-600 font-medium">{statusUpdateError}</span>
              </div>
            )}
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 px-6 py-3">&nbsp;</th>
                  <th className="w-8 px-6 py-3">&nbsp;</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender (Name, Email, Jobs)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={`transition hover:bg-violet-50 ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
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
                        {message.subject && message.subject.toLowerCase().includes('job') && (
                          <div className="text-xs text-blue-600 font-semibold">{message.subject}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{message.phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-md">{message.snippet}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{message.date}</div>
                      <div className="text-sm text-gray-500">{message.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Status dropdown */}
                      <select
                        className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 bg-gray-50"
                        value={message.status}
                        onClick={e => e.stopPropagation()}
                        onChange={e => handleStatusChange(message.id, e.target.value)}
                        disabled={statusUpdating}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
    </div>
  );
};

export default Messages;