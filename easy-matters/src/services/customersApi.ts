import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query';

// Types
export type Matter = {
  id: number;
  name: string;
  description: string;
  customerId: number;
  createdAt: string;
};

export type CreateMatterData = {
  name: string;
  description: string;
  customerId: number;
};

export type Customer = {
  id: number;
  name: string;
  phoneNumber: string;
  isActive: boolean;
};

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
  tagTypes: ['Customer', 'Matters', 'Matter'],
  endpoints: (builder) => ({
    // Get all customers
    getCustomers: builder.query<Customer[], void>({
      query: () => ({
        url: '/',
        method: 'GET'
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Customer' as const, id })),
              { type: 'Customer', id: 'LIST' }
            ]
          : [{ type: 'Customer', id: 'LIST' }]
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
      { id: string } & Partial<Customer>
    >({
      query: ({ id, ...updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates
      }),
      invalidatesTags: (_result, _error, arg) => {
        const tags: Array<{ type: 'Customer'; id: string | number }> = [
          { type: 'Customer', id: arg.id }
        ];
        // If isActive is being updated, also invalidate the list
        if ('isActive' in arg) {
          tags.push({ type: 'Customer', id: 'LIST' });
        }
        return tags;
      }
    }),

    // Delete a customer
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Customer']
    }),

    // Create a new matter for a customer
    createMatter: builder.mutation<Matter, CreateMatterData>({
      query: (matterData) => ({
        url: `/${matterData.customerId}/matters`,
        method: 'POST',
        body: matterData
      }),
      invalidatesTags: (_result, _error, { customerId }) => [
        { type: 'Customer', id: customerId },
        { type: 'Matters', id: customerId }
      ]
    }),

    // Get all matters for a customer
    getMatters: builder.query<Matter[], number>({
      query: (customerId) => ({
        url: `/${customerId}/matters`,
        method: 'GET'
      }),
      providesTags: (_result, _error, customerId) => [
        { type: 'Matters', id: customerId }
      ]
    }),

    // Get a single matter for a customer
    getMatterById: builder.query<
      Matter,
      { customerId: number; matterId: number }
    >({
      query: ({ customerId, matterId }) => ({
        url: `/${customerId}/matters/${matterId}`,
        method: 'GET'
      }),
      providesTags: (_result, _error, { customerId, matterId }) => [
        { type: 'Matters', id: customerId },
        { type: 'Matter', id: matterId }
      ]
    })
  })
});

export const {
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useCreateMatterMutation,
  useGetMattersQuery,
  useGetMatterByIdQuery
} = customersApi;
