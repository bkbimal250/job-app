// Spa Filters Component
import React from 'react';
import { Search, Filter, Phone, X } from 'lucide-react';
import { getFilterOptions } from '../utils/spaUtils';

const SpaFilters = ({ 
  spas,
  searchTerm, 
  stateFilter,
  cityFilter,
  phoneFilter,
  onSearchChange, 
  onStateFilterChange,
  onCityFilterChange,
  onPhoneFilterChange
}) => {
  const hasActiveFilters = searchTerm || stateFilter !== 'all' || cityFilter !== 'all' || phoneFilter;

  const clearFilters = () => {
    onSearchChange('');
    onStateFilterChange('all');
    onCityFilterChange('all');
    onPhoneFilterChange('');
  };

  const stateOptions = getFilterOptions(spas, 'state');
  const cityOptions = getFilterOptions(spas, 'city');

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Filter size={20} className="text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Search & Filters</h2>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Search Spas
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="search"
              type="text"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="state-filter" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Filter by State
          </label>
          <select
            id="state-filter"
            value={stateFilter}
            onChange={(e) => onStateFilterChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-gray-50 focus:bg-white"
          >
            <option value="all">All States</option>
            {stateOptions.map((state, idx) => (
              <option key={idx} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="city-filter" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Filter by City
          </label>
          <select
            id="city-filter"
            value={cityFilter}
            onChange={(e) => onCityFilterChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-gray-50 focus:bg-white"
          >
            <option value="all">All Cities</option>
            {cityOptions.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="phone-filter" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Filter by Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              id="phone-filter"
              type="text"
              placeholder="Enter phone number..."
              value={phoneFilter}
              onChange={(e) => onPhoneFilterChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gray-50 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaFilters;

