import axios from "axios";
import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

export const BASE_URL = "http://localhost:8000/api";
/* =========================
   🔑 JWT EXPIRY CHECK
========================= */
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expired = Date.now() > payload.exp * 1000;

    console.log("🕒 [AUTH] Token expiry check:", {
      exp: payload.exp,
      expired,
    });

    return expired;
  } catch (err) {
    console.log("❌ [AUTH] Token decode failed", err);
    return true;
  }
};

/* =========================
   🚀 AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  // withCredentials: true,
});

/* =========================
   🔐 REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.token;

    console.log("➡️ [API REQUEST]");
    console.log("➡️ URL:", `${config.baseURL}${config.url}`);
    console.log("➡️ Method:", config.method?.toUpperCase());

    if (token) {
      console.log("🔑 [AUTH] Token found in store", token);

      if (isTokenExpired(token)) {
        console.log("⛔ [AUTH] Token expired → logout");
        store.dispatch(logout());
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ [AUTH] Token attached to headers");
    } else {
      console.log("ℹ️ [AUTH] No token found (public API)");
    }

    if (config.data instanceof FormData) {
      console.log("📦 [API] Payload type: FormData");
    } else {
      console.log("📦 [API] Payload type: JSON");
      console.log("📦 [API] Body:", config.data);
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return config;
  },
  (error) => {
    console.log("❌ [API] Request interceptor error:", error);
    return Promise.reject(error);
  },
);

/* =========================
   🌐 RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => {
    console.log("⬅️ [API RESPONSE]");
    console.log("⬅️ Status:", response.status);
    console.log("⬅️ URL:", response.config.url);
    console.log("⬅️ Data:", response.data);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return response;
  },
  (error) => {
    console.log("❌ [API RESPONSE ERROR]");

    const status = error?.response?.status;

    if (status) {
      console.log("⬅️ Status:", status);
      console.log("⬅️ Error data:", error.response.data);
    }

    if (status === 401 || status === 403) {
      console.log("🔐 [AUTH] Session expired → Auto logout");

      store.dispatch(logout());

      if (typeof window !== "undefined") {
        console.log("➡️ Redirecting to /login");
        // window.location.href = "/login";
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return Promise.reject(error?.response?.data || error);
  },
);

/* =========================
   📡 API CLIENT FUNCTION
========================= */
export const apiClient = async (endpoint, options = {}) => {
  const { method = "GET", body = null, headers = {}, params } = options;


  console.log("🚀 [API CLIENT CALL]");
  console.log("Endpoint:", endpoint);
  console.log("Method:", method);

  const isFormData = body instanceof FormData;

  try {
    const response = await api.request({
      url: endpoint,
      method,
      ...(body !== null && body !== undefined ? { data: body } : {}),
      headers: {
        ...headers,
       ...(!isFormData && { "Content-Type": "application/json" }),
      },
    });

    console.log("✅ [API CLIENT SUCCESS]");
    return response.data;
  } catch (err) {
    console.log("💥 [API CLIENT FAILED]");
    console.log("Error:", err);
    throw err;
  }
};
