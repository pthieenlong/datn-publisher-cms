/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// Get API URL from environment variable, fallback to default
// In development: use proxy /api
// In production: use VITE_API_URL from build args
const API_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL || "http://180.93.42.9:3000");

if (import.meta.env.DEV) {
  console.log("🔧 [Axios] Using proxy path:", API_URL);
  console.log("🔧 [Axios] Vite will proxy /api requests to backend");
} else {
  console.log("🔧 [Axios] Using API URL:", API_URL);
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    if (import.meta.env.DEV) {
      console.log(
        `📤 [Client] Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isLoginPage =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/login");

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.skipAuthRefresh ||
        isLoginPage
      ) {
        return Promise.reject(error);
      }

      try {
        await axiosInstance.post("/auth/refresh-token");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", refreshError);
        // Redirect to login if refresh fails
        if (typeof window !== "undefined" && !isLoginPage) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error("❌ Network Error:", error.message);
    } else {
      console.error(
        `❌ [Client] API Error: ${error.response.status} ${error.response.statusText} → ${error.message}`
      );
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;

export const fetchMe = async (skipAuthRefresh = false): Promise<any> => {
  const config = skipAuthRefresh ? ({ skipAuthRefresh: true } as any) : {};
  const res = await axiosInstance.get("/auth/me", config);
  return res.data;
};
