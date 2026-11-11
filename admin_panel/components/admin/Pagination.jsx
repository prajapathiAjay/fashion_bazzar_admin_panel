import { useMemo } from "react";

const DOTS = "...";

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

function usePaginationRange({ currentPage, totalPages, siblingCount }) {
  return useMemo(() => {
    // first + last + current + 2 siblings + 2 dots
    const totalNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalNumbers) return range(1, totalPages);

    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      const leftCount = 3 + siblingCount * 2;
      return [...range(1, leftCount), DOTS, totalPages];
    }

    if (showLeftDots && !showRightDots) {
      const rightCount = 3 + siblingCount * 2;
      return [1, DOTS, ...range(totalPages - rightCount + 1, totalPages)];
    }

    return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, totalPages];
  }, [currentPage, totalPages, siblingCount]);
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) {
  const pages = usePaginationRange({ currentPage, totalPages, siblingCount });

  if (totalPages <= 1) return null;

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const baseBtn =
    "min-w-10 h-10 px-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="Previous page"
        className={`${baseBtn} text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
      >
        ← Prev
      </button>

      {pages.map((page, i) =>
        page === DOTS ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`${baseBtn} ${
              page === currentPage
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="Next page"
        className={`${baseBtn} text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
      >
        Next →
      </button>
    </nav>
  );
}

/* ---------- Usage ----------

import { useState } from "react";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 8;

export default function ProductList({ products }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const visible = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visible.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
*/
