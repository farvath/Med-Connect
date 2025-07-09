import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types/apiResponse'; // Assuming you have this type defined
import { HospitalListResponse, HospitalResponse, HospitalSpecialtiesResponse, HospitalLocationsResponse } from '@/types/hospitals';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not defined in .env');
}

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  // REMOVED: 'Content-Type': 'application/json',
  // Axios automatically sets 'Content-Type' for FormData,
  // so we should not hardcode 'application/json' globally.
  withCredentials: true,
});

// Request interceptor (optional logging or auth headers)
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || "Something went wrong";

    // Create enhanced error object
    const enhancedError = new Error(message) as Error & { 
      status?: number;
      isAuthError?: boolean;
    };
    enhancedError.status = status;
    enhancedError.isAuthError = status === 401;

    // Completely suppress 401 errors from console
    if (status === 401) {
      // Don't log anything for auth errors
      return Promise.reject(enhancedError);
    }

    // For other errors, you can optionally log them
    // console.error('API Error:', status, message);

    return Promise.reject(enhancedError);
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

  const requestConfig: AxiosRequestConfig = {
    url: path,
    method,
    data,
    params,
    headers,
  };

  // If data is FormData, Axios will automatically set the correct Content-Type header
  // So, we don't need to manually set it unless it's strictly 'application/json' for non-FormData
  // For requests that are NOT FormData, you might explicitly set 'application/json' if needed,
  // but for a general utility, letting Axios handle it based on 'data' type is often best.
  // For example, if you send a plain object, Axios will default to 'application/json'.

  const response: AxiosResponse<ApiResponse<T>> = await api.request(requestConfig);

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

// Safe authentication check that doesn't throw on 401 errors
export async function checkAuth(): Promise<any | null> {
  try {
    return await apiFetch<any>('/user/getUser');
  } catch (error: any) {
    // Return null for auth errors (401) instead of throwing
    if (error.status === 401 || error.isAuthError) {
      return null;
    }
    // Re-throw other errors (but don't log them)
    throw error;
  }
}

// Generic wrapper to suppress 401 errors for any API call
export async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error: any) {
    // Return null for auth errors instead of throwing
    if (error.status === 401 || error.isAuthError) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}

// Hospital API functions
export const getHospitals = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  specialty?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}): Promise<HospitalListResponse['data']> =>
  apiGet<HospitalListResponse['data']>('/hospitals', params);

export const getHospitalById = (id: string): Promise<HospitalResponse['data']> =>
  apiGet<HospitalResponse['data']>(`/hospitals/${id}`);

export const getHospitalSpecialties = (): Promise<HospitalSpecialtiesResponse['data']> =>
  apiGet<HospitalSpecialtiesResponse['data']>('/hospitals/meta/specialties');

export const getHospitalLocations = (): Promise<HospitalLocationsResponse['data']> =>
  apiGet<HospitalLocationsResponse['data']>('/hospitals/meta/locations');

// User API functions
export const updateUser = (data: any): Promise<any> =>
  apiPut<any>('/user/updateUser', data);

// Optionally export Axios instance
export default api;
