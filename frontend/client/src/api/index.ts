import axios from "axios";
const api = axios.create({
  baseURL: "http://147.45.158.13:80/api"
});

api.interceptors.request.use(
  async config => {
    const accessToken = localStorage.getItem("accessToken")
    config.headers["Authorization"] = `Bearer ${accessToken}`
    config.headers["Accept"] = 'application/json'

    return config;
  },
  (error) => Promise.reject(error));

api.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config;

  if (error.response.status === 403 && !originalRequest._retry) {
    originalRequest._retry = true;
    console.log("refresh required")
    return api(originalRequest);
  }
  return Promise.reject(error);
});

export default api
