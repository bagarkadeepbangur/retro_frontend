import axios from "axios";
import { getToken, clearSession } from "../auth";
const API = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://retro-backend-19qj.onrender.com/api", // update if needed//
  withCredentials: true,
});

// const ExternalAPI = axios.create({
//   baseURL: "localhost:8800/api/user/logout", // update if needed
//   withCredentials: true,
// });
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // Token invalid/expired → force logout
      clearSession();
      // Optionally, you can hard-redirect:
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
