// Pagination Component
import React from 'react';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Calculate the range of items being displayed
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-bold text-purple-600">{startItem}</span> to{' '}
              <span className="font-bold text-purple-600">{endItem}</span> of{' '}
              <span className="font-bold text-gray-900">{totalItems}</span> messages
              {' '}(<span className="font-semibold text-gray-600">{itemsPerPage}</span> per page)
            </>
          ) : (
            'No messages found'
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Previous
          </button>
          <div className="text-sm font-semibold text-gray-700 bg-purple-50 px-4 py-2.5 rounded-xl border border-purple-200">
            Page <span className="text-purple-600">{currentPage}</span> of{' '}
            <span className="text-purple-600">{totalPages}</span>
          </div>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-purple-500 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

