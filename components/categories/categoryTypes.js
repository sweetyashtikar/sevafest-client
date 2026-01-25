// Category Types
export const CATEGORY_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
  DELETED: 'deleted'
};

export const CATEGORY_FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'row_order_asc', label: 'Order (Low to High)' },
  { value: 'row_order_desc', label: 'Order (High to Low)' },
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'createdAt_asc', label: 'Oldest First' },
  { value: 'clicks_desc', label: 'Most Popular' }
];

