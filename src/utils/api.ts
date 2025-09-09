// lib/axios.ts or utils/axios.ts

import axios from "axios";

const devBaseURL = "http://localhost:1024";
const prodBaseURL = "https://messapi.annoorfoods.com";

const BASE_URL =
  process.env.NODE_ENV === "development" ? devBaseURL : prodBaseURL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const currentPath = window.location.pathname;

      if (currentPath !== "/auth") {
        console.warn("🔐 Unauthorized: Redirecting to /auth");
        window.location.href = "/auth";
      } else {
        console.warn("🔐 Unauthorized: Already on /auth, not redirecting.");
      }

      document.dispatchEvent(new Event("unauthorized"));

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
