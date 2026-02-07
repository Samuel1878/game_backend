import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL || "https://ex-api-demo-yy.568win.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});
