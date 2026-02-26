// services/stockService.js
import { apiClient } from "@/services/apiClient";

export const stockService = {
  // ==========================================
  // STOCK SALES VIEW (Table view like in the image)
  // ==========================================
  
  /**
   * Get stock and sales view with all products in table format
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page (default: 50)
   * @param {string} params.category - Filter by category ID
   * @param {string} params.seller - Filter by seller ID
   * @param {string} params.search - Search term
   * @param {string} params.status - Filter by status (Published/Unpublished)
   * @param {string} params.sortBy - Sort field
   * @param {number} params.sortOrder - Sort order (1 for asc, -1 for desc)
   */
  getStockSalesView: (params = {}) =>
    apiClient("/stock/view", {
      method: "GET",
      params: {
        page: 1,
        limit: 50,
        ...params
      },
    }),

  /**
   * Get detailed view for a specific product
   * @param {string} productId - Product ID
   */
  getProductDetailView: (productId) =>
    apiClient(`/stock/product/${productId}`, {
      method: "GET",
    }),

  /**
   * Export stock and sales data
   * @param {Object} params - Filter parameters
   * @param {string} params.format - Export format (csv/excel)
   */
  exportStockSalesData: (params = {}) =>
    apiClient("/stock-sales/export", {
      method: "GET",
      params,
      responseType: params.format === 'csv' ? 'blob' : 'json',
    }),

  /**
   * Get summary cards data for dashboard
   */
  getSummaryCards: () =>
    apiClient("/stock-sales/summary", {
      method: "GET",
    }),

  // ==========================================
  // PRODUCT STOCK MANAGEMENT
  // ==========================================

  /**
   * Get stock information for a specific product
   * @param {string} productId - Product ID
   */
  getProductStock: (productId) =>
    apiClient(`/products/${productId}/stock`, {
      method: "GET",
    }),

  /**
   * Get stock history for a product
   * @param {string} productId - Product ID
   * @param {Object} params - Query parameters
   */
  getStockHistory: (productId, params = {}) =>
    apiClient(`/products/${productId}/stock/history`, {
      method: "GET",
      params: {
        page: 1,
        limit: 20,
        ...params
      },
    }),

  /**
   * Set stock alerts configuration
   * @param {string} productId - Product ID
   * @param {Object} data - Alert configuration
   */
  setStockAlerts: (productId, data) =>
    apiClient(`/products/${productId}/stock/alerts`, {
      method: "POST",
      body: data,
    }),

  // ==========================================
  // SIMPLE PRODUCT STOCK OPERATIONS
  // ==========================================

  /**
   * Update stock for simple/digital product
   * @param {string} productId - Product ID
   * @param {Object} data - Stock update data
   */
  updateSimpleProductStock: (productId, data) =>
    apiClient(`/products/${productId}/stock/simple`, {
      method: "PUT",
      body: data,
    }),

  // ==========================================
  // VARIANT STOCK OPERATIONS
  // ==========================================

  /**
   * Update stock for a specific variant
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID
   * @param {Object} data - Stock update data
   */
  updateVariantStock: (productId, variantId, data) =>
    apiClient(`/products/${productId}/variants/${variantId}/stock`, {
      method: "PUT",
      body: data,
    }),

  /**
   * Bulk update stock for multiple variants
   * @param {string} productId - Product ID
   * @param {Array} updates - Array of variant stock updates
   */
  bulkUpdateVariantStock: (productId, updates) =>
    apiClient(`/products/${productId}/variants/bulk-stock`, {
      method: "POST",
      body: { updates },
    }),

  // ==========================================
  // HELPER METHODS FOR COMMON OPERATIONS
  // ==========================================

  /**
   * Quick stock adjustment (increase by quantity)
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID (null for simple products)
   * @param {number} quantity - Quantity to add
   * @param {string} reason - Reason for adjustment
   */
  addStock: (productId, variantId, quantity, reason = "restock") => {
    if (variantId) {
      return stockService.updateVariantStock(productId, variantId, {
        adjustmentType: "increase",
        quantity,
        reason,
      });
    } else {
      return stockService.updateSimpleProductStock(productId, {
        adjustmentType: "increase",
        quantity,
        reason,
      });
    }
  },

  /**
   * Quick stock adjustment (decrease by quantity)
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID (null for simple products)
   * @param {number} quantity - Quantity to remove
   * @param {string} reason - Reason for adjustment
   */
  removeStock: (productId, variantId, quantity, reason = "sale") => {
    if (variantId) {
      return stockService.updateVariantStock(productId, variantId, {
        adjustmentType: "decrease",
        quantity,
        reason,
      });
    } else {
      return stockService.updateSimpleProductStock(productId, {
        adjustmentType: "decrease",
        quantity,
        reason,
      });
    }
  },

  /**
   * Set exact stock level
   * @param {string} productId - Product ID
   * @param {string} variantId - Variant ID (null for simple products)
   * @param {number} quantity - Exact quantity to set
   * @param {string} reason - Reason for adjustment
   */
  setExactStock: (productId, variantId, quantity, reason = "manual_count") => {
    if (variantId) {
      return stockService.updateVariantStock(productId, variantId, {
        adjustmentType: "set",
        quantity,
        reason,
      });
    } else {
      return stockService.updateSimpleProductStock(productId, {
        adjustmentType: "set",
        quantity,
        reason,
      });
    }
  },

  // ==========================================
  // ADMIN/REPORTING METHODS
  // ==========================================

  /**
   * Check all products for low stock (admin only)
   * @param {number} threshold - Low stock threshold
   */
  checkLowStock: (threshold = 10) =>
    apiClient("/stock/low-stock-check", {
      method: "GET",
      params: { threshold },
    }),

  /**
   * Get stock dashboard with overall statistics
   */
  getStockDashboard: () =>
    apiClient("/stock/dashboard", {
      method: "GET",
    }),
};

// ==========================================
// REACT HOOKS FOR EASY INTEGRATION
// ==========================================

/**
 * Custom hook for stock sales view with built-in state management
 */
export const useStockSalesView = (initialParams = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 50,
    ...initialParams
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await stockService.getStockSalesView(params);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 })); // Reset to page 1 on filter change
  };

  const goToPage = (page) => {
    setParams(prev => ({ ...prev, page }));
  };

  return {
    data,
    loading,
    error,
    params,
    updateParams,
    goToPage,
    refresh: fetchData
  };
};

/**
 * Custom hook for product stock management
 */
export const useProductStock = (productId) => {
  const [stock, setStock] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStock = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await stockService.getProductStock(productId);
      setStock(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (params = {}) => {
    if (!productId) return;
    setLoading(true);
    try {
      const response = await stockService.getStockHistory(productId, params);
      setHistory(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (variantId, adjustmentType, quantity, reason) => {
    setLoading(true);
    try {
      let response;
      if (variantId) {
        response = await stockService.updateVariantStock(productId, variantId, {
          adjustmentType,
          quantity,
          reason,
        });
      } else {
        response = await stockService.updateSimpleProductStock(productId, {
          adjustmentType,
          quantity,
          reason,
        });
      }
      await fetchStock(); // Refresh stock data
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [productId]);

  return {
    stock,
    history,
    loading,
    error,
    fetchStock,
    fetchHistory,
    updateStock,
    addStock: (quantity, reason) => updateStock(null, 'increase', quantity, reason),
    removeStock: (quantity, reason) => updateStock(null, 'decrease', quantity, reason),
    setStock: (quantity, reason) => updateStock(null, 'set', quantity, reason),
  };
};