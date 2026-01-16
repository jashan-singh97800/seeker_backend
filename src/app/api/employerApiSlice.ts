import { apiSlice } from './apiSlice';

export const employerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getEmployerStats: builder.query({
            query: () => '/jobs/employer/stats',
            providesTags: ['EmployerStats'],
        }),
        getEmployerJobs: builder.query({
            query: () => '/jobs/employer/me',
            providesTags: ['EmployerJobs'],
        }),
        getJobApplicants: builder.query({
            query: (jobId) => `/applications/job/${jobId}`,
            providesTags: ['Application'],
        }),
        createJob: builder.mutation({
            query: (jobData) => ({
                url: '/jobs',
                method: 'POST',
                body: jobData,
            }),
            invalidatesTags: ['EmployerJobs', 'EmployerStats', 'Job'],
        }),
        acceptApplication: builder.mutation({
            query: (applicationId) => ({
                url: `/applications/${applicationId}/accept`,
                method: 'POST',
            }),
            invalidatesTags: ['Application'],
        }),
        rejectApplication: builder.mutation({
            query: (applicationId) => ({
                url: `/applications/${applicationId}/reject`,
                method: 'POST',
            }),
            invalidatesTags: ['Application'],
        }),
        updateJobStatus: builder.mutation({
            query: ({ jobId, status }) => ({
                url: `/jobs/${jobId}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['EmployerJobs', 'EmployerStats', 'Job'],
        }),
        deleteJob: builder.mutation({
            query: (jobId) => ({
                url: `/jobs/${jobId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['EmployerJobs', 'EmployerStats', 'Job'],
        }),
    }),
});

export const {
    useGetEmployerStatsQuery,
    useGetEmployerJobsQuery,
    useGetJobApplicantsQuery,
    useCreateJobMutation,
    useAcceptApplicationMutation,
    useRejectApplicationMutation,
    useUpdateJobStatusMutation,
    useDeleteJobMutation,
} = employerApiSlice;
