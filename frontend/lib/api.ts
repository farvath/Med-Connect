import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request logging
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add response logging
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(
      new Error(error.response?.data?.message || error.message)
    );
  }
);

// Type for API response
interface ApiResponse<T = any> {
  data?: T;
  message?: string;
}

// API functions
export async function apiFetch<T>(path: string, options: any = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error('API URL not configured. Check your .env file.');
  }
  const { method = 'GET', data, params, headers } = options;
  return api.request({
    url: path,
    method,
    data,
    params,
    headers,
  });
}

// Export the axios instance if needed
export default api;