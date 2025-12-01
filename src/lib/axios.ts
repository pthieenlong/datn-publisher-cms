/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

// Sử dụng proxy trong development để tránh vấn đề SameSite cookie
const API_URL = import.meta.env.DEV ? "/api" : "http://157.66.101.220:3000";

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

      // Không refresh token nếu request là refresh token endpoint
      // Cho phép refresh ngay cả khi ở login page nếu là request /auth/me (sau khi login thành công)
      if (
        originalRequest.url?.includes("/auth/refresh-token") ||
        (isLoginPage && !originalRequest.url?.includes("/auth/me"))
      ) {
        return Promise.reject(error);
      }

      try {
        await axiosInstance.post("/auth/refresh-token");

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    if (!error.response) {
      console.error("❌ Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;

export const fetchMe = async (): Promise<any> => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (err: unknown) {
    if (
      err instanceof AxiosError &&
      (err.response?.status === 401 || err.response?.status === 403)
    ) {
      try {
        // Đợi một chút để đảm bảo cookies đã được set (nếu vừa login)
        await new Promise((resolve) => setTimeout(resolve, 200));
        await axiosInstance.post("/auth/refresh-token");
        const retry = await axiosInstance.get("/auth/me");
        return retry.data;
      } catch (refreshErr) {
        console.error("❌ fetchMe refresh failed:", refreshErr);
        if (typeof window !== "undefined") {
          // window.location.href = "/login";
        }
        throw refreshErr;
      }
    }
    throw err;
  }
};
