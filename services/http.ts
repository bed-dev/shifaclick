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

function getMessageFromUnknown(payload: unknown): string | null {
  if (typeof payload === 'string') {
    return payload.trim() || null;
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const message = getMessageFromUnknown(item);

      if (message) {
        return message;
      }
    }
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;

    for (const key of ['message', 'detail', 'error', 'errors', 'non_field_errors', 'q']) {
      const message = getMessageFromUnknown(record[key]);

      if (message) {
        return message;
      }
    }

    for (const value of Object.values(record)) {
      const message = getMessageFromUnknown(value);

      if (message) {
        return message;
      }
    }
  }

  return null;
}

export function getRequestErrorMessage(error: unknown, fallback: string): string {
  if (isNetworkError(error)) {
    return 'No network connection. Please retry.';
  }

  if (axios.isAxiosError(error)) {
    const message = getMessageFromUnknown(error.response?.data);

    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
