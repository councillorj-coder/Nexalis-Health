import { nodes } from '../../data/engineering-data';

interface NodePageProps {
    nodeId: string;
    onBack: () => void;
}

export default function NodePage({ nodeId, onBack }: NodePageProps) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Node not found</div>;

    const isMale = node.category === 'Male';
    const isFemale = node.category === 'Female';
    const isNeutral = node.category === 'Neutral';

    const accentColor = isMale
        ? { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20', fill: 'text-blue-500', pulse: 'bg-blue-400', gradient: 'from-blue-500 to-indigo-500' }
        : isFemale
            ? { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/30', glow: 'shadow-rose-500/20', fill: 'text-rose-500', pulse: 'bg-rose-400', gradient: 'from-rose-500 to-purple-500' }
            : { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20', fill: 'text-emerald-500', pulse: 'bg-emerald-400', gradient: 'from-emerald-500 to-teal-500' };

    const statusColor = node.status === 'Stable'
        ? { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' }
        : node.status === 'Beta'
            ? { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' }
            : node.status === 'Dev'
                ? { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' }
                : { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30' };

    return (
        <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className={`absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full ${accentColor.bg.replace('/15', '/05')} blur-[120px]`} />
                <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-500/[0.03] blur-[100px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '48px 48px'
                }} />
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 max-w-6xl mx-auto flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors duration-300"
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 group-hover:-translate-x-0.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                    </span>
                    <span className="font-medium">Back</span>
                </button>
                <div className={`px-3 py-1.5 rounded-full ${statusColor.bg} ${statusColor.border} border`}>
                    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${statusColor.text}`}>{node.status}</span>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 px-6 pt-12 pb-20 max-w-6xl mx-auto">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
                        <div className={`w-2 h-2 rounded-full ${accentColor.pulse} animate-pulse`} />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{node.formFactor}</span>
                        <div className="w-px h-3 bg-white/10" />
                        <span className={`text-[10px] font-bold uppercase tracking-[0.1em] ${accentColor.text}`}>{node.patentStatus}</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-6">
                        <span className="text-white">{node.name}</span>
                    </h1>

                    <p className={`text-lg md:text-xl ${accentColor.text} font-medium mb-6 tracking-tight`}>{node.tagline}</p>

                    <div className={`w-16 h-1 bg-gradient-to-r ${accentColor.gradient} rounded-full mb-10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]`} />

                    <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl">{node.description}</p>
                </div>
            </section>

            {/* Purpose Section */}
            <section className="relative z-10 px-6 pb-16 max-w-6xl mx-auto">
                <div className="p-8 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] backdrop-blur-sm">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-4">Why This Exists</h2>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">{node.purpose}</p>
                </div>
            </section>

            {/* Measurements + Outputs Grid */}
            <section className="relative z-10 px-6 pb-16 max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Key Measurements */}
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Technical Breakthroughs</h2>
                        <div className="space-y-2">
                            {node.innovations.map((inn, i) => (
                                <div
                                    key={i}
                                    className="group flex flex-col gap-1 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
                                >
                                    <h3 className={`text-sm font-bold ${accentColor.text} tracking-tight`}>
                                        {inn.split(':')[0]}
                                    </h3>
                                    <p className="text-sm text-slate-400 leading-snug">
                                        {inn.split(':')[1]}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Targets */}
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Clinical Specs</h2>
                        <div className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.01]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/[0.06]">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Param</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {node.specifications.map((spec, i) => (
                                        <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-xs font-bold text-slate-300">{spec.parameter}</div>
                                                <div className="text-[10px] text-slate-500">{spec.category}</div>
                                            </td>
                                            <td className={`px-6 py-4 text-xs font-black text-right ${accentColor.text} tracking-widest`}>
                                                {spec.value}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Original Measurements + Outputs */}
            <section className="relative z-10 px-6 pb-16 max-w-6xl mx-auto border-t border-white/[0.05] pt-16">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Measurable Domains</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {node.keyMeasurements.map((m, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                                >
                                    <div className={`w-1.5 h-1.5 rounded-full ${accentColor.pulse}`} />
                                    <span className="text-xs text-slate-400 font-medium">{m}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">Consumer Outputs</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {node.outputs.map((o, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${accentColor.bg} border ${accentColor.border}`}
                                >
                                    <svg className={`w-3.5 h-3.5 ${accentColor.text} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className={`text-xs ${accentColor.text} font-bold tracking-tight`}>{o}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Domains */}
            <section className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-6">Core Domains</h2>
                <div className="flex flex-wrap gap-3">
                    {node.domains.map((domain) => (
                        <div
                            key={domain}
                            className="px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-slate-400 uppercase tracking-[0.15em] hover:bg-white/[0.06] hover:border-white/10 hover:text-slate-300 transition-all duration-300 cursor-default"
                        >
                            {domain}
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-white/[0.05]">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 opacity-40">
                        <div className={`w-px h-4 ${accentColor.bg}`} />
                        <span className="text-[9px] uppercase tracking-[0.3em] text-white/50">Nexalis Health • {node.name} • Deep Disclosure Archive</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-start gap-2 opacity-40">
                            <svg className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-[10px] text-slate-600">Protocol Protected Integration</p>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10">
                            <span className="text-[8px] font-black text-slate-500 tracking-[0.1em]">NODE_ID :</span>
                            <span className={`text-[8px] font-black ${accentColor.text} tracking-[0.1em]`}>{node.id.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
