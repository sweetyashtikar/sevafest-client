'use client';

import { CATEGORY_FILTERS, SORT_OPTIONS } from '@/components/categories/categoryTypes';

export default function CategoryFilters({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-700 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search categories..."
            />
            <div className="absolute left-3 top-2.5">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={CATEGORY_FILTERS.ALL}>All Status</option>
            <option value={CATEGORY_FILTERS.ACTIVE}>Active Only</option>
            <option value={CATEGORY_FILTERS.INACTIVE}>Inactive Only</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results Per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Results Per Page
          </label>
          <select
            value={filters.limit}
            onChange={(e) => handleChange('limit', parseInt(e.target.value))}
            className="w-full px-3 py-2 border text-black border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.search && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            Search: {filters.search}
            <button
              onClick={() => handleChange('search', '')}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}
        {filters.status !== CATEGORY_FILTERS.ALL && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            Status: {filters.status}
            <button
              onClick={() => handleChange('status', CATEGORY_FILTERS.ALL)}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}
        {filters.sort !== 'row_order_asc' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            Sorted
            <button
              onClick={() => handleChange('sort', 'row_order_asc')}
              className="ml-2 text-yellow-600 hover:text-yellow-800"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
}