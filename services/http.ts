import axios from 'axios';

import { clearAuthStorage, getAccessToken } from '@/services/tokenStorage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ??
  'https://tester32.pythonanywhere.com';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12_000,
  headers: {
    Accept: 'application/json',
  },
  withCredentials: true,
});

http.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status as number | undefined;

    if (status === 401) {
      await clearAuthStorage();
    }

    return Promise.reject(error);
  }
);

export function isNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  return !error.response;
}
