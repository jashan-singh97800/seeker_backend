import { apiSlice } from "./apiSlice";

export const applicationsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyApplications: builder.query<any[], void>({
            query: () => '/applications/me',
            providesTags: ['Application'],
        }),
        applyForJob: builder.mutation({
            query: (data) => ({
                url: '/applications',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Application'],
        }),
    })
});

export const {
    useGetMyApplicationsQuery,
    useApplyForJobMutation
} = applicationsApiSlice;
