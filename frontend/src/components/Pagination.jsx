import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({ 
  currentPage, 
  totalPages, 
  totalCount, 
  onPageChange, 
  loading,
  compact = false
}) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = compact ? 5 : 7;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > (compact ? 3 : 4)) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - (compact ? 0 : 1));
      const end = Math.min(totalPages - 1, currentPage + (compact ? 0 : 1));
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - (compact ? 2 : 3)) {
        pages.push('...');
      }
      
      // Show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="flex items-center justify-center w-9 h-9 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        {/* Page Numbers - Compact */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-9 h-9">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="flex items-center justify-center w-9 h-9 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        
        {loading && (
          <div className="flex items-center ml-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-purple-600"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Showing page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
          <span className="font-semibold text-gray-900">{totalPages}</span>
          {totalCount > 0 && (
            <span className="ml-2">
              ({totalCount} total event{totalCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>
        
        {loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-purple-600"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-10 h-10">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  disabled={loading}
                  className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}