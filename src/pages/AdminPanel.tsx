import { Shield, Activity, Database, Server, RefreshCw, BarChart3, AlertTriangle } from 'lucide-react';

const AdminPanel = () => {
    return (
        <div className="px-4 py-12 max-w-7xl mx-auto">
            <header className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tight flex items-center">
                        <Shield className="mr-4 text-rose-500" size={48} />
                        Overlord <span className="ml-2 text-gray-300">v4.0</span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg font-bold uppercase tracking-[0.3em]">System Intelligence Core</p>
                </div>
                <div className="flex items-center space-x-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-700 font-black text-xs uppercase tracking-widest">Mainframe Stable</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                <div className="group relative bg-gray-900 p-8 rounded-[2rem] shadow-2xl hover:scale-105 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-400"><Activity size={80} /></div>
                    <div className="relative z-10">
                        <div className="text-emerald-400 font-black text-4xl mb-1">99.9%</div>
                        <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">Uptime</div>
                    </div>
                </div>
                <div className="group relative bg-gray-900 p-8 rounded-[2rem] shadow-2xl hover:scale-105 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-400"><Database size={80} /></div>
                    <div className="relative z-10">
                        <div className="text-blue-400 font-black text-4xl mb-1">2.4 TB</div>
                        <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">Total Logs</div>
                    </div>
                </div>
                <div className="group relative bg-gray-900 p-8 rounded-[2rem] shadow-2xl hover:scale-105 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-purple-400"><Server size={80} /></div>
                    <div className="relative z-10">
                        <div className="text-purple-400 font-black text-4xl mb-1">12</div>
                        <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">Active nodes</div>
                    </div>
                </div>
                <div className="group relative bg-gray-900 p-8 rounded-[2rem] shadow-2xl hover:scale-105 transition-all overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-400"><BarChart3 size={80} /></div>
                    <div className="relative z-10">
                        <div className="text-rose-400 font-black text-4xl mb-1">45.2k</div>
                        <div className="text-gray-400 font-bold text-xs uppercase tracking-widest">Daily Events</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <section className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black text-gray-900">Security Audit Log</h2>
                        <button className="p-3 hover:bg-gray-50 rounded-2xl transition-all text-gray-400 hover:rotate-180 duration-500">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        {[
                            { event: 'Root access initiated', time: '2m ago', user: 'Admin_1', type: 'critical' },
                            { event: 'Database backup successful', time: '15m ago', user: 'System', type: 'info' },
                            { event: 'Failed login attempt', time: '1h ago', user: 'Guest_99', type: 'warning' },
                        ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-3 h-3 rounded-full ${log.type === 'critical' ? 'bg-rose-500' : log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                    <div>
                                        <div className="text-base font-bold text-gray-900">{log.event}</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Executor: {log.user}</div>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">{log.time}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-gray-900 rounded-[2.5rem] p-10 shadow-2xl text-white">
                    <h2 className="text-2xl font-black mb-8 flex items-center">
                        <AlertTriangle className="mr-3 text-amber-500" size={24} />
                        Live Feed
                    </h2>
                    <div className="font-mono text-xs space-y-4 opacity-80">
                        <p className="text-emerald-400">[info] Elasticsearch index synchronized</p>
                        <p className="text-blue-400">[query] search: {'{ terms: "React" }'}</p>
                        <p className="text-purple-400">[bullmq] job: send_alert_1029 completed</p>
                        <p className="text-rose-400">[warn] latency spike on node_3 (+45ms)</p>
                        <div className="pt-8 border-t border-gray-800">
                            <p className="text-gray-500 italic">// Monitoring active...</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminPanel;
