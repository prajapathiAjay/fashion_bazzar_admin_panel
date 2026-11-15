"use client";
import React, { useState } from "react";
import {useRouter} from "next/navigation"
import Pagination from "./Pagination";
/**
 * Generic Table component
 *
 * @param {Array<{ col_label: string, value: string }>} columns
 *   Each column needs:
 *     - col_label: text shown in the header cell
 *     - value: key used to pull the cell value out of each row object
 * @param {Array<Object>} data - array of row objects
 * @param {string} [tableHeading] - optional title shown above the table
 * @param {{ name: string, onClick?: () => void }} [addButton]
 *   Optional call-to-action button rendered top-right, e.g. "+ Add item"
 * @param {number} [rowsPerPage=10] - how many rows the first page shows (5, 10, 25 or 50)
 */
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

const Table = ({ columns, data, tableHeading, addButton, rowsPerPage = 10 }) => {
//  const navigate=useNavigate()
const router=useRouter()

  // Pagination: the whole list is already loaded, so one page of it is cut out here
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPage);

  const total = data?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // if rows were deleted and this page no longer exists, fall back to the last page
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleRows = data?.slice(start, start + pageSize) ?? [];

  return (<>
  {(tableHeading || addButton) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
          {tableHeading && (
            <h3 className="text-base font-semibold text-ink">
              {tableHeading}
            </h3>
          )}

          {addButton && (
            <button
              type="button"
              onClick={()=>router.push(addButton.path)}
              className="inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 transition-colors"
            >
              {addButton.name}
            </button>
          )}
        </div>
      )}
    {/* The card is exactly as tall as the rest of the screen (minus navbar, page padding
        and heading), so the footer always sits at the bottom of the viewport */}
    <div className="flex h-[calc(100vh-12rem)] min-h-80 w-full flex-col overflow-hidden rounded-lg border border-line shadow-sm bg-white">

      {/* flex-1 + min-h-0 + overflow-auto: the rows get the free space and scroll
          inside it when there are too many, instead of pushing the footer down */}
      <div className="min-h-0 w-full flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-line text-sm">
          {/* sticky: the column headings stay visible while the rows scroll */}
          <thead className="sticky top-0 z-10 bg-snow shadow-[0_1px_0_0_#ECE5DD]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.value}
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-ink-soft whitespace-nowrap"
                >
                  {col.col_label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-line bg-white">
            {total === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-subtle"
                >
                  No data available
                </td>
              </tr>
            ) : (
              visibleRows.map((row, rowIndex) => (
                <tr
                  key={row._id ?? row.id ?? start + rowIndex}
                  className="hover:bg-snow transition-colors"
                >
                  {columns?.map((col) => (
                    <td
                      key={col.value}
                      className="px-4 py-3 text-ink whitespace-nowrap"
                    >
                      {row[col.value]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: range, rows per page, page numbers */}
      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
          <p>
            Showing{" "}
            <span className="font-medium text-ink">
              {start + 1}–{Math.min(start + pageSize, total)}
            </span>{" "}
            of <span className="font-medium text-ink">{total}</span>
          </p>

          <label className="flex items-center gap-2">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1); // a new page size starts again from the first page
              }}
              className="rounded-md border border-line-strong bg-white px-2 py-1 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand"
            >
              {ROWS_PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          {/* hides itself when there is only one page */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
    
</>
  );
};

export default Table;
