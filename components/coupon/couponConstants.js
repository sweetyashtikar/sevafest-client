// constants/couponConstants.js
export const COUPON_TYPES = {
  SINGLE_TIME: 'single time valid',
  MULTIPLE_TIME: 'multiple time valid'
};

export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

export const USER_TYPES = {
  ALL: 'all',
  NEW: 'new',
  EXISTING: 'existing'
};

// For dropdown options
export const COUPON_TYPE_OPTIONS = [
  { value: COUPON_TYPES.SINGLE_TIME, label: 'Single Time Valid' },
  { value: COUPON_TYPES.MULTIPLE_TIME, label: 'Multiple Time Valid' }
];

export const DISCOUNT_TYPE_OPTIONS = [
  { value: DISCOUNT_TYPES.PERCENTAGE, label: 'Percentage (%)' },
  { value: DISCOUNT_TYPES.FIXED, label: 'Fixed Amount (₹)' }
];

export const USER_TYPE_OPTIONS = [
  { value: USER_TYPES.ALL, label: 'All Users' },
  { value: USER_TYPES.NEW, label: 'New Users Only' },
  { value: USER_TYPES.EXISTING, label: 'Existing Users Only' }
];

// Color mapping for UI
export const COUPON_TYPE_COLORS = {
  [COUPON_TYPES.SINGLE_TIME]: 'bg-purple-100 text-purple-700 border-purple-200',
  [COUPON_TYPES.MULTIPLE_TIME]: 'bg-blue-100 text-blue-700 border-blue-200'
};

export const DISCOUNT_TYPE_COLORS = {
  [DISCOUNT_TYPES.PERCENTAGE]: 'bg-green-100 text-green-700 border-green-200',
  [DISCOUNT_TYPES.FIXED]: 'bg-orange-100 text-orange-700 border-orange-200'
};

export const USER_TYPE_COLORS = {
  [USER_TYPES.ALL]: 'bg-gray-100 text-gray-700 border-gray-200',
  [USER_TYPES.NEW]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  [USER_TYPES.EXISTING]: 'bg-amber-100 text-amber-700 border-amber-200'
};