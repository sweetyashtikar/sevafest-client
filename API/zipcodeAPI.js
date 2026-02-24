import { apiClient } from "@/services/apiClient";

export const zipcodeService = {
  // Get all zipcodes with pagination and filters
  getZipcodes: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit, ...filters });
    return apiClient(`/zipCode`, {
      method: "GET",
    });
  },

  // Create single zipcode
  createZipcode: (zipcodeData) =>
    apiClient("/zipCode", {
      method: "POST",
      body: zipcodeData,
    }),

  // Bulk upload zipcodes
  bulkUploadZipcodes: (zipcodes) =>
    apiClient("/zipcodes/bulk", {
      method: "POST",
      body: { zipcodes },
    }),

  // Update zipcode
  updateZipcode: (id, zipcodeData) =>
    apiClient(`/zipcodes/${id}`, {
      method: "PUT",
      body: zipcodeData,
    }),

  // Delete zipcode
  deleteZipcode: (id) =>
    apiClient(`/zipcodes/${id}`, {
      method: "DELETE",
    }),

  // Check zipcode availability (for checkout)
  checkAvailability: (zipcode) =>
    apiClient(`/zipcodes/check/${zipcode}`, {
      method: "GET",
    }),

  // Get zipcodes by city
  getZipcodesByCity: (cityId) =>
    apiClient(`/zipcodes/city/${cityId}`, {
      method: "GET",
    }),

  // Toggle deliverable status
  toggleDeliverable: (id, is_deliverable) =>
    apiClient(`/zipcodes/${id}/deliverable`, {
      method: "PATCH",
      body: { is_deliverable },
    }),

  // Bulk delete zipcodes
  bulkDeleteZipcodes: (ids) =>
    apiClient("/zipcodes/bulk", {
      method: "DELETE",
      body: { ids },
    }),
};