import React from "react";

const MiniPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 mt-6 text-sm">
      {/* Previous Button */}
      <button
        className={`px-3 py-1 rounded-md transition ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ◀
      </button>

      {/* Page Numbers */}
      <span className="font-medium">
        {currentPage} / {totalPages}
      </span>

      {/* Next Button */}
      <button
        className={`px-3 py-1 rounded-md transition ${
          currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
        }`}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        ▶
      </button>
    </div>
  );
};

export default MiniPagination;