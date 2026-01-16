import { apiSlice } from './apiSlice';

export const profileApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<any, void>({
            query: () => '/users/profile',
            providesTags: ['Profile'],
        }),
        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: '/users/profile',
                method: 'POST',
                body: profileData,
            }),
            invalidatesTags: ['Profile'],
        }),
        uploadResume: builder.mutation({
            query: (file) => {
                const formData = new FormData();
                formData.append('resume', file);
                return {
                    url: '/users/upload-resume',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useUploadResumeMutation,
} = profileApiSlice;
