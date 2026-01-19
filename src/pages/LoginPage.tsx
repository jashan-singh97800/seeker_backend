import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { useLoginMutation } from '../app/api/authApiSlice';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showRoleModal, setShowRoleModal] = useState(false);

    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await login({ email, password }).unwrap();
            dispatch(setCredentials(userData as any));
            setEmail('');
            setPassword('');

            const role = userData.user?.role;
            if (role === 'employer') {
                navigate('/employer');
            } else if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            if (!err?.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    };

    const handleGoogleLogin = (role: string) => {
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        window.location.href = `${baseUrl}/auth/google?role=${role}`;
    };

    return (
        <div className="min-h-screen bg-dashboard flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative z-10 border border-white/50">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 font-medium">Please enter your details to sign in</p>
                </div>

                {/* Google Login Button */}
                <button
                    onClick={() => setShowRoleModal(true)}
                    className="w-full mb-6 flex items-center justify-center space-x-3 bg-white border border-gray-200 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm"
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.24-2.24z"
                        />
                        <path
                            fill="#EA4335"
                            d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.09 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span>Sign in with Google</span>
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white/80 text-gray-500 font-medium">Or continue with email</span>
                    </div>
                </div>

                {errMsg && (
                    <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-center font-bold text-sm animate-shake">
                        {errMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full premium-gradient text-white py-5 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-500 font-bold text-sm">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                                setEmail('');
                                setPassword('');
                                setErrMsg('');
                            }}
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
                {/* Role Selection Modal for Google Login */}
                {showRoleModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Select Account Type</h3>
                                <p className="text-gray-500">How would you like to continue?</p>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleGoogleLogin('job_seeker')} // Backend default is job_seeker anyway, but good to be explicit
                                    className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-4 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900 group-hover:text-blue-600">Job Seeker</div>
                                        <div className="text-xs text-gray-500 font-medium">I'm looking for a job</div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleGoogleLogin('employer')}
                                    className="w-full p-4 rounded-2xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center space-x-4 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-gray-900 group-hover:text-purple-600">Employer</div>
                                        <div className="text-xs text-gray-500 font-medium">I'm hiring talent</div>
                                    </div>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowRoleModal(false)}
                                className="w-full mt-6 py-3 font-bold text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
