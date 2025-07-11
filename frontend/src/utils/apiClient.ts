import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true, 
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token dans interceptor:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;