import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// بيضيف الـ Token تلقائياً في كل request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cliniq_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// بيعمل logout تلقائي لو الـ Token انتهى + error messages موحدة
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem("cliniq_token");
      localStorage.removeItem("cliniq_user");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (status === 429) {
      toast.error("Too many attempts, please wait a minute");
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error("You don't have permission to do this");
      return Promise.reject(error);
    }

    if (status === 404) {
      toast.error(message || "Resource not found");
      return Promise.reject(error);
    }

    if (status >= 500) {
      toast.error("Server error, please try again later");
      return Promise.reject(error);
    }

    // باقي الـ errors — بيظهر الـ message من الـ API لو موجود
    if (message) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default api;
