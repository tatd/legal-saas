import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query';

// Types
export interface Customer {
  id: number;
  name: string;
  phoneNumber: string;
  isActive: boolean;
}

// Create base query with base URL
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3001/api/customers',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

// Base query with reauthentication handling
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

export const customersApi = createApi({
  reducerPath: 'customersApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Customer'],
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query<Customer[], void>({
      query: () => ({
        url: '/',
        method: 'GET'
      }),
      providesTags: ['Customer']
    }),

    // Get single customer by ID
    getCustomerById: builder.query<Customer, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET'
      }),
      providesTags: (_result, _error, id) => [{ type: 'Customer', id }]
    }),

    // Create a new customer
    createCustomer: builder.mutation<
      Customer,
      Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'firmId'>
    >({
      query: (customer) => ({
        url: '/',
        method: 'POST',
        body: customer
      }),
      invalidatesTags: ['Customer']
    }),

    // Update a customer
    updateCustomer: builder.mutation<
      Customer,
      Partial<Customer> & { id: string }
    >({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Customer', id }]
    }),

    // Delete a customer
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Customer']
    })
  })
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation
} = customersApi;
