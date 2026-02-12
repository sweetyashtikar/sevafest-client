// // services/deliveryBoyService.js
import { apiClient } from "@/services/apiClient";
import { METHODS } from "node:http";

// export const deliveryBoyService = {
//   // Get all delivery boys for a vendor
//  getVendorDeliveryBoys: async (vendorId, params = {}) => {
//     try {
//       const response = await apiClient(`/delivery_boy/vendor/${vendorId}`, {
//         method: "GET",
//         params: params
//       });
//       console.log("response delivery boys", response)
//       return response.data; // ✅ Return the data
//     } catch (error) {
//       console.error('Error in getVendorDeliveryBoys:', error);
//       throw error;
//     }
//   },

//   // Get single delivery boy
//   getDeliveryBoy: async (id) => {
//     const response = await apiClient(`/delivery-boys/${id}`);
//     return response.data;
//   },

//   // Create delivery boy profile
//   createDeliveryBoy: async (data) => {
//     apiClient("/users/", {
//       method: "POST",
//       body: data,
//     })
//   },

//   // Update delivery boy
//   updateDeliveryBoy: async (id, data) => {
//     const response = await apiClient.put(`/delivery-boys/${id}`, data);
//     return response.data;
//   },

//   // Update status
//   updateStatus: async (id, status) => {
//     const response = await apiClient.patch(`/delivery-boys/${id}/status`, { status });
//     return response.data;
//   },

//   // Update location
//   updateLocation: async (id, latitude, longitude) => {
//     const response = await apiClient.patch(`/delivery-boys/${id}/location`, {
//       latitude,
//       longitude
//     });
//     return response.data;
//   },

//   // Update availability
//   updateAvailability: async (id, is_available) => {
//     const response = await apiClient.patch(`/delivery-boys/${id}/availability`, {
//       is_available
//     });
//     return response.data;
//   },

//   // Delete delivery boy
//   deleteDeliveryBoy: async (id) => {
//     const response = await apiClient.delete(`/delivery-boys/${id}`);
//     return response.data;
//   }
// };


/* =========================
   DELIVERY BOY APIs
========================= */
export const deliveryBoyService = {
  // Get all delivery boys for a specific vendor
  getVendorDeliveryBoys: (vendorId, params = {}) =>
    apiClient(`/delivery_boy/vendor/${vendorId}`, {
      method: "GET",
    //   params: params,
    }),

  // Get a single delivery boy profile by ID
  getById: (id) =>
    apiClient(`/delivery-boys/${id}`, {
      method: "GET",
    }),

  // Create a new delivery boy profile
  create: (data) =>
    apiClient("/users/", {
      method: "POST",
      body: data,
    }),

  // Update a delivery boy profile
  update: (id, data) =>
    apiClient(`/delivery-boys/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Update delivery boy active status
  updateStatus: (id, status) =>
    apiClient(`/delivery-boys/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),

  // Update live location
  updateLocation: (id, latitude, longitude) =>
    apiClient(`/delivery-boys/${id}/location`, {
      method: "PATCH",
      body: { latitude, longitude },
    }),

  // Update online availability
  updateAvailability: (id, is_available) =>
    apiClient(`/delivery-boys/${id}/availability`, {
      method: "PATCH",
      body: { is_available },
    }),

  // Delete a delivery boy profile
  delete: (id) =>
    apiClient(`/delivery-boys/${id}`, {
      method: "DELETE",
    }),
};