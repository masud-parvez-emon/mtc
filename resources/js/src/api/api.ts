import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
        const xsrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='))?.split('=')[1];
        if (xsrfToken) {
            headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken));
        }
        headers.set('Accept', 'application/json');
        return headers;
    },
});

// Define the User interface — adjust fields as per your Laravel API
interface User {
    id: number;
    name: string;
    email: string;
}

// API slice for auth
export const api = createApi({
    reducerPath: 'api',
    keepUnusedDataFor: 0,
    baseQuery, // adjust baseUrl as needed
    endpoints: (builder) => ({
        fetchUser: builder.query<User, void>({
            query: () => 'api/user', // the endpoint for fetching user data
        }),
        login: builder.mutation<User, { email: string; password: string }>({
            query: (credentials) => ({
                url: 'login',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: 'logout',
                method: 'POST',
            }),
        }),


        getContainerCategories: builder.query<any, any>({
            query: (params) => ({
                url: 'api/container-categories',
                params: params,
            }),
        }),
        getContainers: builder.query<any, any>({
            query: (params) => ({
                url: 'api/containers',
                params: params,
            }),
        }),
        getContainerById: builder.query<any, any>({
            query: (id) => ({
                url: `api/containers/${id}`,
            }),
        }),
        getContainerTrackings: builder.query<any, any>({
            query: (id) => ({
                url: `api/containers/${id}`,
            }),
        }),
        saveContainer: builder.mutation<any, any>({
            query: (data) => ({
                url: 'api/containers',
                method: 'POST',
                body: data,
            }),
        }),
        updateContainer: builder.mutation<any, any>({
            query: ({ id, ...data }) => ({
                url: `api/containers/${id}`,
                method: 'PUT',
                body: data,
            }),
        })
    }),
});

export const { useFetchUserQuery, useLoginMutation, useLogoutMutation, useGetContainersQuery, useLazyGetContainersQuery, useGetContainerByIdQuery, useGetContainerCategoriesQuery, useSaveContainerMutation, useUpdateContainerMutation } = api;
