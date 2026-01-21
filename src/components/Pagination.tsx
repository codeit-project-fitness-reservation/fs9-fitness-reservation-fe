import React from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className={`flex items-center px-4 py-3 ${className}`}>
      <div className="flex items-start gap-0.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex size-8 items-center justify-center rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-gray-500">&lt;</span>
        </button>

        {getPageNumbers().map((page, index) => {
          if (typeof page === 'string') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex size-8 items-center justify-center rounded-lg p-2 text-sm font-medium ${
                isActive ? 'bg-blue-400 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex size-8 items-center justify-center rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-gray-500">&gt;</span>
        </button>
      </div>
    </div>
  );
}
