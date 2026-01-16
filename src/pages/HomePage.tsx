import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="relative overflow-hidden bg-white">
            {/* Background patterns */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
            <div className="absolute -top-24 -left-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl transition-transform duration-1000 animate-pulse" />

            <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-32 lg:pt-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in-up">
                            <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">The Future of Talent</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-gray-900 leading-[1.1] mb-8">
                            Find your next <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-purple-600">career milestone</span> today.
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
                            Join 2M+ professionals discovering opportunities at top-tier companies. Our AI-driven platform connects you with roles that perfectly match your ambitions.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                            <Link
                                to="/search"
                                className="group relative px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl hover:shadow-primary/20 flex items-center"
                            >
                                <span>Browse Jobs</span>
                                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all"
                            >
                                Post a Job
                            </Link>
                        </div>

                        {/* Trusted By */}
                        <div className="mt-16 pt-8 border-t border-gray-100">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted by industry leaders</p>
                            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all">
                                <span className="text-2xl font-black italic text-gray-400">GOOGLE</span>
                                <span className="text-2xl font-black italic text-gray-400">META</span>
                                <span className="text-2xl font-black italic text-gray-400">AMAZON</span>
                                <span className="text-2xl font-black italic text-gray-400">NETFLIX</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-transparent hover:border-primary/20 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">AI Search</h3>
                            <p className="text-gray-500 font-medium">Context-aware search that understands your skills beyond just keywords.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-transparent hover:border-primary/20 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Alerts</h3>
                            <p className="text-gray-500 font-medium">Real-time notifications via email and push when a match is found.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-transparent hover:border-primary/20 hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Secure High-Level</h3>
                            <p className="text-gray-500 font-medium">Your data is yours. Enterprise-grade security for your professional profile.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
