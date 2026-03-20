import { Eye, Trash } from "lucide-react";
import React from "react";

const DataTable = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onRowSelect,
  selectedRows = [],
  onBulkDelete,
  onView,
  onDelete,
}) => {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onRowSelect(data.map((row) => row._id));
    } else {
      onRowSelect([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      onRowSelect(selectedRows.filter((rowId) => rowId !== id));
    } else {
      onRowSelect([...selectedRows, id]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1125px] mx-auto bg-white border border-gray-200 shadow-md rounded-lg">
      {selectedRows.length > 0 && onBulkDelete && (
        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
          <span className="text-sm text-gray-700">
            {selectedRows.length} item(s) selected
          </span>
          <button
            onClick={onBulkDelete}
            className="text-sm text-red-600 hover:text-red-900 font-medium"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="w-full border-b border-gray-200">
        <div className="w-full overflow-x-auto">

          <table className="min-w-max w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {onRowSelect && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}

                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}

                {/* Actions Header */}
                {(onView || onDelete) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50">
                  {/* Checkbox */}
                  {onRowSelect && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row._id)}
                        onChange={() => handleSelectRow(row._id)}
                        className="rounded border-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}

                  {/* Data Columns */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}

                  {/* Actions Column */}
                  {(onView || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-3">
                        {onView && (
                          <button
                            onClick={() => onView(row)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        )}

                        {onDelete && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete?",
                                )
                              ) {
                                onDelete(row._id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          {/* Mobile */}
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>

          {/* Desktop */}
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page{" "}
                <span className="font-medium">{pagination.currentPage}</span> of{" "}
                <span className="font-medium">{pagination.totalPages}</span>
              </p>
            </div>

            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {/* Prev */}
                <button
                  onClick={() => onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-700 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ‹
                </button>

                {/* Page Numbers */}
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum;

                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (
                    pagination.currentPage >=
                    pagination.totalPages - 2
                  ) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pagination.currentPage === pageNum
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-700 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() => onPageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-700 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;