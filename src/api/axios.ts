import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "https://retro-backend-19qj.onrender.com/api", // update if needed//
  withCredentials: true,
});

// const ExternalAPI = axios.create({
//   baseURL: "localhost:8800/api/user/logout", // update if needed
//   withCredentials: true,
// });

export default API;
