// Pagination Component
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  indexOfFirstItem,
  indexOfLastItem,
  onPageChange,
  onPreviousPage,
  onNextPage
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-bold text-blue-600">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-bold text-blue-600">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
              <span className="font-bold text-gray-900">{totalItems}</span> jobs
              {' '}(<span className="font-semibold text-gray-600">{itemsPerPage}</span> per page)
            </>
          ) : (
            'No jobs found'
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-500 shadow-sm hover:shadow-md'
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page number buttons */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-500 shadow-sm hover:shadow-md'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {/* Show ellipsis if needed */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-500 shadow-sm hover:shadow-md"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-gray-300 hover:border-blue-500 shadow-sm hover:shadow-md'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

