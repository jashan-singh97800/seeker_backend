import { useState, useEffect } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../features/auth/authSlice';
import { Users, Briefcase, TrendingUp, Plus, Search, Filter, MoreVertical, Eye, X, Mail, Calendar, CheckCircle, XCircle, User, Globe } from 'lucide-react';
import { useGetEmployerJobsQuery, useGetEmployerStatsQuery, useCreateJobMutation, useGetJobApplicantsQuery, useAcceptApplicationMutation, useRejectApplicationMutation, useUpdateJobStatusMutation, useDeleteJobMutation } from '../app/api/employerApiSlice';

const ApplicantsModal = ({ isOpen, onClose, jobId, jobTitle }: any) => {
    const { data: applicants, isLoading } = useGetJobApplicantsQuery(jobId, { skip: !jobId });
    const [acceptApplication, { isLoading: isAccepting }] = useAcceptApplicationMutation();
    const [rejectApplication, { isLoading: isRejecting }] = useRejectApplicationMutation();
    const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);

    const handleAccept = async (id: string) => {
        try {
            await acceptApplication(id).unwrap();
        } catch (err) {
            console.error('Failed to accept application:', err);
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectApplication(id).unwrap();
            setConfirmRejectId(null);
        } catch (err) {
            console.error('Failed to reject application:', err);
        }
    };

    const handleDownloadResume = (userId: string) => {
        window.open(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/resume`, '_blank');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white">Applicants</h2>
                        <p className="text-blue-100 font-medium">{jobTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-full transition-all">
                        <X size={28} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : applicants && applicants.length > 0 ? (
                        <div className="space-y-4">
                            {applicants.map((application: any) => (
                                <div key={application.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="text-blue-600" size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900">
                                                        {application.user?.profile?.full_name || application.user?.email || 'Unknown'}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                        <Mail size={14} />
                                                        <span>{application.user?.email}</span>
                                                    </div>
                                                    {application.user?.profile?.phone && (
                                                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                                            <span>📱 {application.user.profile.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {application.user?.profile?.bio && (
                                                <p className="mt-3 text-sm text-gray-600">{application.user.profile.bio}</p>
                                            )}

                                            {application.user?.profile?.skills && application.user.profile.skills.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {application.user.profile.skills.map((skill: string, i: number) => (
                                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="mt-3 flex items-center space-x-4">
                                                {application.user?.profile?.linkedin_url && (
                                                    <a
                                                        href={application.user.profile.linkedin_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                                    >
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                        </svg>
                                                        <span>LinkedIn</span>
                                                    </a>
                                                )}
                                                {application.user?.profile?.portfolio_url && (
                                                    <a
                                                        href={application.user.profile.portfolio_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-semibold"
                                                    >
                                                        <Globe size={16} />
                                                        <span>Portfolio</span>
                                                    </a>
                                                )}
                                                {application.user?.profile?.resume_url && (
                                                    <button
                                                        onClick={() => handleDownloadResume(application.user.id)}
                                                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-semibold"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>Resume</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-4">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                                application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {application.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500 mb-3">
                                        <Calendar size={14} className="inline mr-1" />
                                        Applied {new Date(application.createdAt).toLocaleDateString()}
                                    </div>

                                    {application.status !== 'accepted' && application.status !== 'rejected' && (
                                        <div className="flex space-x-3 mt-4">
                                            <button
                                                onClick={() => handleAccept(application.id)}
                                                disabled={isAccepting || isRejecting}
                                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all disabled:opacity-50"
                                            >
                                                <CheckCircle size={18} />
                                                <span>{isAccepting ? 'Accepting...' : 'Accept'}</span>
                                            </button>
                                            <button
                                                onClick={() => setConfirmRejectId(application.id)}
                                                disabled={isAccepting || isRejecting}
                                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50"
                                            >
                                                <XCircle size={18} />
                                                <span>{isRejecting ? 'Rejecting...' : 'Reject'}</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg font-semibold">No applicants yet</p>
                            <p className="text-sm mt-2">Check back later for new applications</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Confirmation Dialog */}
            {confirmRejectId && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-black text-gray-900 mb-4">Reject Application?</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to reject this application? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setConfirmRejectId(null)}
                                className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(confirmRejectId)}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CreateJobModal = ({ isOpen, onClose, onSubmit, isLoading }: any) => {
    const [formData, setFormData] = useState({
        title: '',
        company_id: '00000000-0000-0000-0000-000000000001', // Use seeded default company ID
        location: '',
        type: 'Full-time',
        salary_min: '',
        salary_max: '',
        description: '',
        requirements: '',
        status: 'active', // Set to active by default
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                title: '',
                company_id: '00000000-0000-0000-0000-000000000001',
                location: '',
                type: 'Full-time',
                salary_min: '',
                salary_max: '',
                description: '',
                requirements: '',
                status: 'active',
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-2xl font-black text-gray-900">Post New Role</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                        <input
                            required
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all font-medium"
                            placeholder="e.g. Senior Frontend Engineer"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all font-medium"
                                placeholder="e.g. Remote, NY"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                            <select
                                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all font-medium"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Freelance</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Min Salary ($)</label>
                            <input
                                required
                                type="number"
                                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all font-medium"
                                placeholder="e.g. 50000"
                                value={formData.salary_min}
                                onChange={e => setFormData({ ...formData, salary_min: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Max Salary ($)</label>
                            <input
                                required
                                type="number"
                                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all font-medium"
                                placeholder="e.g. 80000"
                                value={formData.salary_max}
                                onChange={e => setFormData({ ...formData, salary_max: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all font-medium"
                            placeholder="Describe the role..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'Posting...' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const EmployerDashboard = () => {
    const user = useAppSelector(selectCurrentUser);
    const { data: stats } = useGetEmployerStatsQuery(undefined, { pollingInterval: 5000 });
    const { data: jobs } = useGetEmployerJobsQuery(undefined, { pollingInterval: 5000 });
    const [createJob, { isLoading: isCreating }] = useCreateJobMutation();
    const [updateJobStatus] = useUpdateJobStatusMutation();
    const [deleteJob, { isLoading: isDeleting }] = useDeleteJobMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [selectedJobTitle, setSelectedJobTitle] = useState('');
    const [openMenuJobId, setOpenMenuJobId] = useState<string | null>(null);
    const [confirmDeleteJobId, setConfirmDeleteJobId] = useState<string | null>(null);

    const handleCreateJob = async (data: any) => {
        try {
            await createJob(data).unwrap();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Failed to create job:', err);
        }
    };

    const handleViewApplicants = (jobId: string, jobTitle: string) => {
        setSelectedJobId(jobId);
        setSelectedJobTitle(jobTitle);
    };

    const handleCloseApplicants = () => {
        setSelectedJobId(null);
        setSelectedJobTitle('');
    };

    const handleUpdateStatus = async (jobId: string, status: string) => {
        try {
            await updateJobStatus({ jobId, status }).unwrap();
            setOpenMenuJobId(null);
        } catch (err) {
            console.error('Failed to update job status:', err);
        }
    };

    const handleDeleteJob = async (jobId: string) => {
        try {
            await deleteJob(jobId).unwrap();
        } catch (err) {
            console.error('Failed to delete job:', err);
            alert('Failed to delete job. Please try again.');
        } finally {
            // Always close the dialog, even if delete fails
            setConfirmDeleteJobId(null);
            setOpenMenuJobId(null);
        }
    };

    // Filter jobs based on search term
    const filteredJobs = jobs?.filter((job: any) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.status?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];


    return (
        <div className="min-h-screen bg-dashboard relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-400/10 blur-[100px] rounded-full"></div>

            <div className="px-4 py-12 max-w-7xl mx-auto relative z-10">
                <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">
                            Employer <span className="text-gradient">Console</span>
                        </h1>
                        <p className="text-gray-500 mt-3 text-lg font-medium flex items-center bg-white/40 backdrop-blur-sm self-start px-3 py-1 rounded-lg">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-ping"></span>
                            Managing talent for <span className="text-blue-600 font-bold ml-1">{user?.email}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-3 px-10 py-5 premium-gradient text-white rounded-[2rem] font-bold shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.4)] transition-all group hover:scale-105 active:scale-95"
                    >
                        <div className="bg-white/20 p-1.5 rounded-xl group-hover:rotate-90 transition-transform duration-500">
                            <Plus size={24} />
                        </div>
                        <span className="text-lg">Create New Listing</span>
                    </button>
                </header>

                <ApplicantsModal
                    isOpen={!!selectedJobId}
                    onClose={handleCloseApplicants}
                    jobId={selectedJobId}
                    jobTitle={selectedJobTitle}
                />

                <CreateJobModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateJob}
                    isLoading={isCreating}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                    <div className="glass-card p-10 rounded-[3rem] group hover:translate-y-[-10px] transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:premium-gradient group-hover:text-white transition-all duration-500 shadow-lg shadow-blue-500/10">
                            <Briefcase size={32} />
                        </div>
                        <div className="text-5xl font-black text-gray-900 tracking-tighter">{stats?.activeJobs || 0}</div>
                        <div className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mt-2">Active Roles</div>
                    </div>
                    <div className="glass-card p-10 rounded-[3rem] group hover:translate-y-[-10px] transition-all duration-500">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-purple-500/10">
                            <Users size={32} />
                        </div>
                        <div className="text-5xl font-black text-gray-900 tracking-tighter text-purple-600">{stats?.totalApplicants || 0}</div>
                        <div className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mt-2">Total Applicants</div>
                    </div>
                    <div className="glass-card p-10 rounded-[3rem] group hover:translate-y-[-10px] transition-all duration-500">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-teal-600 group-hover:text-white transition-all duration-500 shadow-lg shadow-emerald-500/10">
                            <TrendingUp size={32} />
                        </div>
                        <div className="text-5xl font-black text-gray-900 tracking-tighter text-emerald-600">12%</div>
                        <div className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mt-2">Growth this month</div>
                    </div>
                    <div className="glass-card p-10 rounded-[3rem] group hover:translate-y-[-10px] transition-all duration-500">
                        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-rose-500 group-hover:to-orange-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-rose-500/10">
                            <Eye size={32} />
                        </div>
                        <div className="text-5xl font-black text-gray-900 tracking-tighter text-rose-600">{stats?.totalViews || 0}</div>
                        <div className="text-gray-400 font-black text-xs uppercase tracking-[0.2em] mt-2">Total Views</div>
                    </div>
                </div>

                <section className="glass-card rounded-[3rem] p-10 min-h-[500px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Job Management</h2>
                            <p className="text-gray-500 font-medium mt-1">Track and manage your listings with real-time analytics</p>
                        </div>

                        <div className="flex items-center space-x-3 w-full md:w-auto bg-gray-50/50 p-2 rounded-2xl border border-gray-100 backdrop-blur-sm">
                            <div className="relative flex-grow min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search Listings..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                                />
                            </div>
                            <button className="p-4 bg-white text-gray-400 rounded-xl hover:text-blue-600 border border-gray-100 shadow-sm transition-all hover:scale-105">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                        {filteredJobs?.map((job: any) => (
                            <div
                                key={job.id}
                                onClick={() => handleViewApplicants(job.id, job.title)}
                                className="group p-8 bg-white/50 hover:bg-white rounded-[2rem] border border-transparent hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-10 cursor-pointer animate-float-subtle"
                            >
                                <div className="flex items-center space-x-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                                        <div className="text-3xl font-black text-blue-600 italic tracking-tighter">{job.title[0]}</div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                        <div className="flex items-center space-x-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                            <span className="bg-gray-100 px-3 py-1 rounded-lg">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                                            <span className="text-blue-600">{job.job_type || 'Full-Time'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-16 text-center">
                                    <div>
                                        <div className="text-3xl font-black text-gray-900 mb-1">{job.applications_count || 0}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Applicants</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-gray-900 mb-1">{job.views_count || 0}</div>
                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Views</div>
                                    </div>
                                    <div>
                                        <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${job.status === 'active' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {job.status || 'Active'}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuJobId(openMenuJobId === job.id ? null : job.id);
                                        }}
                                        className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all"
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {openMenuJobId === job.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-10 overflow-hidden">
                                            {job.status !== 'active' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateStatus(job.id, 'active');
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-green-600"
                                                >
                                                    <CheckCircle size={16} />
                                                    <span>Set Active</span>
                                                </button>
                                            )}
                                            {job.status === 'active' && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUpdateStatus(job.id, 'paused');
                                                    }}
                                                    className="w-full text-left px-4 py-3 hover:bg-yellow-50 transition-colors flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-yellow-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>Pause Job</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmDeleteJobId(job.id);
                                                    setOpenMenuJobId(null);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-red-50 transition-colors flex items-center space-x-2 text-sm font-bold text-gray-700 hover:text-red-600 border-t border-gray-100"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                <span>Delete Job</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {(!filteredJobs || filteredJobs.length === 0) && (
                            <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-[2rem]">
                                {searchTerm ? 'No jobs found matching your search.' : 'No active job listings found. Create one to get started!'}
                            </div>
                        )}
                    </div>
                </section>

                {/* Delete Confirmation Dialog */}
                {confirmDeleteJobId && (
                    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                            <h3 className="text-2xl font-black text-gray-900 mb-4">Delete Job?</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this job? This action cannot be undone and all applications will be affected.</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setConfirmDeleteJobId(null)}
                                    disabled={isDeleting}
                                    className="px-6 py-3 font-bold text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteJob(confirmDeleteJobId)}
                                    disabled={isDeleting}
                                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Job'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerDashboard;
