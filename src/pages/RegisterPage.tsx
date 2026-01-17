import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { useRegisterMutation } from '../app/api/authApiSlice';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('job_seeker');
    const [errMsg, setErrMsg] = useState('');

    const [register, { isLoading }] = useRegisterMutation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setErrMsg('');
    }, [email, password, role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = await register({ email, password, role }).unwrap();
            dispatch(setCredentials(userData as any));
            setEmail('');
            setPassword('');
            setRole('job_seeker');

            const userRole = userData.user?.role;
            if (userRole === 'employer') {
                navigate('/employer');
            } else if (userRole === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            if (!err?.status) {
                setErrMsg('No Server Response');
            } else if (err.status === 400) {
                setErrMsg('Invalid registration data');
            } else if (err.status === 409) {
                setErrMsg('Email already in use');
            } else {
                setErrMsg('Registration Failed');
            }
        }
    };

    return (
        <div className="min-h-screen bg-dashboard relative overflow-hidden flex items-center justify-center px-4">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-purple-400/10 blur-[100px] rounded-full"></div>

            <div className="glass-card p-12 rounded-[3xl] w-full max-w-md relative z-10 border-white/50 shadow-2xl">
                <div className="text-center mb-10">
                    <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                        Join <span className="text-gradient">Seeker</span>
                    </h2>
                    <p className="text-gray-500 font-medium italic">Begin your professional journey today</p>
                </div>

                {errMsg && (
                    <div className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-center font-bold text-sm animate-shake">
                        {errMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
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
                    <div className="space-y-2">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">I am a...</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-gray-900"
                        >
                            <option value="job_seeker">Job Seeker</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full premium-gradient text-white py-5 rounded-[2rem] font-black text-lg shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.4)] transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-gray-500 font-bold text-sm">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                                setEmail('');
                                setPassword('');
                                setErrMsg('');
                                setRole('job_seeker');
                            }}
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
