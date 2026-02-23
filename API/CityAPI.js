import { apiClient } from "@/services/apiClient";

export const cityService = {
  // Get all cities with pagination
  getCities: (page = 1, limit = 10, search = '') => {
    
    const params = new URLSearchParams({ page, limit });
    if (search) params.append('search', search);
    
    return apiClient(`/cities?${params}`, {
      method: "GET",
    });
  },

  // Create single city
  createCity: (cityData) =>
    apiClient("/cities", {
      method: "POST",
      body: cityData,
    }),

  // Bulk upload cities
  bulkUploadCities: (cities) =>
    apiClient("/cities/bulk", {
      method: "POST",
      body: { cities },
    }),

  // Update city
  updateCity: (id, cityData) =>
    apiClient(`/cities/${id}`, {
      method: "PUT",
      body: cityData,
    }),

  // Delete city
  deleteCity: (id) =>
    apiClient(`/cities/${id}`, {
      method: "DELETE",
    }),

  // Bulk delete cities
  bulkDeleteCities: (ids) =>
    apiClient("/cities/bulk", {
      method: "DELETE",
      body: { ids },
    }),

  // Search cities
  searchCities: (query) =>
    apiClient(`/cities/search?q=${query}`, {
      method: "GET",
    }),
};