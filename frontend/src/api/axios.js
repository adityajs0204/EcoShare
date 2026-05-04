import axios from "axios";

/**
 * Axios instance pre-configured with the backend base URL.
 * A request interceptor automatically attaches the JWT token
 * from localStorage to every outgoing request.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ───────────────────────────────────────────────────────
// Attach Bearer token to every request if present in localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────────────────
// Handle 401 Unauthorized globally (auto-logout)
// IMPORTANT: Skip auth routes — a failed login/register legitimately returns 401
// and should show a toast error, NOT trigger an auto-logout redirect.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
