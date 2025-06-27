import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query';

// Define types for the API responses
export type LoginRequest = {
  email: string;
  password: string;
};

export type User = {
  firmName: string;
  id: string;
  email: string;
};

export type AuthResponse = {
  access_token: string;
  user: User;
};

// Helper to create headers with auth token
const createHeaders = () => {
  const headers = new Headers();
  const token = localStorage.getItem('access_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');
  return headers;
};

// Create base query with base URL
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/api/auth/',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// Simple wrapper that doesn't handle token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized responses by redirecting to login
  if (result.error?.status === 401) {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }

  return result;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
        headers: createHeaders()
      })
    }),

    signUp: builder.mutation<
      AuthResponse,
      { email: string; password: string; firmName: string }
    >({
      query: (userData) => ({
        url: 'signup',
        method: 'POST',
        body: userData
      })
    }),

    getMe: builder.query<AuthResponse['user'], void>({
      query: () => ({
        url: 'me',
        headers: createHeaders()
      })
    })
  })
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useGetMeQuery
} = authApi;
