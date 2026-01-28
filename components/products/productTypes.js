// Product Types
export const PRODUCT_TYPES = {
  SIMPLE: "simple_product",
  VARIABLE: "variable_product",
  DIGITAL: "digital_product",

};

export const INDICATOR_TYPES = {
  NONE: 'none',
  VEG: 'veg',
  NON_VEG: 'non_veg'
};

export const DELIVERABLE_TYPES = {
  NONE: 'none',
  ALL: 'all',
  INCLUDE: 'include',
  EXCLUDE: 'exclude'
};

export const STOCK_STATUS = {
IN_STOCK: "in-stock",
  OUT_OF_STOCK: "out-of-stock",
  NULL : null
};

export const CANCELABLE_STAGES = {
  NOT_RETURNABLE: 'not_returnable',
  RECEIVED: 'received',
  PROCESSED: 'processed',
  SHIPPED: 'shipped'
};

export const VIDEO_TYPES = {
  YOUTUBE: 'youtube',
  VIMEO: 'vimeo',
  SELF_HOSTED: 'self_hosted'
};

export const DOWNLOAD_LINK_TYPES = {
  SELF_HOSTED: 'self_hosted',
  ADD_LINK: 'add_link'
};

export const VARIANT_STOCK_LEVEL_TYPES = {
  VARIABLE_LEVEL: 'variable_level',
  PRODUCT_LEVEL: 'product_level'
};