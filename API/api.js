import { apiClient } from "@/services/apiClient";

const API_BASE_URL = "http://localhost:8000/api";

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("token", localStorage.getItem("token"));

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Attribute Set APIs
export const attributeSetApi = {
  getAll: (params = {}) =>
    apiClient("/attributeSet", {
      method: "GET",
      // headers: {
      //   "pagination-query": JSON.stringify(params),
      // },
    }),

  getById: (id) =>
    apiClient(`/attributeSet/${id}`, {
      method: "GET",
    }),

  create: (data) =>
    apiClient("/attributeSet", {
      method: "POST",
      body: data,
    }),

  update: (id, data) =>
    apiClient(`/attributeSet/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id) =>
    apiClient(`/attributeSet/${id}`, {
      method: "DELETE",
    }),
};

/* =========================
   ATTRIBUTE APIs
========================= */
export const attributeApi = {
  getAll: (params = {}) =>
    apiClient("/attribute", {
      method: "GET",
      // headers: {
      //   "pagination-query": JSON.stringify(params),
      // },
    }),

  getById: (id) =>
    apiClient(`/attribute/${id}`, {
      method: "GET",
    }),

  create: (data) =>
    apiClient("/attribute", {
      method: "POST",
      body: data,
    }),

  update: (id, data) =>
    apiClient(`/attribute/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id) =>
    apiClient(`/attribute/${id}`, {
      method: "DELETE",
    }),
};

/* =========================
   ATTRIBUTE VALUE APIs
========================= */
export const attributeValueApi = {
  getAll: (params = {}) =>
    apiClient("/attributeValue", {
      method: "GET",
      // headers: {
      //   "pagination-query": JSON.stringify(params),
      // },
    }),

  getById: (id) =>
    apiClient(`/attributeValue/${id}`, {
      method: "GET",
    }),

  create: (data) =>
    apiClient("/attributeValue", {
      method: "POST",
      body: data,
    }),

  update: (id, data) =>
    apiClient(`/attributeValue/${id}`, {
      method: "PUT",
      body: data,
    }),

  delete: (id) =>
    apiClient(`/attributeValue/${id}`, {
      method: "DELETE",
    }),

    getStatusTrue: (id) =>
    apiClient(`/attributeValue/status-true`, {
      method: "GET",
    }),
};

export const categoryApi = {
  getAll: (params = {}) => apiClient("/category", { method: "GET", params }),
  getById: (id) => apiClient(`/category/${id}`, { method: "GET" }),
  create: (data) => apiClient("/category", { method: "POST", body: data }),
  update: (id, data) =>
    apiClient(`/category/${id}`, { method: "PUT", body: data }),
  delete: (id) => apiClient(`/category/${id}`, { method: "DELETE" }),
  getStatusTrue: () => apiClient("/category/status-true", { method: "GET" }),

  // Category-specific methods
  getTree: () => apiClient("/category/tree", { method: "GET" }),
  getWithProducts: () =>
    apiClient("/category/with-products", { method: "GET" }),
  getBySlug: (slug) => apiClient(`/category/slug/${slug}`, { method: "GET" }),
};

export const taxApi = {
  getAll: (params = {}) => apiClient("/tax", { method: "GET", params }),
  getById: (id) => apiClient(`/tax/${id}`, { method: "GET" }),
  create: (data) => apiClient("/tax", { method: "POST", body: data }),
  update: (id, data) => apiClient(`/tax/${id}`, { method: "PUT", body: data }),
  delete: (id) => apiClient(`/tax/${id}`, { method: "DELETE" }),
  getStatusTrue: () => apiClient("/tax/status-true", { method: "GET" }),
};
export const ProductApi = {
  getAll: (params = {}) => apiClient("/product", { method: "GET", params }),
  getById: (id) => apiClient(`/product/${id}`, { method: "GET" }),

  // Update create method to handle FormData
  create: (formData) => {
    // If it's already a FormData object, use it directly
    if (formData instanceof FormData) {
      return apiClient("/product", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary
      });
    }

    // Otherwise, convert object to FormData
    const data = new FormData();

    // Helper function to append data to FormData
    const appendToFormData = (key, value) => {
      if (value === null || value === undefined) return;

      if (value instanceof File) {
        data.append(key, value);
      } else if (Array.isArray(value)) {
        // Handle arrays
        value.forEach((item, index) => {
          if (item instanceof File) {
            data.append(`${key}[${index}]`, item);
          } else if (typeof item === "object" && item !== null) {
            // Handle array of objects
            Object.entries(item).forEach(([subKey, subValue]) => {
              if (subValue instanceof File) {
                data.append(`${key}[${index}][${subKey}]`, subValue);
              } else {
                data.append(`${key}[${index}][${subKey}]`, String(subValue));
              }
            });
          } else {
            data.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof File)
      ) {
        // Handle nested objects
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue instanceof File) {
            data.append(`${key}[${subKey}]`, subValue);
          } else if (typeof subValue === "object" && subValue !== null) {
            // Handle deeply nested objects
            data.append(`${key}[${subKey}]`, JSON.stringify(subValue));
          } else {
            data.append(`${key}[${subKey}]`, String(subValue));
          }
        });
      } else {
        // Handle primitive values
        data.append(key, String(value));
      }
    };

    // Append all data from the object
    Object.entries(formData).forEach(([key, value]) => {
      appendToFormData(key, value);
    });

    return apiClient("/product", {
      method: "POST",
      body: data,
    });
  },

  update: (id, formData) => {
    // If it's already a FormData object, use it directly
    if (formData instanceof FormData) {
      return apiClient(`/product/${id}`, {
        method: "PATCH",
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary
      });
    }

    // Otherwise, convert object to FormData (same logic as create)
    const data = new FormData();

    // Helper function to append data to FormData (same as in create)
    const appendToFormData = (key, value) => {
      if (value === null || value === undefined) return;

      if (value instanceof File) {
        data.append(key, value);
      } else if (Array.isArray(value)) {
        // Handle arrays
        value.forEach((item, index) => {
          if (item instanceof File) {
            data.append(`${key}[${index}]`, item);
          } else if (typeof item === "object" && item !== null) {
            // Handle array of objects
            Object.entries(item).forEach(([subKey, subValue]) => {
              if (subValue instanceof File) {
                data.append(`${key}[${index}][${subKey}]`, subValue);
              } else {
                data.append(`${key}[${index}][${subKey}]`, String(subValue));
              }
            });
          } else {
            data.append(`${key}[${index}]`, String(item));
          }
        });
      } else if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof File)
      ) {
        // Handle nested objects
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue instanceof File) {
            data.append(`${key}[${subKey}]`, subValue);
          } else if (typeof subValue === "object" && subValue !== null) {
            // Handle deeply nested objects
            data.append(`${key}[${subKey}]`, JSON.stringify(subValue));
          } else {
            data.append(`${key}[${subKey}]`, String(subValue));
          }
        });
      } else {
        // Handle primitive values
        data.append(key, String(value));
      }
    };

    // Append all data from the object
    Object.entries(formData).forEach(([key, value]) => {
      appendToFormData(key, value);
    });

    return apiClient(`/product/${id}`, {
      method: "patch", // Use PATCH method
      body: data,
    });
  },
  getProductsByRole: (role) => {
    if (role === "admin") {
      return apiClient("/product/getAllProducts", { method: "GET" });
    } else {
      return apiClient("/product/vendor/my-products", { method: "GET" });
    }
  },

  delete: (id) => apiClient(`/product/${id}`, { method: "DELETE" }),
  getStatusTrue: () => apiClient("/product/status-true", { method: "GET" }),

  getVendorProducts :(params = {}) => apiClient('/product/vendor/my-products',{ method: "GET", params })
};
