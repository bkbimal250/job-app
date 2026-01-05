// User Filters Component
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { USER_ROLES } from '../constants';

const UserFilters = ({ 
  searchTerm, 
  roleFilter, 
  onSearchChange, 
  onRoleFilterChange 
}) => {
  const hasActiveFilters = searchTerm || roleFilter !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onRoleFilterChange('all');
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Filter size={20} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
          {hasActiveFilters && (
            <span className="ml-2 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Search Users
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="search"
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="role-filter" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Filter by Role
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => onRoleFilterChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-gray-50 focus:bg-white"
          >
            <option value="all">All Roles</option>
            <option value={USER_ROLES.ADMIN}>Admin</option>
            <option value={USER_ROLES.USER}>User</option>
            <option value={USER_ROLES.SPA_MANAGER}>Spa Manager</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;

