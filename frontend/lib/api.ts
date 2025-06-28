import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/apiResponse';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in .env');
}

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor (optional logging or auth headers)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Keep full response
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || "Something went wrong";

    const err = new Error(message) as Error & { status?: number };
    err.status = status;

    // ⚠️ Do NOT console.log or throw extra info
    return Promise.reject(err);
  }
);



// Generic typed API wrapper
export async function apiFetch<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    params?: any;
    headers?: any;
  } = {}
): Promise<T> {
  const { method = 'GET', data, params, headers } = options;

  const response: AxiosResponse<ApiResponse<T>> = await api.request({
    url: path,
    method,
    data,
    params,
    headers,
  });

  const body = response.data;

  if (!body.success) {
    throw new Error(body.message || 'API call failed');
  }

  return body.data;
}

// Shorthand helpers
export const apiGet = <T>(path: string, params?: any): Promise<T> =>
  apiFetch<T>(path, { method: 'GET', params });

export const apiPost = <T>(path: string, data?: any): Promise<T> =>
  apiFetch<T>(path, { method: 'POST', data });

export const apiPut = <T>(path: string, data?: any): Promise<T> =>
  apiFetch<T>(path, { method: 'PUT', data });

export const apiDelete = <T>(path: string, params?: any): Promise<T> =>
  apiFetch<T>(path, { method: 'DELETE', params });

// Optionally export Axios instance
export default api;
