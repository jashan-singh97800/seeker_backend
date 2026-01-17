import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetJobsQuery, useGetJobQuery } from '../app/api/jobsApiSlice';
import { useApplyForJobMutation, useGetMyApplicationsQuery } from '../app/api/applicationsApiSlice';
import { useGetProfileQuery, useUploadResumeMutation } from '../app/api/profileApiSlice';
import { Upload, X, AlertCircle, Building2, MapPin, Banknote, Clock, Briefcase } from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../features/auth/authSlice';

const JobSearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser);

    const { data: jobs, isLoading, isError, error } = useGetJobsQuery({ search: searchTerm });

    // Only fetch applications and profile if user is logged in
    const { data: myApplications } = useGetMyApplicationsQuery(undefined, {
        skip: !user
    });

    const { data: profile } = useGetProfileQuery(undefined, {
        skip: !user
    });

    const [applyForJob, { isLoading: isApplying }] = useApplyForJobMutation();
    const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();

    // State for Modals
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [showJobDetailModal, setShowJobDetailModal] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [jobToApply, setJobToApply] = useState<string | null>(null);


    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch single job details when a job is selected for view
    // This also triggers the view increment on default unless owner
    const { data: selectedJobDetails, isFetching: isFetchingJob } = useGetJobQuery(selectedJobId ?? '', {
        skip: !selectedJobId
    });

    const handleJobClick = (jobId: string) => {
        setSelectedJobId(jobId);
        setShowJobDetailModal(true);
    };

    const handleApplyClick = (jobId: string, e?: React.MouseEvent) => {
        e?.stopPropagation(); // Prevent opening the detail modal if clicking apply directly from list

        // If not logged in, redirect to login page
        if (!user) {
            navigate('/login');
            return;
        }

        // Check if user has a resume
        if (!profile?.resume_url) {
            setJobToApply(jobId);
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
            setJobToApply(null);
            // Optionally close job detail modal if open
            // setShowJobDetailModal(false); 
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
            if (jobToApply) {
                setTimeout(() => handleApply(jobToApply), 500);
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
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg text-center mb-4 sticky top-24 z-30 shadow-lg">
                        {successMsg}
                    </div>
                )}

                {errorMsg && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg text-center mb-4 sticky top-24 z-30 shadow-lg">
                        {errorMsg}
                    </div>
                )}

                {!isLoading && !isError && jobs?.length === 0 && (
                    <div className="bg-gray-50 border border-gray-100 text-gray-500 p-12 rounded-lg text-center">
                        No jobs found matching your search.
                    </div>
                )}

                {!isLoading && !isError && jobs?.map((job: any) => (
                    <div
                        key={job.id}
                        onClick={() => handleJobClick(job.id)}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all cursor-pointer group relative"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h2>
                                <p className="text-gray-600 font-medium flex items-center mt-1">
                                    <Building2 size={16} className="mr-1" />
                                    {job.company?.name || 'Unknown Company'}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                                    <span className="flex items-center"><MapPin size={16} className="mr-1 text-gray-400" /> {job.location || 'Remote'}</span>
                                    <span className="flex items-center"><Banknote size={16} className="mr-1 text-gray-400" /> {job.salary_range || 'Competitive'}</span>
                                    <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700 text-xs font-semibold uppercase flex items-center">
                                        <Briefcase size={12} className="mr-1" />
                                        {job.type || 'Full-time'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleApplyClick(job.id, e)}
                                disabled={isApplying || hasApplied(job.id)}
                                className={`text-primary font-semibold border border-primary px-4 py-2 rounded-md transition-all whitespace-nowrap z-10 
                                    ${isApplying || hasApplied(job.id) ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-blue-600 hover:text-white'}`}
                            >
                                {isApplying && jobToApply === job.id ? 'Applying...' : hasApplied(job.id) ? 'Applied' : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Job Detail Modal */}
            {showJobDetailModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-8 relative flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-8 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white rounded-t-3xl z-10">
                            <div className="pr-12">
                                <h2 className="text-3xl font-black text-gray-900 mb-2">{isFetchingJob ? 'Loading...' : selectedJobDetails?.title}</h2>
                                <div className="flex items-center text-gray-600 font-medium">
                                    <Building2 size={18} className="mr-2" />
                                    {selectedJobDetails?.company?.name}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowJobDetailModal(false);
                                    setSelectedJobId(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors absolute right-6 top-6"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {isFetchingJob ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                                </div>
                            ) : selectedJobDetails ? (
                                <div className="space-y-8">
                                    <div className="flex flex-wrap gap-4 text-sm font-medium">
                                        <div className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                                            <MapPin size={18} className="mr-2" />
                                            {selectedJobDetails.location}
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-xl border border-green-100">
                                            <Banknote size={18} className="mr-2" />
                                            {selectedJobDetails.salary_range}
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-100">
                                            <Briefcase size={18} className="mr-2" />
                                            {selectedJobDetails.type}
                                        </div>
                                        <div className="flex items-center px-4 py-2 bg-orange-50 text-orange-700 rounded-xl border border-orange-100">
                                            <Clock size={18} className="mr-2" />
                                            Posted {new Date(selectedJobDetails.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="prose prose-blue max-w-none">
                                        <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
                                        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {selectedJobDetails.description}
                                        </div>

                                        {selectedJobDetails.requirements && (
                                            <>
                                                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Requirements</h3>
                                                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                                    {selectedJobDetails.requirements}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-20 text-gray-500">
                                    Job details not available.
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-between items-center sticky bottom-0">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Interested?</p>
                                <p className="text-sm font-medium text-gray-600">Don't miss this opportunity</p>
                            </div>
                            <button
                                onClick={() => handleApplyClick(selectedJobDetails?.id || '')}
                                disabled={isApplying || hasApplied(selectedJobDetails?.id || '')}
                                className={`px-10 py-4 rounded-xl font-bold text-lg shadow-xl transition-all active:scale-95 flex items-center
                                    ${isApplying || hasApplied(selectedJobDetails?.id || '')
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'premium-gradient text-white hover:shadow-primary/30 hover:scale-[1.02]'}`}
                            >
                                {isApplying && jobToApply === selectedJobDetails?.id ? 'Sending...' : hasApplied(selectedJobDetails?.id || '') ? 'Applied' : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resume Upload Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black text-gray-900">Upload Resume Required</h3>
                            <button
                                onClick={() => {
                                    setShowResumeModal(false);
                                    setJobToApply(null);
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
                                You need to upload a resume before applying. Please upload a PDF.
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
