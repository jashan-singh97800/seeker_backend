import { useAppSelector } from '../app/hooks';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useGetUserStatsQuery } from '../app/api/authApiSlice';
import { useGetMyApplicationsQuery } from '../app/api/applicationsApiSlice';
import { AlertCircle, CheckCircle, Clock, Calendar, ArrowUpRight } from 'lucide-react';

const TrendingUpIcon = () => (
    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const JobSeekerDashboard = () => {
    const user = useAppSelector(selectCurrentUser);
    const { data: stats } = useGetUserStatsQuery();
    const { data: userApplications, isLoading: appsLoading } = useGetMyApplicationsQuery();

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'accepted': return { icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-50' };
            case 'rejected': return { icon: AlertCircle, color: 'text-rose-500', bgColor: 'bg-rose-50' };
            default: return { icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50' };
        }
    };

    return (
        <div className="min-h-screen bg-dashboard relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-400/10 blur-[100px] rounded-full"></div>

            <div className="px-4 py-12 max-w-7xl mx-auto relative z-10">
                <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-2 text-blue-600 font-black text-sm uppercase tracking-[0.3em] mb-4 bg-white/50 backdrop-blur-sm self-start px-3 py-1 rounded-full whitespace-nowrap">
                            <Calendar size={14} className="animate-bounce" />
                            <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <h1 className="text-6xl font-black text-gray-900 tracking-tighter">
                            Welcome back, <span className="text-gradient underline decoration-blue-200 decoration-8 underline-offset-8 decoration-skip-ink">{user?.email?.split('@')[0]}</span>
                        </h1>
                        <p className="text-gray-500 mt-6 text-xl font-medium">You have <span className="text-blue-600 font-black">3 active updates</span> regarding your applications.</p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="px-10 py-5 bg-white text-gray-900 border border-gray-100 rounded-[2rem] font-black shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center space-x-3">
                            <div className="bg-gray-100 p-2 rounded-xl"><ArrowUpRight size={20} /></div>
                            <span>Settings</span>
                        </button>
                        <button className="px-10 py-5 premium-gradient text-white rounded-[2rem] font-black shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95">Download CV</button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="group relative glass-card p-10 rounded-[3rem] hover:-translate-y-3 transition-all duration-500 overflow-hidden border-blue-50">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-blue-100/50 text-blue-600 rounded-2xl flex items-center justify-center mb-10 group-hover:premium-gradient group-hover:text-white transition-all shadow-inner">
                                <Clock size={32} />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">{stats?.totalApplications ?? 0}</div>
                            <div className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Applied Jobs</div>
                            <div className="mt-6 inline-flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                <TrendingUpIcon /> {stats?.recentActivity ?? '+0 this week'}
                            </div>
                        </div>
                    </div>

                    <div className="group relative glass-card p-10 rounded-[3rem] hover:-translate-y-3 transition-all duration-500 overflow-hidden border-purple-50">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-purple-100/50 text-purple-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-gradient-to-br group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white transition-all shadow-inner">
                                <CheckCircle size={32} />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2 tracking-tighter text-purple-600">{stats?.totalInterviews ?? 0}</div>
                            <div className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Interviews</div>
                            <div className="mt-6 inline-flex items-center text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                <TrendingUpIcon /> Ready for next
                            </div>
                        </div>
                    </div>

                    <div className="group relative glass-card p-10 rounded-[3rem] hover:-translate-y-3 transition-all duration-500 overflow-hidden border-rose-50">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-rose-100/50 text-rose-600 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-gradient-to-br group-hover:from-rose-600 group-hover:to-orange-600 group-hover:text-white transition-all shadow-inner">
                                <AlertCircle size={32} />
                            </div>
                            <div className="text-5xl font-black text-gray-900 mb-2 tracking-tighter text-rose-600">{stats?.profileScore ?? 0}%</div>
                            <div className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Profile Score</div>
                            <div className="mt-6 inline-flex items-center text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                {stats?.profileScore === 100 ? 'Profile complete' : 'Action required'}
                            </div>
                        </div>
                    </div>
                </div>

                <section className="glass-card rounded-[3.5rem] p-12 mb-12 min-h-[400px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Application Feed</h2>
                            <p className="text-gray-500 font-medium mt-1">Real-time tracking of your professional journey</p>
                        </div>
                        <div className="flex bg-gray-50/50 p-2 rounded-2xl border border-gray-100 backdrop-blur-sm">
                            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm">All</button>
                            <button className="px-6 py-3 text-gray-400 rounded-xl font-black text-xs uppercase tracking-widest hover:text-gray-600 transition-colors">Drafts</button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {appsLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <span className="font-black text-xs uppercase tracking-[0.2em]">Synchronizing Feed...</span>
                            </div>
                        ) : userApplications?.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                                <p className="text-xl font-black text-gray-900">No applications found.</p>
                                <p className="text-gray-500 font-medium mt-2">Your professional journey starts here. Explore opportunities!</p>
                            </div>
                        ) : (
                            userApplications?.map((app: any) => {
                                const { icon: StatusIcon, color, bgColor } = getStatusIcon(app.status);
                                return (
                                    <div key={app.id} className="group p-8 bg-white/50 hover:bg-white rounded-[2.5rem] border border-transparent hover:border-blue-100 hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center space-x-8">
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-blue-600 italic tracking-tighter shadow-inner group-hover:scale-110 transition-transform duration-500">
                                                {app.job?.company?.name?.[0] || 'J'}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{app.job?.title}</h3>
                                                <div className="flex items-center space-x-4 text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                                                    <span className="bg-gray-100 px-3 py-1 rounded-lg">{app.job?.company?.name}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
                                                    <span className="text-blue-600">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end gap-8">
                                            <span className={`flex items-center space-x-3 px-6 py-3 ${bgColor} ${color} rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest shadow-sm`}>
                                                <StatusIcon size={16} />
                                                <span>{app.status}</span>
                                            </span>
                                            <div className="w-14 h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:premium-gradient group-hover:text-white group-hover:border-transparent group-hover:scale-110 transition-all shadow-sm">
                                                <ArrowUpRight size={22} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};



export default JobSeekerDashboard;
