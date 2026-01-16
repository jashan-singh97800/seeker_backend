import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectCurrentUser, logout } from '../features/auth/authSlice';

const MainLayout = () => {
    const user = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex items-center group">
                            <Link to="/" className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform shadow-lg">
                                    <span className="font-black text-xl italic">A</span>
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">Seeker</span>
                            </Link>
                            <div className="hidden sm:ml-12 sm:flex sm:space-x-8">
                                <Link to="/search" className="relative group px-1 py-1 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                                    Find Jobs
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                                </Link>
                                {user && (
                                    <Link to={user.role === 'employer' ? '/employer' : '/dashboard'} className="relative group px-1 py-1 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
                                        Dashboard
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-6">
                            {user ? (
                                <div className="flex items-center space-x-6">
                                    <Link to="/profile" className="flex items-center space-x-3 group">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold border-2 border-transparent group-hover:border-primary group-hover:bg-blue-50 group-hover:text-primary transition-all">
                                            {user?.email?.[0].toUpperCase() || 'U'}
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="text-sm font-black text-gray-900 leading-none mb-0.5">{user?.email?.split('@')[0] || 'User'}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.role || 'Guest'}</div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            dispatch(logout());
                                            navigate('/');
                                        }}
                                        className="h-9 px-4 rounded-full text-xs font-black uppercase tracking-widest text-rose-500 border-2 border-rose-50/50 hover:bg-rose-50 hover:border-rose-100 transition-all"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-4 py-2">
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-95"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-gray-50 border-t border-gray-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white">
                                    <span className="font-black text-base italic">A</span>
                                </div>
                                <span className="text-xl font-black tracking-tighter text-gray-900 uppercase">Seeker</span>
                            </div>
                            <p className="text-gray-400 text-sm font-medium leading-relaxed">
                                Empowering professionals to reach their peak. The world's most advanced career management platform.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Explore</h4>
                            <ul className="space-y-4">
                                <li><Link to="/search" className="text-sm font-bold text-gray-500 hover:text-primary">Browse Jobs</Link></li>
                                <li><Link to="/search" className="text-sm font-bold text-gray-500 hover:text-primary">Featured Skills</Link></li>
                                {user && (
                                    <li>
                                        <Link to="/profile" className="text-sm font-bold text-gray-500 hover:text-primary">
                                            Profile
                                        </Link>
                                    </li>
                                )}
                                {user?.role === 'job_seeker' && (
                                    <li>
                                        <Link to="/dashboard" className="text-sm font-bold text-gray-500 hover:text-primary">
                                            My Applications
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Company</h4>
                            <ul className="space-y-4">
                                <li><span className="text-sm font-bold text-gray-500 cursor-pointer hover:text-primary">About Us</span></li>
                                <li><span className="text-sm font-bold text-gray-500 cursor-pointer hover:text-primary">Privacy Policy</span></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-6">Support</h4>
                            <ul className="space-y-4">
                                <li><span className="text-sm font-bold text-gray-500 cursor-pointer hover:text-primary">Help Center</span></li>
                                <li><span className="text-sm font-bold text-gray-500 cursor-pointer hover:text-primary">Contact</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">© 2026 Seeker Platform. Built for the elite.</p>
                        <div className="flex space-x-4">
                            {/* Social icons placeholders */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
