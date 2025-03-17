import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; // Hide pagination if only one page exists

  const maxPageButtons = 5;
  // Create an array with all page numbers.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Define a fixed width for each button (adjust as needed to match your design)
  const buttonWidth = 60; // in pixels
  
  // Calculate offset so that the current page is centered when possible.
  let offset = 0;
  if (currentPage <= Math.floor(maxPageButtons / 2) + 1) {
    offset = 0;
  } else if (currentPage >= totalPages - Math.floor(maxPageButtons / 2)) {
    offset = totalPages - maxPageButtons;
  } else {
    offset = currentPage - Math.floor(maxPageButtons / 2) - 1;
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-6 text-lg">
      {/* Previous Button */}
      <button
        className={`px-4 py-2 rounded-md transition ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀ Prev
      </button>

      {/* Fixed Container for Page Number Buttons */}
      <div className="overflow-hidden" style={{ width: `${buttonWidth * maxPageButtons}px` }}>
        <div 
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${offset * buttonWidth}px)` }}
        >
          {pages.map((page) => (
            <button
              key={page}
              style={{ width: `${buttonWidth}px` }}
              className={`flex-shrink-0 px-4 py-2 rounded-md transition ${
                currentPage === page ? "bg-blue-500 text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <button
        className={`px-4 py-2 rounded-md transition ${
          currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next ▶
      </button>
    </div>
  );
};

export default Pagination;