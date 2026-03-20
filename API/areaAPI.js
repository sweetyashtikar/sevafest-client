import { apiClient } from "@/services/apiClient";

export const areaService = {
  // GET /areas?page=1&limit=10&city_id=...&status=true&search=...
  getAreas: (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page, limit });
    if (filters.city_id) params.append("city_id", filters.city_id);
    // ⚠️ Backend uses "status" not "active"
    if (filters.active !== "" && filters.active !== undefined)
      params.append("status", filters.active);
    if (filters.search) params.append("search", filters.search);
    if (filters.pincode) params.append("search", filters.pincode); // search by name/pincode

    return apiClient(`/areas?${params}`, {
      method: "GET",
    });
  },

  // GET /areas/:id
  getAreaById: (id) =>
    apiClient(`/areas/${id}`, {
      method: "GET",
    }),

  // GET /areas/city/:city_id
  getAreasByCity: (cityId) =>
    apiClient(`/areas/city/${cityId}`, {
      method: "GET",
    }),

  // POST /areas  →  body: { city_id, zipcode_id, name, minimum_free_delivery_order_amount, delivery_charges, ... }
  createArea: (areaData) =>
    apiClient("/areas", {
      method: "POST",
      body: areaData,
    }),

  // PUT /areas/:id
  updateArea: (id, areaData) =>
    apiClient(`/areas/${id}`, {
      method: "PUT",
      body: areaData,
    }),

  // PATCH /areas/:id/toggle-status
  toggleAreaStatus: (id) =>
    apiClient(`/areas/${id}/toggle-status`, {
      method: "PATCH",
    }),

  // DELETE /areas/:id
  deleteArea: (id) =>
    apiClient(`/areas/${id}`, {
      method: "DELETE",
    }),

  // POST /areas/calculate-delivery  →  body: { area_id, order_amount }
  calculateDeliveryCharges: (area_id, order_amount) =>
    apiClient("/areas/calculate-delivery", {
      method: "POST",
      body: { area_id, order_amount },
    }),

  // ⚠️ Backend मध्ये bulk upload route नाही — individual create वापरतो
  bulkUploadAreas: async (areas) => {
    const results = await Promise.allSettled(
      areas.map((area) =>
        apiClient("/areas", { method: "POST", body: area })
      )
    );
    return results;
  },
};