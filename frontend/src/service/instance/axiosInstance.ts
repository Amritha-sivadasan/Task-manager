import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstnce = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstnce.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstnce.interceptors.response.use((response) => {
  return response;
  
},
(error) => {
    if (error.response && error.response.status === 401) {
        window.location.href = "/login"; 
    }
    return Promise.reject(error);
  });
