import { apiClient } from "@/services/apiClient";

export const cityService = {
  // GET /cities?page=1&limit=10&search=...
  getCities: (page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    return apiClient(`/cities?${params}`, {
      method: "GET",
    });
  },

  // GET /cities/:id
  getCityById: (id) =>
    apiClient(`/cities/${id}`, {
      method: "GET",
    }),

  // POST /cities  →  body: { name }
  createCity: (cityData) =>
    apiClient("/cities", {
      method: "POST",
      body: cityData,
    }),

  // PUT /cities/:id  →  body: { name }
  updateCity: (id, cityData) =>
    apiClient(`/cities/${id}`, {
      method: "PUT",
      body: cityData,
    }),

  // DELETE /cities/:id
  deleteCity: (id) =>
    apiClient(`/cities/${id}`, {
      method: "DELETE",
    }),

  // POST /cities/bulk-city  →  body: { cities: [{ name }, ...] }
  bulkUploadCities: (cities) =>
    apiClient("/cities/bulk-city", {
      method: "POST",
      body: { cities },
    }),

  // ⚠️ Backend मध्ये bulk delete route नाही — तूर्त individual delete वापरावा
  bulkDeleteCities: async (ids) => {
    const results = await Promise.allSettled(
      ids.map((id) => apiClient(`/cities/${id}`, { method: "DELETE" }))
    );
    return results;
  },
};