// Application Filters Component
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { APPLICATION_STATUSES } from '../constants';

const ApplicationFilters = ({ jobFilter, statusFilter, onJobFilterChange, onStatusFilterChange }) => {
  const hasActiveFilters = jobFilter || statusFilter;

  const clearFilters = () => {
    onJobFilterChange('');
    onStatusFilterChange('');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Filter size={20} className="text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <span className="ml-2 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="job-filter" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Filter by Job Title or Spa
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="job-filter"
              type="text"
              placeholder="Enter job title or spa name..."
              value={jobFilter}
              onChange={(e) => onJobFilterChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status-filter" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-gray-50 focus:bg-white font-medium text-gray-700 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value={APPLICATION_STATUSES.PENDING}>Pending</option>
            <option value={APPLICATION_STATUSES.SHORTLISTED}>Shortlisted</option>
            <option value={APPLICATION_STATUSES.REJECTED}>Rejected</option>
            <option value={APPLICATION_STATUSES.HIRED}>Hired</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;

