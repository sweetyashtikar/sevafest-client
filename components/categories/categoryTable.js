'use client';

import { CATEGORY_FILTERS, SORT_OPTIONS ,CATEGORY_STATUS} from '@/components/categories/categoryTypes';

export default function CategoryTable({
  categories,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleStatus,
  onView
}) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [CATEGORY_STATUS.ACTIVE]: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Active'
      },
      [CATEGORY_STATUS.INACTIVE]: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Inactive'
      },
      [CATEGORY_STATUS.DELETED]: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Deleted'
      }
    };

    const config = statusConfig[status] || statusConfig[CATEGORY_STATUS.INACTIVE];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-black text-center">
            Category Table List
          </h2>
        </div>
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedCategories.length === categories.length && categories.length > 0}
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded"
              />
            </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Category
            </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Sub-Categories
            </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Status
            </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Order
            </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Clicks
            </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Created
            </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-gray-50">
              {/* Checkbox */}
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category._id)}
                  onChange={() => onSelectCategory(category._id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-700 rounded"
                />
              </td>

              {/* Category Info */}
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {category.image && (
                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                      <img
                        className="h-10 w-10 rounded object-cover"
                        src={category.image}
                        alt={category.name}
                      />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      /{category.slug}
                    </div>
                  </div>
                </div>
              </td>

              {/* Sub-Categories */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className=" text-center text-sm text-gray-900">
                  {category.sub_category}
                </div>
              </td>

              {/* Status with Toggle */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {/* {getStatusBadge(category.status)} */}
                  <button
                    onClick={() => onToggleStatus(category._id, category.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                      category.status === CATEGORY_STATUS.ACTIVE ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                    title={`Toggle to ${category.status === CATEGORY_STATUS.ACTIVE ? false : true}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        category.status === CATEGORY_STATUS.ACTIVE ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </td>

              {/* Row Order */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 text-center">
                  {category.row_order || 0}
                </div>
              </td>

              {/* Clicks */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 text-center">
                  {category.clicks || 0}
                </div>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(category.createdAt)}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(category._id)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(category)}
                    className="text-green-600 hover:text-green-900"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(category._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {categories.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new category.
          </p>
        </div>
      )}
      </div>
    </div>
    </div>
  );
}