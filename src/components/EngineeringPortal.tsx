import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EngineeringNodesHub from './EngineeringNodesHub';
import EngineeringAppUI from './EngineeringAppUI';

export default function EngineeringPortal() {
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping paths to content components
    const isNodes = location.pathname.includes('/axis') ||
        location.pathname.includes('/mantrix') ||
        location.pathname.includes('/innersense') ||
        location.pathname.includes('/luminara') ||
        location.pathname.includes('/lumiere');
    const isAppUI = location.pathname.includes('/appui');

    const navItems = [
        { label: 'Node Ecosystem', path: '/engineering/axis', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50' },
        { label: 'App Interface', path: '/engineering/appui', color: 'bg-blue-500', shadow: 'shadow-blue-500/50' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex overflow-hidden font-sans">

            {/* Sidebar */}
            <aside className="w-72 border-r border-white/10 p-6 flex flex-col gap-10 bg-[#050505] flex-shrink-0 z-10">
                <div className="space-y-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 group text-sm"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span>Back to Landing</span>
                    </button>

                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Engineering Portal</h1>
                        <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">System Control v0.2</div>
                    </div>
                </div>

                <nav className="flex flex-col gap-3">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-2 pl-2">Active Modules</div>
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <button
                                key={item.label}
                                onClick={() => navigate(item.path)}
                                className={`group relative flex items-center justify-between w-full p-3 rounded-md border transition-all text-left ${isActive
                                    ? 'bg-white/10 border-white/20'
                                    : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <span className={`text-sm font-semibold transition-colors tracking-wide ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                    {item.label}
                                </span>
                                <div className={`w-1.5 h-1.5 rounded-full ${item.color} ${item.shadow} shadow-[0_0_5px] opacity-70 group-hover:opacity-100 transition-opacity`} />
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto">
                    <div className="p-4 rounded border border-white/5 bg-slate-900/50">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Dev Status</div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            System Online
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative flex bg-black/50">
                {isNodes ? (
                    <EngineeringNodesHub />
                ) : isAppUI ? (
                    <EngineeringAppUI />
                ) : (
                    <div className="flex-1 flex items-center justify-center p-12">
                        {/* Placeholder Empty State */}
                        <div className="text-center space-y-4 max-w-md relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
                                <span className="text-2xl opacity-20">⚡</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-300">Workspace Ready</h2>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Select a module from the sidebar to view detailed specifications, status, and engineering controls.
                            </p>
                        </div>

                        {/* Subtle overlay grid for tech feel */}
                        <div className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                                backgroundSize: '40px 40px'
                            }}
                        />
                    </div>
                )}
            </main>

        </div>
    );
}
