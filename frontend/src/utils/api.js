// ============================================================
// utils/api.js — Axios Instance (HTTP Client)
// ============================================================
// Axios is a library to make HTTP requests (like fetch, but better).
// We create a configured "instance" here so we don't repeat
// the base URL and auth token logic in every component.
//
// axiosInstance.interceptors.request.use() runs before every request:
// It automatically attaches the JWT token from localStorage to headers.
// ============================================================

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // thanks to Vite proxy, this becomes http://localhost:5000/api
});

// Interceptor: runs before every request
axiosInstance.interceptors.request.use((config) => {
  // Get the token saved in browser localStorage after login
  const token = localStorage.getItem("token");
  if (token) {
    // Attach it as: "Authorization: Bearer <token>"
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
