import { apiClient } from "@/services/apiClient";

export const areaService = {
  // Get all areas with pagination
  getAreas: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    return apiClient(`/area`, {
      method: "GET",
    });
  },

  // Create single area
  createArea: (areaData) =>
    apiClient("/areas", {
      method: "POST",
      body: areaData,
    }),

  // Bulk upload areas
  bulkUploadAreas: (areas) =>
    apiClient("/areas/bulk", {
      method: "POST",
      body: { areas },
    }),

  // Update area
  updateArea: (id, areaData) =>
    apiClient(`/areas/${id}`, {
      method: "PUT",
      body: areaData,
    }),

  // Delete area
  deleteArea: (id) =>
    apiClient(`/areas/${id}`, {
      method: "DELETE",
    }),

  // Get areas by pincode (for checkout)
  getAreaByPincode: (pincode) =>
    apiClient(`/areas/pincode/${pincode}`, {
      method: "GET",
    }),

  // Toggle area active status
  toggleAreaStatus: (id) =>
    apiClient(`/areas/${id}/toggle`, {
      method: "PATCH",
    }),

  // Additional useful methods
  getAreasByCity: (cityId) =>
    apiClient(`/areas/city/${cityId}`, {
      method: "GET",
    }),

  getAreasByZipcode: (zipcodeId) =>
    apiClient(`/areas/zipcode/${zipcodeId}`, {
      method: "GET",
    }),

  bulkDeleteAreas: (ids) =>
    apiClient("/areas/bulk", {
      method: "DELETE",
      body: { ids },
    }),

  updateDeliveryCharges: (id, charges) =>
    apiClient(`/areas/${id}/delivery-charges`, {
      method: "PATCH",
      body: { delivery_charges: charges },
    }),

  updateMinFreeAmount: (id, amount) =>
    apiClient(`/areas/${id}/min-free-amount`, {
      method: "PATCH",
      body: { minimum_free_delivery_order_amount: amount },
    }),
};