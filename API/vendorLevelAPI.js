import { apiClient } from "@/services/apiClient";

export const vendorLevelService = {
  getAllLevels: async (subscriptionId) => {
    let url = "/vendor-levels";
    if (subscriptionId) {
      url += `?subscriptionId=${subscriptionId}`;
    }
    return apiClient(url, {
      method: "GET",
    });
  },
  createLevel: async (data) => {
    return apiClient("/vendor-levels/create", {
      method: "POST",
      body: data,
    });
  },
  updateLevel: async (id, data) => {
    return apiClient(`/vendor-levels/update/${id}`, {
      method: "PUT",
      body: data,
    });
  },
  deleteLevel: async (id) => {
    return apiClient(`/vendor-levels/delete/${id}`, {
      method: "DELETE",
    });
  },
};
