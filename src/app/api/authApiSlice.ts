import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials: any) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        register: builder.mutation({
            query: (userData: any) => ({
                url: '/auth/register',
                method: 'POST',
                body: { ...userData }
            })
        }),
        getUserStats: builder.query<any, void>({
            query: () => '/analytics/user-stats',
            providesTags: ['User'],
        }),
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetUserStatsQuery
} = authApiSlice;
