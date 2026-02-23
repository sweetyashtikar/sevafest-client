// services/couponService.js
import { apiClient } from '@/services/apiClient';

export const couponService = {
  // Get all coupons with filters (admin)
  getCoupons: (params = {}) =>
    apiClient("/coupons", {
      method: "GET",
      params: params, // Supports: page, limit, status, couponType, discountType, userType, search, sort_by, sort_order
    }),

  // Get single coupon by ID
  getCoupon: (id) =>
    apiClient(`/coupons/${id}`, {
      method: "GET",
    }),

  // Get active coupons for user
  getActiveCoupons: (params = {}) =>
    apiClient("/coupons/active", {
      method: "GET",
      params: params, // Supports: userId, orderAmount
    }),

  // Validate coupon during checkout
  validateCoupon: (data) =>
    apiClient("/coupons/validate", {
      method: "POST",
      body: data,
    }),

  // Get coupon statistics (admin)
  getCouponStats: () =>
    apiClient("/coupons/stats", {
      method: "GET",
    }),

  // Create new coupon (admin)
  createCoupon: (data) =>
    apiClient("/coupons", {
      method: "POST",
      body: data,
    }),

  // Update coupon (admin)
  updateCoupon: (id, data) =>
    apiClient(`/coupons/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Toggle coupon status (admin)
  toggleStatus: (id, status) =>
    apiClient(`/coupons/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  // Delete coupon (admin)
  deleteCoupon: (id) =>
    apiClient(`/coupons/${id}`, {
      method: "DELETE",
    }),

  // Bulk delete coupons (admin)
  bulkDeleteCoupons: (couponIds) =>
    apiClient("/coupons/bulk/bulk-delete", {
      method: "POST",
      body: { couponIds },
    }),

  // Bulk update coupon status (admin)
  bulkUpdateStatus: (couponIds, status) =>
    apiClient("/coupons/bulk/bulk-status", {
      method: "PATCH",
      body: { couponIds, status },
    }),

    
};

// frontend service
export const checkoutService = {
    validateCoupon: (couponCode, cartTotal) =>
        apiClient('/coupons/validate-cart', {
            method: 'POST',
            body: { couponCode, cartTotal }
        }),

    createOrder: (orderData) =>
        apiClient('/order-items', {
            method: 'POST',
            body: orderData
        })
};