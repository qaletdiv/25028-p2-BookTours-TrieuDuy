"use client";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
      >
        ← Trước
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`h-10 w-10 rounded-lg text-sm font-medium ${
            page === currentPage
              ? "bg-teal-600 text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:opacity-40"
      >
        Sau →
      </button>
    </nav>
  );
}
