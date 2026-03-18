// API/subscriptionAPI.js
import { apiClient } from '@/services/apiClient';

export const subscriptionService = {
  // Get all active subscriptions (public/user)
  getAllSubscriptions: () =>
    apiClient("/subscriptions", {
      method: "GET",
    }),

  // Get all subscriptions (admin - includes inactive)
  adminGetAllSubscriptions: () =>
    apiClient("/subscriptions/admin/all", {
      method: "GET",
    }),

  // Create new subscription plan (admin)
  createSubscription: (data) =>
    apiClient("/subscriptions/admin/create", {
      method: "POST",
      body: data,
    }),

  // Update subscription plan (admin)
  updateSubscription: (id, data) =>
    apiClient(`/subscriptions/admin/update/${id}`, {
      method: "PUT",
      body: data,
    }),

  // Delete subscription plan (admin)
  deleteSubscription: (id) =>
    apiClient(`/subscriptions/admin/delete/${id}`, {
      method: "DELETE",
    }),

  // Get active subscription for logged in user
  getActiveSubscription: () =>
    apiClient("/subscriptions/active-subscription", {
      method: "GET",
    }),
};
