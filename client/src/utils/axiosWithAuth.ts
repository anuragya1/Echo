import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from './constants';

const axiosWithAuth = axios.create({
  baseURL: API_BASE_URL
});

axiosWithAuth.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});

axiosWithAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      Cookies.remove('access_token');
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken
      });

      Cookies.set('access_token', data.access_token, { expires: 7 });
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
      return axiosWithAuth(originalRequest);
    } catch (refreshError) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      return Promise.reject(refreshError);
    }
  }
);

export default axiosWithAuth;
