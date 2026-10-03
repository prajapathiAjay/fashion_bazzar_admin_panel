"use client";
import React from "react";
import {useRouter} from "next/navigation"
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
 */
const Table = ({ columns, data, tableHeading, addButton }) => {
//  const navigate=useNavigate()
const router=useRouter()
  return (<>
  {(tableHeading || addButton) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          {tableHeading && (
            <h3 className="text-base font-semibold text-gray-800">
              {tableHeading}
            </h3>
          )}

          {addButton && (
            <button
              type="button"
              onClick={()=>router.push(addButton.path)}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors"
            >
              {addButton.name}
            </button>
          )}
        </div>
      )}
    <div className="w-full rounded-lg border border-gray-200 shadow-sm bg-white">
      

      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.value}
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                >
                  {col.col_label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {data?.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data?.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns?.map((col) => (
                    <td
                      key={col.value}
                      className="px-4 py-3 text-gray-800 whitespace-nowrap"
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
    </div>
    
</>
  );
};

export default Table;
