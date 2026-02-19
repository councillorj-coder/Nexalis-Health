import React from 'react';
import caliberSchematic from '../assets/fig_node1_detail_v2.png';

const EngineeringCaliber: React.FC = () => {
    const [showTechSheet, setShowTechSheet] = React.useState(false);

    // Hardcoded specs for Caliber (Node 01)
    const specs = [
        { label: "Displacement Sensor", value: "Optical Flow / IR Speckle" },
        { label: "Diameter Sensing", value: "Opposed Dual-Point ToF" },
        { label: "Scan Accuracy", value: "+/- 0.5mm (Stability Gated)" },
        { label: "User Guidance", value: "Closed-loop Haptic / Speed Gating" },
        { label: "Start Gate", value: "Reflective PPG (Tissue Validated)" },
        { label: "Connection", value: "BLE 5.2 (AES Encrypted)" }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-black text-slate-100 overflow-hidden relative">
            {/* Header */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-black z-10">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 text-white">
                        <span className="text-[#3B82F6]">Node 01:</span> Caliber™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Structural Footprint Profiling Architecture</p>
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
                                src={`${import.meta.env.BASE_URL}caliber-black-photo.jpg`}
                                alt="Caliber™ Architecture"
                                className="relative z-10 w-full h-full object-contain mix-blend-lighten opacity-80"
                            />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase">
                            Caliber™
                        </h1>
                    </div>

                    {/* Content Grid */}
                    <div className="flex flex-col gap-16 pb-24">

                        {/* 1. Why Caliber Exists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-300">
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">Why Caliber Exists</h3>
                                <p className="text-xl font-medium text-white leading-relaxed">
                                    Caliber exists to turn fit guesswork into data—generating a clean, abstract Fit Profile Curve that captures geometry without exposure.
                                </p>
                                <p className="leading-relaxed">
                                    Traditional sizing relies on static self-measurements that are often inaccurate and fail to capture real anatomical variation. Caliber™ creates a repeatable geometry signature that can be used for fit-class mapping and true product compatibility.
                                </p>
                                <p className="leading-relaxed border-l-2 border-[#3B82F6] pl-4 italic text-slate-400">
                                    "Fit isn't a measurement; it's a signature. We capture the signature to solve the alignment."
                                </p>
                            </div>

                            {/* 2. What It Gives The User */}
                            <div className="space-y-6 bg-white/5 p-8 rounded-xl border border-white/10">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">What It Gives The User</h3>
                                <p className="text-slate-400 mb-4">Caliber generates high-fidelity anatomical data with total privacy:</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white">Fit Profile Curve</span>
                                            <p className="text-sm text-slate-400">Continuous 3D-mapped surface geometry.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white">Taper Classification</span>
                                            <p className="text-sm text-slate-400">Categorical analysis of structural gradients.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white">Geometry Signature</span>
                                            <p className="text-sm text-slate-400">Non-graphic, abstract data for system pairing.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-white">Scan Stability index</span>
                                            <p className="text-sm text-slate-400">Confidence metric for data repeatability and quality.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Relation to Meridia */}
                        <div className="space-y-6 border-t border-white/10 pt-12 text-slate-300">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">Relation to Meridia™</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-2xl font-bold text-white">External Mapping → Internal Calibration</h4>
                                    <p className="leading-relaxed">
                                        Caliber and Meridia are the two primary pillars of the Nexalis ecosystem, representing the structural and the physiological baselines.
                                    </p>
                                    <ul className="space-y-3 pt-2">
                                        <li><span className="font-bold text-white">Caliber™ (Male):</span> Maps external structural geometry and "Geography".</li>
                                        <li><span className="font-bold text-white">Meridia™ (Female):</span> Maps internal comfort response and "Climate".</li>
                                    </ul>
                                    <p className="leading-relaxed pt-2">
                                        By correlating external fit signatures with internal comfort baselines, the system can achieve **Fit Harmony**—a level of compatibility previously impossible with manual measurement.
                                    </p>
                                </div>
                                <div className="bg-black border border-white/10 p-6 rounded-lg shadow-sm">
                                    <h5 className="font-bold text-white mb-4 border-b border-white/5 pb-2">Technical Compatibility Outcomes</h5>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-500">Outcome 01</span>
                                            <p className="font-semibold text-white">Cross-Node Correlation Index</p>
                                            <p className="text-sm text-slate-500">Geometry vs Comfort alignment</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-500">Outcome 02</span>
                                            <p className="font-semibold text-white">Stability Band Prediction</p>
                                            <p className="text-sm text-slate-500">Predictive overlap based on user baselines</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-500">Outcome 03</span>
                                            <p className="font-semibold text-white">Abstract Fitting Logic</p>
                                            <p className="text-sm text-slate-500">System-level pairing via anonymous signatures</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-6 italic">
                                        *Information sovereignty: Data is abstract, non-explicit, and user-controlled.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 4. How It Works */}
                        <div className="space-y-8 pt-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">How It Works // Profiling Loop</h3>
                            <p className="text-slate-400 max-w-3xl">Caliber utilizes a multi-modal sensing suite to capture continuous motion and geometry.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {[
                                    { title: "PPG Verification", desc: "Start-gate ensures scan only begins on valid tissue signature." },
                                    { title: "Optical Flow Glide", desc: "Tracks longitudinal displacement with high contrast resilience." },
                                    { title: "Dual-Point ToF", desc: "Opposed sensors derive diameter and taper profiles in real-time." },
                                    { title: "Haptic Guidance", desc: "Closed-loop feedback directs user speed and scan consistency." },
                                    { title: "Fit Curve Export", desc: "Generates an anonymous, high-fidelity geometry signature." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-5 rounded-lg border border-white/10 hover:border-[#3B82F6]/30 transition-colors group">
                                        <div className="text-[#3B82F6] font-bold text-lg mb-2">0{i + 1}</div>
                                        <h4 className="font-bold text-white text-sm mb-2 leading-tight group-hover:text-[#3B82F6] transition-colors">{item.title}</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
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
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3B82F6]">Restricted Access // Node 01</span>
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Technical Specifications</h3>
                                <p className="text-xs text-slate-500 font-mono mt-2 uppercase tracking-wide">NODE 01 // CALIBER™ // REF-SHEET-01 // METALLIC-BLUE</p>
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
                                <div className="lg:col-span-5 space-y-12">
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

                                    <div className="p-6 bg-white/[0.03] rounded-xl border border-white/5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">Patent Designation</h4>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Methods and Apparatus for "Structural Geometry Mapping and Taper Profiling without Visible Imaging" (Node 01 Architecture).
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Innovations (7 cols) */}
                                <div className="lg:col-span-7 space-y-12">
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Technical Innovations</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-white/[0.03] p-5 rounded-lg border border-white/5">
                                                <div className="text-[#3B82F6] font-mono text-xs mb-2">TECH-01</div>
                                                <h5 className="font-bold text-white mb-2">Camera-less Footprinting</h5>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    Derives high-fidelity 3D geometry signatures using IR Time-of-Flight and flow sensing, ensuring zero image capture.
                                                </p>
                                            </div>
                                            <div className="bg-white/[0.03] p-5 rounded-lg border border-white/5">
                                                <div className="text-[#3B82F6] font-mono text-xs mb-2">TECH-02</div>
                                                <h5 className="font-bold text-white mb-2">Displacement Gating</h5>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    Real-time validation of scan speed and stability ensuring only high-confidence data enters the Fit Profile curve.
                                                </p>
                                            </div>
                                            <div className="bg-white/[0.03] p-5 rounded-lg border border-white/5">
                                                <div className="text-[#3B82F6] font-mono text-xs mb-2">TECH-03</div>
                                                <h5 className="font-bold text-white mb-2">Tissue Liveness Verification</h5>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    Reflective PPG logic prevents inanimate object spoofing, protecting the integrity of global fit datasets.
                                                </p>
                                            </div>
                                            <div className="bg-white/[0.03] p-5 rounded-lg border border-white/5">
                                                <div className="text-[#3B82F6] font-mono text-xs mb-2">TECH-04</div>
                                                <h5 className="font-bold text-white mb-2">Abstract Profile Mapping</h5>
                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                    Output is a categorical "Geometry Hash" used for system compatibility rather than explicit sizing.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Output Vectors</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Longitudinal Fit Profile', 'Taper Gradient Hash', 'Cross-Node Compatibility Score', 'Scan Reliability Index', 'Structural Baseline Sync'].map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-medium rounded-md border border-white/10">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Internal Schematic Reference */}
                            <div className="mt-16 pt-8 border-t border-white/10">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 pb-2 text-center underline decoration-[#3B82F6]/50 underline-offset-8">Internal Schematic Reference</h4>
                                <div className="w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-inner relative group p-6">
                                    <img
                                        src={caliberSchematic}
                                        className="w-full h-auto max-h-[800px] object-contain mx-auto mix-blend-screen opacity-90"
                                        alt="Caliber Node 01 Schematic"
                                    />
                                </div>

                                <div className="mt-12">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8 text-center text-[#3B82F6]">Materials List (v1) // Secure Baseline</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {[
                                            {
                                                label: "Scanning Frame",
                                                subCategory: "Structural",
                                                value: ["PC-ABS / GF Nylon"]
                                            },
                                            {
                                                label: "Comfort Surfaces",
                                                subCategory: "Tactile",
                                                value: ["Medical-grade Silicone"]
                                            },
                                            {
                                                label: "Distance Sensing",
                                                subCategory: "Optical",
                                                value: ["TBD"]
                                            },
                                            {
                                                label: "Electronics",
                                                value: ["BLE 5.2 / IMU / ToF"]
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
                                <span>RESTRICTED</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span>INTERNAL USE ONLY</span>
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

export default EngineeringCaliber;
