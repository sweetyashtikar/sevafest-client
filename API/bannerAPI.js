// services/bannerService.js
import { apiClient } from "@/services/apiClient";

export const bannerService = {
  // Get all banners with optional filters
  getBanners: (params = {}) =>
    apiClient("/banners", {
      method: "GET",
      params: params, // Supports bannerType, status, page, limit, sortBy, sortOrder
    }),

  // Get banners by type (deal of the day, home, header, etc.)
  getBannersByType: (bannerType) =>
    apiClient(`/banners/type/${bannerType}`, {
      method: "GET",
    }),

  // Get banners for a specific category
  getBannersByCategory: (categoryId) =>
    apiClient(`/banners/category/${categoryId}`, {
      method: "GET",
    }),

  // Get a single banner by ID
  getBanner: (id) =>
    apiClient(`/banners/${id}`, {
      method: "GET",
    }),

  // Get banner statistics (admin only)
  getBannerStats: () =>
    apiClient("/banners/stats", {
      method: "GET",
    }),

  // Create a new banner (admin only)
  createBanner: (data) =>
    apiClient("/banners", {
      method: "POST",
      body: data,
    }),

  // Update a banner (admin only)
  updateBanner: (id, data) =>
    apiClient(`/banners/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Update banner status (active/inactive) (admin only)
  updateStatus: (id, status) =>
    apiClient(`/banners/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  // Bulk update banners status (admin only)
  bulkUpdateStatus: (bannerIds, status) =>
    apiClient("/banners/bulk-status", {
      method: "PATCH",
      body: { bannerIds, status },
    }),

  // Delete a banner (admin only)
  deleteBanner: (id) =>
    apiClient(`/banners/${id}`, {
      method: "DELETE",
    }),

  // Bulk delete banners (admin only)
  bulkDeleteBanners: (bannerIds) =>
    apiClient("/banners/bulk", {
      method: "DELETE",
      body: { bannerIds },
    }),
};