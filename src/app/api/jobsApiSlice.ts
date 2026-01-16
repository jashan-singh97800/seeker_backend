import { apiSlice } from "./apiSlice";

export const jobsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query<any, any>({
            query: (params) => ({
                url: '/jobs',
                params
            }),
            providesTags: ['Job']
        }),
        getJob: builder.query<any, string>({
            query: (id) => `/jobs/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Job' as const, id }]
        }),
        createJob: builder.mutation<any, any>({
            query: (newJob) => ({
                url: '/jobs',
                method: 'POST',
                body: newJob
            }),
            invalidatesTags: ['Job']
        }),
    })
});

export const {
    useGetJobsQuery,
    useGetJobQuery,
    useCreateJobMutation
} = jobsApiSlice;
