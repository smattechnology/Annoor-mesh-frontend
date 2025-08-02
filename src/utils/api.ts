// lib/axios.ts or utils/axios.ts

import axios from "axios";

const devBaseURL = "http://localhost:1024";
const prodBaseURL = "https://api.nuraloom.xyz";

const BASE_URL =
  process.env.NODE_ENV === "development" ? devBaseURL : prodBaseURL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies if needed
});

export default api;
