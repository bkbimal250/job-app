// Subscriber List Component
import React from 'react';
import { Users, Mail, Phone, Copy, Calendar, Search, AlertCircle } from 'lucide-react';
import { EmptyState, ErrorMessage } from '../../../components/common';
import { formatSubscriberDate } from '../utils/subscriberUtils';

const SubscriberCard = ({ subscriber, onCopyEmail, isSelected, onToggleSelect }) => {
  return (
    <div className={`bg-white rounded-xl border-2 p-4 hover:shadow-md transition-all duration-200 group ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {subscriber.email || <span className="text-gray-400">No email</span>}
            </h3>
            {subscriber.phone && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
                <Phone size={14} />
                <span>{subscriber.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {subscriber.preferredChannel || 'email'}
              </span>
              {subscriber.createdAt && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar size={12} />
                  <span>{formatSubscriberDate(subscriber.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {subscriber.email && (
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
            onClick={() => onCopyEmail && onCopyEmail(subscriber.email)}
            title="Copy email"
          >
            <Copy size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

const SubscriberList = ({ 
  subscribers, 
  loading, 
  error, 
  searchTerm,
  onSearchChange,
  selectedEmails,
  onEmailSelect,
  onSelectAll,
  onCopyEmail
}) => {
  const allEmailsSelected = subscribers.length > 0 && 
    selectedEmails.length === subscribers.filter(s => s.email).length;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <Users size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Subscribers List</h2>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
          placeholder="Search subscribers by email or phone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Select All */}
      <div className="flex items-center mb-4 pb-4 border-b border-gray-200">
        <input
          type="checkbox"
          id="selectAll"
          checked={allEmailsSelected}
          onChange={onSelectAll}
          className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="selectAll" className="ml-2 text-sm font-medium text-gray-700">
          Select All Subscribers ({subscribers.filter(s => s.email).length})
        </label>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : subscribers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Subscribers Found"
          message="No subscribers match your search criteria."
        />
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {subscribers.map((subscriber) => (
            <SubscriberCard
              key={subscriber._id}
              subscriber={subscriber}
              isSelected={selectedEmails.includes(subscriber.email)}
              onToggleSelect={() => onEmailSelect({ target: { value: subscriber.email } })}
              onCopyEmail={onCopyEmail}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SubscriberList;

