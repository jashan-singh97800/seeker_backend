import { useState, useRef } from 'react';
import { useGetJobsQuery } from '../app/api/jobsApiSlice';
import { useApplyForJobMutation, useGetMyApplicationsQuery } from '../app/api/applicationsApiSlice';
import { useGetProfileQuery, useUploadResumeMutation } from '../app/api/profileApiSlice';
import { Upload, X, AlertCircle } from 'lucide-react';

const JobSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const { data: jobs, isLoading, isError, error } = useGetJobsQuery({ search: searchTerm });
    const { data: myApplications } = useGetMyApplicationsQuery();
    const { data: profile } = useGetProfileQuery();
    const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation();
    const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleApplyClick = (jobId: string) => {
        // Check if user has a resume
        if (!profile?.resume_url) {
            setSelectedJobId(jobId);
            setShowResumeModal(true);
            return;
        }

        // User has resume, proceed with application
        handleApply(jobId);
    };

    const handleApply = async (jobId: string) => {
        try {
            setErrorMsg('');
            await applyForJob({ job_id: jobId }).unwrap();
            setSuccessMsg('Application submitted successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
            setShowResumeModal(false);
            setSelectedJobId(null);
        } catch (err: any) {
            console.error('Failed to apply:', err);
            setErrorMsg(err?.data?.message || 'Failed to submit application.');
            setTimeout(() => setErrorMsg(''), 5000);
        }
    };

    const validateFile = (file: File): string | null => {
        if (file.type !== 'application/pdf') {
            return 'Only PDF files are allowed';
        }
        // Limit removed as per backend changes
        return null;
    };

    const handleFileUpload = async (file: File) => {
        setUploadError('');
        const error = validateFile(file);
        if (error) {
            setUploadError(error);
            return;
        }

        try {
            await uploadResume(file).unwrap();
            setSuccessMsg('Resume uploaded successfully! You can now apply.');
            setTimeout(() => setSuccessMsg(''), 3000);
            // After successful upload, apply for the job
            if (selectedJobId) {
                setTimeout(() => handleApply(selectedJobId), 500);
            }
        } catch (err) {
            setUploadError('Failed to upload resume. Please try again.');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const hasApplied = (jobId: string) => {
        return myApplications?.some(app => app.job_id === jobId);
    };

    return (
        <div className="px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Role</h1>
                <div className="flex gap-4">
                    <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary transition-all"
                        placeholder="Job title, keywords, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-all active:scale-95"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
                        <p className="font-semibold">Oops! Something went wrong.</p>
                        <p className="text-sm">{(error as any)?.data?.message || 'Could not fetch jobs. Please try again later.'}</p>
                    </div>
                )}

                {successMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg text-center mb-4">
                        {successMsg}
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg text-center mb-4">
                        {errorMsg}
                    </div>
                )}

                {!isLoading && !isError && jobs?.length === 0 && (
                    <div className="bg-gray-50 border border-gray-100 text-gray-500 p-12 rounded-lg text-center">
                        No jobs found matching your search.
                    </div>
                )}

                {!isLoading && !isError && jobs?.map((job: any) => (
                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h2>
                                <p className="text-gray-600 font-medium">{job.company?.name || 'Unknown Company'}</p>
                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center">📍 {job.location || 'Remote'}</span>
                                    <span className="flex items-center">💰 {job.salary_range || 'Competitive'}</span>
                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 text-xs font-semibold uppercase">{job.type || 'Full-time'}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleApplyClick(job.id)}
                                disabled={isApplying || hasApplied(job.id)}
                                className={`text-primary font-semibold border border-primary px-4 py-2 rounded-md transition-all whitespace-nowrap 
                                    ${isApplying || hasApplied(job.id) ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-blue-600 hover:text-white'}`}
                            >
                                {isApplying ? 'Applying...' : hasApplied(job.id) ? 'Applied' : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Resume Upload Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-900">Upload Resume Required</h3>
                            <button
                                onClick={() => {
                                    setShowResumeModal(false);
                                    setSelectedJobId(null);
                                    setUploadError('');
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
                            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm text-blue-700 font-semibold">
                                You need to upload a resume before applying for jobs. Please upload your resume (PDF only).
                            </p>
                        </div>

                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
                                }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className={`mx-auto mb-3 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`} size={48} />
                            <p className="text-lg font-bold text-gray-700 mb-1">
                                {isDragging ? 'Drop your resume here' : 'Upload Resume'}
                            </p>
                            <p className="text-sm text-gray-500">
                                Drag & drop or click to browse
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                PDF only
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        {uploadError && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-700 font-semibold">{uploadError}</p>
                            </div>
                        )}

                        {isUploading && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                <p className="text-sm text-blue-700 font-semibold text-center">Uploading your resume...</p>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Or{' '}
                                <a href="/profile" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    go to your profile
                                </a>
                                {' '}to upload your resume
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobSearchPage;
