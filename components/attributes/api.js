import { apiClient } from "@/services/apiClient";

/* =========================
   ATTRIBUTE SET APIs
========================= */
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
};
