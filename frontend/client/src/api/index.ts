import axios from "axios";
const api = axios.create({
  baseURL: "https://bizz-ai.ru/api/"
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

    const refreshToken = localStorage.getItem("refreshToken");
    const newAccessToken = await api.post<string>('/refresh', { token: refreshToken });

    localStorage.setItem('accessToken', newAccessToken.data);
    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

    return api(originalRequest);
  }

  return Promise.reject(error);
});

export default api
