import React from 'react';
import sentinelSchematic from '../assets/fig_node3_detail_v2.png';

const EngineeringSentinel: React.FC = () => {
    const [showTechSheet, setShowTechSheet] = React.useState(false);

    // Hardcoded specs for Sentinel (Node 02)
    const specs = [
        { label: "Rigidity Sensing", value: "Multi-Zone Capacitive Load" },
        { label: "Circumferential Strain", value: "Printed Serpentine Conductors" },
        { label: "Circulatory Monitor", value: "Reflective PPG (Green Spectrum)" },
        { label: "Thermal Baseline", value: "Dual-Point Digital NTC" },
        { label: "Power Management", value: "Adaptive Sampling / Burst Wake" },
        { label: "Security", value: "AES-128 Encryption / Identity Separation" }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-black text-slate-100 overflow-hidden relative">
            {/* Header */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-black z-10">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 text-white">
                        <span className="text-[#3B82F6]">Node 02:</span> Sentinel™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Clinical Grade Sensing Architecture</p>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
                {/* Internal Gradient Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 40%)'
                    }}
                />

                <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Hero Image & Title */}
                    <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative w-full max-w-2xl aspect-video flex items-center justify-center"
                            style={{
                                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 80%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 80%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
                                maskComposite: 'intersect',
                                WebkitMaskComposite: 'source-in'
                            }}
                        >
                            <img
                                src={`${import.meta.env.BASE_URL}mantrix-product.png`}
                                alt="Sentinel™ Architecture"
                                className="relative z-10 w-full h-full object-contain mix-blend-lighten opacity-80"
                            />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase text-center">
                            Sentinel™
                        </h1>
                    </div>

                    {/* Content Grid */}
                    <div className="flex flex-col gap-16 pb-24">

                        {/* 1. Why Sentinel Exists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-300">
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">Why Sentinel Exists</h3>
                                <p className="text-xl font-medium text-white leading-relaxed">
                                    Sentinel captures continuous, real-world physiology using passive, non-invasive sensing to detect shifts in baseline health.
                                </p>
                                <p className="leading-relaxed text-sm">
                                    Current clinical evaluations capture only isolated moments in artificial settings. Sentinel™ operates passively without user input, mapping long-term patterns in rigidity and stability that are otherwise invisible until they reach a symptomatic threshold.
                                </p>
                                <p className="leading-relaxed border-l-2 border-[#3B82F6] pl-4 italic text-slate-400 text-sm">
                                    "We provide the continuous data stream required for proactive physiological intelligence."
                                </p>
                            </div>

                            {/* 2. What It Measures */}
                            <div className="space-y-6 bg-white/5 p-8 rounded-xl border border-white/10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">What It Measures</h3>
                                <p className="text-slate-400 mb-4 text-sm">Sentinel generates high-resolution physiological indices:</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white text-sm">Rigidity Dynamics</span>
                                            <p className="text-xs text-slate-400">Firmness fluctuations during natural response cycles.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white text-sm">Stability Tracking</span>
                                            <p className="text-xs text-slate-400">Maintenance capability vs rapid baseline collapse.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white text-sm">Circulatory Response</span>
                                            <p className="text-xs text-slate-400">Flow amplitude trends and recovery timing.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white text-sm">Baseline Variance</span>
                                            <p className="text-xs text-slate-400">Long-term drift detection for systemic health analysis.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Data Abstraction Pipeline */}
                        <div className="space-y-8 pt-6 border-t border-white/10 pt-12">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">Data Abstraction Pipeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {[
                                    { title: "Signal Acquisition", desc: "Passive capture of circumferential and load signatures." },
                                    { title: "Raw Transmission", desc: "Encrypted burst transfer via BLE 5.2 protocol." },
                                    { title: "Index Conversion", desc: "Normalization into abstract physiological indices." },
                                    { title: "Profile Protection", desc: "Hardware-level identity separation from biometric data." },
                                    { title: "Longitudinal Mapping", desc: "Detection of subtle shifts in erectile baseline performance." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-5 rounded-lg border border-white/10 hover:border-[#3B82F6]/30 transition-colors group">
                                        <div className="text-[#3B82F6] font-bold text-lg mb-2">0{i + 1}</div>
                                        <h4 className="font-bold text-white text-sm mb-2 leading-tight group-hover:text-[#3B82F6] transition-colors">{item.title}</h4>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Core Sensing Architecture */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Capacitive Load Architecture</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Zones</span>
                                        <p className="text-sm text-slate-100 font-mono">4-Zone Radial</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Res.</span>
                                        <p className="text-sm text-slate-100 font-mono">12-bit CAP</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Independent capacitive sensors distributed around the ring circumference derive axial rigidity without mechanical binding.
                                </p>
                            </div>

                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Circumferential Strain</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Topology</span>
                                        <p className="text-sm text-slate-100 font-mono">Serpentine</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Range</span>
                                        <p className="text-sm text-slate-100 font-mono">0 - 45% Strain</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Printed conductors on flexible polyimide allow for unlimited natural expansion with zero resistance to blood inflow.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Technical Sheet Button */}
            <button
                onClick={() => setShowTechSheet(true)}
                className="fixed bottom-8 right-8 z-50 bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
            >
                <div className="grid grid-cols-2 gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-[1px]"></div>
                </div>
                <span className="font-bold tracking-widest text-xs uppercase">View Technical Sheet</span>
            </button>

            {/* Technical Sheet Modal */}
            {showTechSheet && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-500"
                        onClick={() => setShowTechSheet(false)}
                    />
                    <div className="bg-[#0A0A0A] w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 zoom-in-95 border border-white/10 duration-500">
                        {/* Modal Header */}
                        <div className="flex-none bg-black border-b border-white/5 p-8 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 bg-[#3B82F6] rounded-full animate-pulse shadow-[0_0_8px_#3B82F6]"></div>
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3B82F6]">Restricted Access // Node 02</span>
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Technical Specifications</h3>
                                <p className="text-xs text-slate-500 font-mono mt-2 uppercase tracking-wide">NODE 02 // SENTINEL™ // REF-SHEET-02 // METALLIC-BLUE</p>
                            </div>
                            <button
                                onClick={() => setShowTechSheet(false)}
                                className="group p-2 hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10"
                            >
                                <svg className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-black">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Left Column: Core Specs (5 cols) */}
                                <div className="lg:col-span-12 lg:grid lg:grid-cols-2 lg:gap-12 space-y-12 lg:space-y-0">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Hardware Architecture</h4>
                                        <div className="space-y-6">
                                            {specs.map((spec, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">{spec.label}</span>
                                                    <span className="font-mono text-sm text-slate-200 font-medium border-l-2 border-[#3B82F6]/30 pl-3">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="p-6 bg-white/[0.03] rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-3">
                                                <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Patent Designation</h4>
                                            </div>
                                            <p className="text-sm text-slate-400 leading-relaxed">
                                                "Biosensing Ring for Continuous Physiological Tracking and Data Abstraction" (Node 02 Architecture).
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Technical Innovations</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-white/[0.03] p-4 rounded-lg border border-white/5">
                                                    <h5 className="font-bold text-white text-xs mb-1">PRI® Core</h5>
                                                    <p className="text-[10px] text-slate-400 leading-tight">Passive Rigidity Indexing via Zone Load Correlation.</p>
                                                </div>
                                                <div className="bg-white/[0.03] p-4 rounded-lg border border-white/5">
                                                    <h5 className="font-bold text-white text-xs mb-1">Stealth-PHY™</h5>
                                                    <p className="text-[10px] text-slate-400 leading-tight">Hardware-level abstraction ensuring zero explicit image data.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Internal Schematic Reference */}
                            <div className="mt-16 pt-8 border-t border-white/10">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 pb-2 text-center underline decoration-[#3B82F6]/50 underline-offset-8">Internal Schematic Reference</h4>
                                <div className="w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-inner relative group p-6">
                                    <img
                                        src={sentinelSchematic}
                                        className="w-full h-auto max-h-[800px] object-contain mx-auto mix-blend-screen opacity-90"
                                        alt="Sentinel Node 02 Schematic"
                                    />
                                </div>

                                <div className="mt-12">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 text-center text-[#3B82F6]">Materials List (v1) // Secure Baseline</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {[
                                            {
                                                label: "Sensing Substrate",
                                                subCategory: "Physical",
                                                value: ["Medical-grade Silicone"]
                                            },
                                            {
                                                label: "Integration",
                                                subCategory: "Electronics",
                                                value: ["Flexible PCB / Polyimide"]
                                            },
                                            {
                                                label: "Power Source",
                                                subCategory: "Energy",
                                                value: ["120mAh Li-Po (Sealed)"]
                                            },
                                            {
                                                label: "Build Quality",
                                                value: ["Overmolded (IP68)"]
                                            }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col items-center text-center">
                                                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mb-2">{item.label}</span>

                                                {item.subCategory && (
                                                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#3B82F6] font-black mb-1">
                                                        {item.subCategory}
                                                    </span>
                                                )}
                                                <div className="font-mono text-sm text-slate-200 font-black border-t-2 border-[#3B82F6]/50 pt-2 w-full flex flex-col gap-1">
                                                    {item.value.map((v, j) => (
                                                        <span key={j}>{v}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex-none p-6 bg-black border-t border-white/5 flex justify-between items-center">
                            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600">
                                <span>INTERNAL USE ONLY</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span>REF:NODE-02</span>
                            </div>
                            <button
                                onClick={() => setShowTechSheet(false)}
                                className="w-full sm:w-auto px-8 py-3 bg-[#3B82F6] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#2563EB] transition-colors shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 duration-300"
                            >
                                Close Technical Sheet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.3);
                }
            ` }} />
        </div>
    );
};

export default EngineeringSentinel;
