import React from 'react';
import elariaSchematic from '../assets/fig_node2_detail_v2.png';

const EngineeringElaria: React.FC = () => {
    const [showTechSheet, setShowTechSheet] = React.useState(false);

    // Hardcoded specs for Elaria (Node 03)
    const specs = [
        { label: "Pelvic Activity", value: "Multi-Zone Radial Pressure (6 Zones)" },
        { label: "Thermal Regulation", value: "Tri-Point Gradient Sensing" },
        { label: "Moisture Context", value: "Capacitive Tissue-Hydration Index" },
        { label: "Stability Verification", value: "Contact-Pattern Validation" },
        { label: "Power System", value: "Sealed Inductive Charging (Qi)" },
        { label: "Security", value: "Identity-Separated Signal Abstraction" }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-white text-slate-900 overflow-hidden relative">
            {/* Header */}
            <div className="flex-none border-b border-slate-200 p-6 flex items-center justify-between bg-white z-10">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 text-slate-900">
                        <span className="text-[#B76E79]">Node 03:</span> Elaria™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1 pl-1">Clinical Grade Intravaginal Sensing</p>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
                {/* Internal Gradient Background */}
                <div className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(183, 110, 121, 0.15) 0%, transparent 40%)'
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
                                src={`${import.meta.env.BASE_URL}Elaria White Background.jpg`}
                                alt="Elaria™ Architecture"
                                className="relative z-10 w-full h-full object-contain mix-blend-multiply opacity-100"
                            />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase text-center">
                            Elaria™
                        </h1>
                    </div>

                    {/* Content Grid */}
                    <div className="flex flex-col gap-16 pb-24">

                        {/* 1. Why Elaria Exists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600">
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#B76E79]">Why Elaria Exists</h3>
                                <p className="text-xl font-medium text-slate-900 leading-relaxed">
                                    Elaria™ provides clinical-grade longitudinal pelvic monitoring with minimal friction and zero explicit visualization.
                                </p>
                                <p className="leading-relaxed text-sm">
                                    Pelvic health is usually evaluated via snapshots. Elaria™ measures longitudinal patterns across daily life, enabling baseline modeling and objective tracking of intervention outcomes. It prioritizes low-noise signal capture and comfort-stable geometry.
                                </p>
                                <p className="leading-relaxed border-l-2 border-[#B76E79] pl-4 italic text-slate-500 text-sm">
                                    "Objective insight into the most private physiological shifts."
                                </p>
                            </div>

                            {/* 2. What It Measures */}
                            <div className="space-y-6 bg-slate-50 p-8 rounded-xl border border-slate-200 shadow-sm">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#B76E79]">What It Measures</h3>
                                <p className="text-slate-500 mb-4 text-sm">Generating high-resolution pelvic indices:</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900 text-sm">Activity Dynamics</span>
                                            <p className="text-xs text-slate-500">Multi-zone internal activity patterns across daily life.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900 text-sm">Thermal Regulation</span>
                                            <p className="text-xs text-slate-500">Internal temperature trends and recovery signatures.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900 text-sm">Hydration Context</span>
                                            <p className="text-xs text-slate-500">Trend-based tissue hydration and moisture context.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900 text-sm">Baseline Drift</span>
                                            <p className="text-xs text-slate-500">Long-term shifts indicating transition or improvement.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Data Abstraction Pipeline */}
                        <div className="space-y-8 pt-6 border-t border-slate-100 pt-12">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#B76E79]">Data Abstraction Pipeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {[
                                    { title: "Signal Acquisition", desc: "Multi-domain capture (Activity, Thermal, Moisture)." },
                                    { title: "Context Rejection", desc: "Artifact filtering and placement validation." },
                                    { title: "Index Conversion", desc: "Normalization into abstract time-series curves." },
                                    { title: "Profile Security", desc: "Encrypted storage and identity separation." },
                                    { title: "Longitudinal Insights", desc: "Trend detection and intervention signatures." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 p-5 rounded-lg border border-slate-200 hover:border-[#B76E79]/30 transition-colors group shadow-sm">
                                        <div className="text-[#B76E79] font-bold text-lg mb-2">0{i + 1}</div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-2 leading-tight group-hover:text-[#B76E79] transition-colors">{item.title}</h4>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 4. Core Sensing Architecture */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            <div className="p-6 bg-slate-50/50 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Radial Sensing Geometry</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Zones</span>
                                        <p className="text-sm text-slate-900 font-mono">6-Zone Array</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Distribution</span>
                                        <p className="text-sm text-slate-900 font-mono">360° Polled</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Sensing pads distributed around the sealed housing capture activity without favoring specific orientation.
                                </p>
                            </div>

                            <div className="p-6 bg-slate-50/50 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Thermal Anchor Array</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Points</span>
                                        <p className="text-sm text-slate-900 font-mono">3 Digital NTC</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold">Mode</span>
                                        <p className="text-sm text-slate-900 font-mono">Differential</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Multi-point temperature tracking derives internal regulatory trends and validates placement stability.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Technical Sheet Button */}
            <button
                onClick={() => setShowTechSheet(true)}
                className="fixed bottom-8 right-8 z-50 bg-[#B76E79] hover:bg-[#A65D68] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
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
                        className="absolute inset-0 bg-slate-500/40 backdrop-blur-md transition-opacity duration-500"
                        onClick={() => setShowTechSheet(false)}
                    />
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 zoom-in-95 border border-slate-200 duration-500">
                        {/* Modal Header */}
                        <div className="flex-none bg-slate-50 border-b border-slate-200 p-8 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 bg-[#B76E79] rounded-full animate-pulse shadow-[0_0_8px_#B76E79]"></div>
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">Restricted Access // Node 03</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Technical Specifications</h3>
                                <p className="text-xs text-slate-400 font-mono mt-2 uppercase tracking-wide">NODE 03 // ELARIA™ // REF-SHEET-03 // ROSE-GOLD</p>
                            </div>
                            <button
                                onClick={() => setShowTechSheet(false)}
                                className="group p-2 hover:bg-slate-200 rounded-full transition-all border border-transparent hover:border-slate-200"
                            >
                                <svg className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Left Column: Core Specs (5 cols) */}
                                <div className="lg:col-span-12 lg:grid lg:grid-cols-2 lg:gap-12 space-y-12 lg:space-y-0">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Hardware Architecture</h4>
                                        <div className="space-y-6">
                                            {specs.map((spec, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{spec.label}</span>
                                                    <span className="font-mono text-sm text-slate-700 font-medium border-l-2 border-[#B76E79]/30 pl-3">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-12">
                                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                            <div className="flex items-center gap-2 mb-3">
                                                <svg className="w-4 h-4 text-[#B76E79]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Patent Designation</h4>
                                            </div>
                                            <p className="text-sm text-slate-500 leading-relaxed italic">
                                                "Intravaginal Physiological Monitoring Device for Longitudinal Signal Tracking" (Node 03 Architecture).
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Innovation Stack</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
                                                    <h5 className="font-bold text-slate-900 text-xs mb-1">Sealed-PHY™</h5>
                                                    <p className="text-[10px] text-slate-500 leading-tight">Identity-separated hardware architecture with zero anatomical rendering.</p>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 shadow-sm">
                                                    <h5 className="font-bold text-slate-900 text-xs mb-1">Comfort-Stable™</h5>
                                                    <p className="text-[10px] text-slate-500 leading-tight">Optimized geometry for passive adherence across daily activities.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Internal Schematic Reference */}
                            <div className="mt-16 pt-8 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-2 text-center underline decoration-[#B76E79]/30 underline-offset-8">Internal Schematic Reference</h4>
                                <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative group p-6">
                                    <img
                                        src={elariaSchematic}
                                        className="w-full h-auto max-h-[800px] object-contain mx-auto mix-blend-multiply opacity-90"
                                        alt="Elaria Node 03 Schematic"
                                    />
                                </div>

                                <div className="mt-12">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Materials List (v1) // Secure Baseline</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {[
                                            {
                                                label: "Encapsulation",
                                                subCategory: "USP Class VI",
                                                value: ["Medical Silicone (Shore 00-30)"]
                                            },
                                            {
                                                label: "Integration",
                                                subCategory: "Substrate",
                                                value: ["Flexible Polyimide PCB"]
                                            },
                                            {
                                                label: "Power Source",
                                                subCategory: "Embedded",
                                                value: ["Li-Po Micro Pouch (Sealed)"]
                                            },
                                            {
                                                label: "Protection",
                                                value: ["Sealed IP68 Architecture"]
                                            }
                                        ].map((item, i) => (
                                            <div key={i} className="flex flex-col items-center text-center">
                                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">{item.label}</span>

                                                {item.subCategory && (
                                                    <span className="text-[8px] uppercase tracking-[0.2em] text-[#B76E79] font-black mb-1">
                                                        {item.subCategory}
                                                    </span>
                                                )}
                                                <div className="font-mono text-sm text-slate-700 font-black border-t-2 border-[#B76E79]/20 pt-2 w-full flex flex-col gap-1">
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
                        <div className="flex-none p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
                                <span>INTERNAL USE ONLY</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>REF:NODE-03</span>
                            </div>
                            <button
                                onClick={() => setShowTechSheet(false)}
                                className="w-full sm:w-auto px-8 py-3 bg-[#B76E79] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#A65D68] transition-colors shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 duration-300"
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
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(183, 110, 121, 0.3);
                }
            ` }} />
        </div>
    );
};

export default EngineeringElaria;
