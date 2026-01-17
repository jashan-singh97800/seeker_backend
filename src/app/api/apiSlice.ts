import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3008',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth?.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithUnwrap = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.data) {
        // If the backend returned the standardized format, unwrap the 'data' field
        const responseData = result.data as any;
        if (responseData.success && responseData.data !== undefined) {
            result.data = responseData.data;
        }
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithUnwrap,
    tagTypes: ['Job', 'User', 'Application', 'Company', 'EmployerStats', 'EmployerJobs', 'Profile'],
    endpoints: (_builder) => ({}),
});
