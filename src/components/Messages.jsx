import React, { useState } from 'react';
import { Search, Calendar, Mail, Star, Trash2, Reply, Archive } from 'lucide-react';

const Messages = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dummyMessages = [
    { 
      id: 1, 
      sender: 'Alex Johnson', 
      senderEmail: 'alex@example.com',
      subject: 'Spa Service Inquiry',
      snippet: 'Hello, I would like to know more about your spa services...',
      date: '2024-05-03',
      time: '10:30 AM',
      status: 'unread',
      important: true
    },
    { 
      id: 2, 
      sender: 'Sarah Williams', 
      senderEmail: 'sarah.w@example.com',
      subject: 'Job Application Follow-up',
      snippet: 'Thank you for considering my application. I wanted to follow up...',
      date: '2024-05-02',
      time: '2:15 PM',
      status: 'read',
      important: false
    },
    { 
      id: 3, 
      sender: 'Michael Chen', 
      senderEmail: 'michael.c@example.com',
      subject: 'Feedback on Spa Experience',
      snippet: 'I had an amazing experience at Royal Spa last week...',
      date: '2024-05-01',
      time: '4:45 PM',
      status: 'read',
      important: false
    },
  ];

  const getStatusIcon = (status) => {
    return status === 'unread' ? <Mail size={20} className="text-blue-600" /> : <Mail size={20} className="text-gray-400" />;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="important">Important</option>
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
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 px-6 py-3">&nbsp;</th>
              <th className="w-8 px-6 py-3">&nbsp;</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyMessages.map((message) => (
              <tr key={message.id} className={message.status === 'unread' ? 'bg-blue-50' : ''}>
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
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-md">{message.snippet}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">{message.date}</div>
                  <div className="text-sm text-gray-500">{message.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" title="Reply">
                    <Reply size={18} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 mr-3" title="Archive">
                    <Archive size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-900" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Messages;