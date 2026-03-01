import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const data = localStorage.getItem("storeInfo");
  if (data) {
    const { token } = JSON.parse(data);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;