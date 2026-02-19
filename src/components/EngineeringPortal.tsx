import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EngineeringNodesHub from './EngineeringNodesHub';
import EngineeringAppUI from './EngineeringAppUI';

export default function EngineeringPortal() {
    const navigate = useNavigate();
    const location = useLocation();

    // Mapping paths to content components
    const isNodes = location.pathname.includes('/compass') ||
        location.pathname.includes('/mantrix') ||
        location.pathname.includes('/innersense') ||
        location.pathname.includes('/meridia') ||
        location.pathname.includes('/caliber');
    const isAppUI = location.pathname.includes('/appui');

    const navItems = [
        { label: 'MERIDIA™', path: '/engineering/meridia', color: 'bg-rose-500', shadow: 'shadow-rose-500/50', status: 'CRITICAL' },
        { label: 'CALIBER™', path: '/engineering/caliber', color: 'bg-blue-500', shadow: 'shadow-blue-500/50', status: 'ACTIVE' },
        { label: 'SENTINEL™', path: '/engineering/mantrix', color: 'bg-emerald-500', shadow: 'shadow-emerald-500/50', status: 'STABLE' },
        { label: 'ELARIA™', path: '/engineering/innersense', color: 'bg-slate-500', shadow: 'shadow-white/20', status: 'QUEUE' },
        { label: 'COMPASS™', path: '/engineering/compass', color: 'bg-slate-600', shadow: 'shadow-white/20', status: 'QUEUE' },
        { label: 'App Interface', path: '/engineering/appui', color: 'bg-amber-500', shadow: 'shadow-amber-500/50', status: 'UTILITY' },
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
                                className={`group relative flex items-center justify-between w-full p-3 rounded-sm border-l-2 transition-all text-left mb-1 ${isActive
                                    ? `bg-white/10 ${item.color.replace('bg-', 'border-')}`
                                    : 'border-transparent hover:bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span className={`text-xs font-bold tracking-wider ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        {item.label}
                                    </span>
                                </div>
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
                    <div className="flex-1 flex items-center justify-center p-12 relative">
                        <div className="absolute top-12 right-12 text-right">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Patent Filed</div>
                            <div className="text-xl font-mono text-emerald-500 font-bold tracking-tight">FEB 02 2026</div>
                        </div>
                        {/* Placeholder Empty State */}
                        <div className="text-center space-y-4 max-w-md relative z-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4">
                                <span className="text-2xl opacity-20">⚡</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-300">Workspace Ready</h2>
                            <p className="text-sm text-slate-500 leading-relaxed mb-8">
                                Select a module from the sidebar to view detailed specifications, status, and engineering controls.
                            </p>

                            <div className="text-left border-t border-white/5 pt-12 space-y-6">
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-8 pl-2">Development Priority Queue</h3>
                                <div className="space-y-6 font-mono">
                                    <div className="flex items-center gap-8 group cursor-pointer" onClick={() => navigate('/engineering/meridia')}>
                                        <span className="text-7xl font-black text-rose-500/50 group-hover:text-rose-500 transition-colors">01</span>
                                        <div className="flex-1 border-b border-rose-500/20 pb-4">
                                            <div className="flex justify-between items-end">
                                                <span className="text-5xl font-black text-white tracking-tighter group-hover:text-rose-400 transition-colors">MERIDIA™</span>
                                                <span className="text-xs px-3 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold uppercase tracking-widest mb-2">Critical</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 group cursor-pointer" onClick={() => navigate('/engineering/caliber')}>
                                        <span className="text-6xl font-bold text-blue-500/40 group-hover:text-blue-500 transition-colors">02</span>
                                        <div className="flex-1 border-b border-blue-500/10 pb-3">
                                            <div className="flex justify-between items-end">
                                                <span className="text-4xl font-bold text-slate-200 tracking-tight group-hover:text-blue-400 transition-colors">CALIBER™</span>
                                                <span className="text-xs px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-500 font-bold uppercase tracking-widest mb-1.5">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 group cursor-pointer opacity-80 hover:opacity-100 transition-opacity" onClick={() => navigate('/engineering/mantrix')}>
                                        <span className="text-5xl font-semibold text-emerald-500/30 group-hover:text-emerald-500 transition-colors">03</span>
                                        <div className="flex-1 border-b border-emerald-500/10 pb-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-3xl font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">SENTINEL™</span>
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold uppercase tracking-widest mb-1">Stable</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity" onClick={() => navigate('/engineering/innersense')}>
                                        <span className="text-4xl font-medium text-slate-700 group-hover:text-slate-500 transition-colors">04</span>
                                        <div className="flex-1 border-b border-white/5 pb-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-2xl font-medium text-slate-500 group-hover:text-white transition-colors">ELARIA™</span>
                                                <span className="text-[10px] px-2 py-0.5 text-slate-600 font-bold uppercase tracking-widest mb-0.5">Queue</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-8 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity" onClick={() => navigate('/engineering/compass')}>
                                        <span className="text-3xl font-normal text-slate-800 group-hover:text-slate-500 transition-colors">05</span>
                                        <div className="flex-1 border-b border-white/5 pb-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xl font-normal text-slate-600 group-hover:text-white transition-colors">COMPASS™</span>
                                                <span className="text-[10px] px-2 py-0.5 text-slate-700 font-bold uppercase tracking-widest">Queue</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
