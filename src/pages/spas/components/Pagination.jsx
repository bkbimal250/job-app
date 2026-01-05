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

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      // Show first 5 pages
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show last 5 pages
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and 2 on each side
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-5 mt-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg">
          {totalItems > 0 ? (
            <>
              Showing <span className="font-bold text-indigo-600">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-bold text-indigo-600">{Math.min(indexOfLastItem, totalItems)}</span> of{' '}
              <span className="font-bold text-gray-900">{totalItems}</span> spas
              {' '}(<span className="font-semibold text-gray-600">{itemsPerPage}</span> per page)
            </>
          ) : (
            'No spas found'
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-gray-300 hover:border-indigo-500 shadow-sm hover:shadow-md'
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page number buttons */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-indigo-50 border-2 border-gray-300 hover:border-indigo-500 shadow-sm hover:shadow-md'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Show ellipsis if needed */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="flex items-center justify-center w-10 h-10 text-gray-500">...</span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 bg-white text-gray-700 hover:bg-indigo-50 border-2 border-gray-300 hover:border-indigo-500 shadow-sm hover:shadow-md"
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
                : 'bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-gray-300 hover:border-indigo-500 shadow-sm hover:shadow-md'
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

