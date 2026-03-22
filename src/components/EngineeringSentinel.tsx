import React from 'react';
import sentinelSchematic from '../assets/fig_node3_detail_v2.png';
import build1Schematic from '../assets/sentinel-build1-schematic.png';

type BuildTab = 'build1' | 'build2' | 'build3';

const EngineeringSentinel: React.FC = () => {
    const [showTechSheet, setShowTechSheet] = React.useState(false);
    const [activeBuild, setActiveBuild] = React.useState<BuildTab>('build1');

    return (
        <div className="flex flex-col h-full w-full bg-black text-slate-100 overflow-hidden relative">
            {/* Header */}
            <div className="flex-none border-b border-white/10 p-4 md:p-6 flex items-center justify-between bg-black z-10">
                <div>
                    <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2 md:gap-4 text-white">
                        <span className="text-[#3B82F6]">Node 01:</span> Sentinel™
                    </h2>
                    <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Precision Sensing Architecture</p>
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
                    <div className="flex flex-col items-center gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
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

                        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter uppercase text-center">
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

                        {/* Engineering Foundations */}
                        <div className="space-y-8 pt-6 border-t border-white/10 pt-12">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">Engineering Foundations</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Substrate Architecture</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        Built on a flexible polyimide substrate with embedded neodymium magnets and Hall-effect sensors for micron-scale circumference change detection. The C-shape form factor enables easy application while maintaining consistent sensor contact.
                                    </p>
                                </div>
                                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                    <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Sensing Methodology</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        nRF52840-based high-frequency acquisition pipeline tracking changes in magnetic field strength as the ring gap varies. PRI® vector correlation engine converts raw Hall-effect + PPG signals into abstracted physiological indices.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Hardware Architecture Panels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Hall Effect Architecture</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Sensing</span>
                                        <p className="text-sm text-slate-100 font-mono">High-Precision Hall-Effect</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Magnet</span>
                                        <p className="text-sm text-slate-100 font-mono">Neodymium (N52)</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Measures micron-scale circumference changes via magnetic field displacement. As the ring gap changes during physiological response, the Hall-effect sensor tracks magnetic field strength variations with sub-millimeter precision.
                                </p>
                            </div>

                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Gap Mechanics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Range</span>
                                        <p className="text-sm text-slate-100 font-mono">0 – 15mm Gap</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">Type</span>
                                        <p className="text-sm text-slate-100 font-mono">C-Shape Open Ring</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    C-shape form factor with calibrated gap enables passive displacement tracking. Zero mechanical resistance to blood inflow ensures natural physiological response is unimpeded.
                                </p>
                            </div>
                        </div>

                        {/* Mechanical Integration & Privacy */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Mechanical Integration</h4>
                                <ul className="text-xs text-slate-400 space-y-2">
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />IP68 sealed medical-grade silicone</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />Zero-port design (fully sealed)</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />Qi wireless induction charging</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />Overmolded electronics encapsulation</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl space-y-4">
                                <h4 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">Hardware-Level Privacy</h4>
                                <ul className="text-xs text-slate-400 space-y-2">
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />PRIsys™ controller — zero-knowledge abstraction</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />Silicon-level identity decoupling</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />No raw waveform output — indices only</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-[#3B82F6] rounded-full" />AES-128 hardware encryption</li>
                                </ul>
                            </div>
                        </div>

                        {/* Data Abstraction Pipeline */}
                        <div className="space-y-8 pt-6 border-t border-white/10 pt-12">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3B82F6]">Data Abstraction Pipeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {[
                                    { title: "Signal Acquisition", desc: "Passive capture of magnetic displacement and PPG signatures." },
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
                        <div className="flex-none bg-black border-b border-white/5">
                            <div className="p-6 md:p-8 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-2 w-2 bg-[#3B82F6] rounded-full animate-pulse shadow-[0_0_8px_#3B82F6]"></div>
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3B82F6]">Restricted Access // Node 01</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Technical Sheet</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-2 uppercase tracking-wide">NODE 01 // SENTINEL™ // HARDWARE BUILDS // METALLIC-BLUE</p>
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

                            {/* Build Tabs */}
                            <div className="flex px-6 md:px-8 gap-6 md:gap-8 border-t border-white/5">
                                <button
                                    onClick={() => setActiveBuild('build1')}
                                    className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeBuild === 'build1' ? 'text-[#3B82F6] border-[#3B82F6]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                >
                                    Build 1 — Alpha
                                </button>
                                <button
                                    onClick={() => setActiveBuild('build2')}
                                    className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeBuild === 'build2' ? 'text-[#3B82F6] border-[#3B82F6]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                >
                                    Build 2 — Beta
                                </button>
                                <button
                                    onClick={() => setActiveBuild('build3')}
                                    className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeBuild === 'build3' ? 'text-[#3B82F6] border-[#3B82F6]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                                >
                                    Build 3 — Production
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 bg-black">
                            {activeBuild === 'build1' ? (
                                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">

                                    {/* Primary Sensors */}
                                    <section className="space-y-8">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">01. Primary Sensors</h3>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {/* Expansion Sensing */}
                                            <div className="space-y-4 p-5 bg-white/[0.02] border border-white/5 hover:border-[#3B82F6]/30 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Expansion Sensing</h4>
                                                    <span className="text-[10px] text-[#3B82F6] font-mono">Hall-Effect + Magnet</span>
                                                </div>
                                                <div className="space-y-2 text-xs text-slate-400 font-mono">
                                                    <p>Neodymium magnet paired with high-precision Hall-effect sensor</p>
                                                    <ul className="space-y-1 opacity-80">
                                                        <li>• Micron-scale circumference change detection</li>
                                                        <li>• C-shape gap displacement tracking</li>
                                                        <li>• Zero mechanical resistance to expansion</li>
                                                        <li>• Sub-millimeter precision across full range</li>
                                                        <li>• Passive operation — no user input required</li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Blood Dynamics */}
                                            <div className="space-y-4 p-5 bg-white/[0.02] border border-white/5 hover:border-[#3B82F6]/30 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Blood Dynamics</h4>
                                                    <span className="text-[10px] text-[#3B82F6] font-mono">PPG Optical</span>
                                                </div>
                                                <div className="space-y-2 text-xs text-slate-400 font-mono">
                                                    <p>Single-wavelength reflective PPG (green spectrum)</p>
                                                    <ul className="space-y-1 opacity-80">
                                                        <li>• Flow amplitude trend measurement</li>
                                                        <li>• Recovery dynamics tracking</li>
                                                        <li>• Circulatory response correlation</li>
                                                        <li>• Low-power reflective implementation</li>
                                                        <li>• Validity gating via multi-sensor agreement</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Core Hardware Stack V1 */}
                                    <section className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">02. Core Hardware Stack (V1)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {/* Mechanical */}
                                            <div className="p-5 bg-slate-900 border border-white/10 space-y-4">
                                                <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest">Mechanical</h4>
                                                <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Form</span> <span className="text-white">C-Shape Ring</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Material</span> <span className="text-white">Medical Silicone</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Seal</span> <span className="text-white">IP68 Overmolded</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Weight</span> <span className="text-white">~12g</span></li>
                                                </ul>
                                            </div>

                                            {/* Hall / Magnet */}
                                            <div className="p-5 bg-slate-900 border border-white/10 space-y-4">
                                                <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest">Hall / Magnet</h4>
                                                <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Sensor</span> <span className="text-white">Linear Hall-Effect</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Magnet</span> <span className="text-white">N52 Neodymium</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Range</span> <span className="text-white">0–15mm Gap</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Resolution</span> <span className="text-white">Sub-mm</span></li>
                                                </ul>
                                            </div>

                                            {/* PPG */}
                                            <div className="p-5 bg-slate-900 border border-white/10 space-y-4">
                                                <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest">PPG Optical</h4>
                                                <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Type</span> <span className="text-white">Reflective PPG</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Wavelength</span> <span className="text-white">Green (525nm)</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Signal</span> <span className="text-white">Flow + Amplitude</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Power</span> <span className="text-white">Low-Power Burst</span></li>
                                                </ul>
                                            </div>

                                            {/* MCU */}
                                            <div className="p-5 bg-slate-900 border border-white/10 space-y-4">
                                                <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest">Compute & Comms</h4>
                                                <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>SoC</span> <span className="text-white">Nordic nRF52840</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Core</span> <span className="text-white">ARM Cortex-M4F</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Radio</span> <span className="text-white">BLE 5.0 LE</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Security</span> <span className="text-white">HW AES-128</span></li>
                                                </ul>
                                            </div>

                                            {/* Power */}
                                            <div className="p-5 bg-slate-900 border border-white/10 space-y-4">
                                                <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest">Power & Energy</h4>
                                                <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Battery</span> <span className="text-white">Li-Po Micro Pouch</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Capacity</span> <span className="text-white">~120mAh</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Charging</span> <span className="text-white">Qi Wireless (Rx)</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Target Life</span> <span className="text-white">24–48 Hours</span></li>
                                                </ul>
                                            </div>

                                            {/* Thermal */}
                                            <div className="p-5 bg-slate-900 border border-white/10 space-y-4">
                                                <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-widest">Thermal & Haptics</h4>
                                                <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Temp</span> <span className="text-white">Dual NTC Digital</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Grade</span> <span className="text-white">Clinical (0.1°C)</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Haptic</span> <span className="text-white">LRA Motor</span></li>
                                                    <li className="flex justify-between border-b border-white/5 pb-1"><span>Mode</span> <span className="text-white">Active Priming</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Sensory Index — System Outputs */}
                                    <section className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">03. Sensory Index — System Outputs</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {[
                                                { name: "Baseline Reference Score", concept: "Personal starting point derived from first 7–14 days of data." },
                                                { name: "Trend Direction Indicator", concept: "Directional shift marker — improving, stable, or declining." },
                                                { name: "Consistency Pattern", concept: "Night-to-night variability fingerprint." },
                                                { name: "Recovery Tracking", concept: "Post-event recovery slope analysis." },
                                                { name: "Validity Gate Score", concept: "Multi-sensor agreement confidence (Hall + PPG + Thermal)." }
                                            ].map((item, i) => (
                                                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 hover:border-[#3B82F6]/20 transition-colors">
                                                    <h5 className="font-bold text-white text-xs mb-2">{item.name}</h5>
                                                    <p className="text-[10px] text-slate-500 leading-relaxed">
                                                        <span className="text-[#3B82F6] font-bold">Core Concept:</span> {item.concept}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Strategic Roadmap */}
                                    <section className="space-y-6">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">04. Strategic Roadmap</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-5 bg-white/[0.02] border border-white/5 border-l-2 border-l-[#3B82F6]">
                                                <h4 className="text-[#3B82F6] font-black text-xs uppercase tracking-widest mb-3">Phase 2 — Signal Acquisition</h4>
                                                <ul className="text-[10px] text-slate-400 space-y-2 font-mono">
                                                    <li>• Hall-effect + PPG validation bench</li>
                                                    <li>• Firmware data pipeline (60Hz target)</li>
                                                    <li>• BLE packet overhead optimization</li>
                                                    <li>• Strain gauge drift calibration</li>
                                                </ul>
                                            </div>
                                            <div className="p-5 bg-white/[0.02] border border-white/5 border-l-2 border-l-[#3B82F6]/60">
                                                <h4 className="text-[#3B82F6]/80 font-black text-xs uppercase tracking-widest mb-3">Phase 3 — Physiology Indexing</h4>
                                                <ul className="text-[10px] text-slate-400 space-y-2 font-mono">
                                                    <li>• PRI® correlation engine development</li>
                                                    <li>• Baseline establishment algorithms</li>
                                                    <li>• Multi-sensor fusion refinement</li>
                                                    <li>• Clinical validation protocol design</li>
                                                </ul>
                                            </div>
                                            <div className="p-5 bg-white/[0.02] border border-white/5 border-l-2 border-l-[#3B82F6]/30">
                                                <h4 className="text-[#3B82F6]/60 font-black text-xs uppercase tracking-widest mb-3">Phase 4 — Productization</h4>
                                                <ul className="text-[10px] text-slate-400 space-y-2 font-mono">
                                                    <li>• Manufacturing design transfer</li>
                                                    <li>• Regulatory pathway clearance</li>
                                                    <li>• Consumer packaging & brand alignment</li>
                                                    <li>• Companion app final integration</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Moat */}
                                    <section className="p-6 bg-[#3B82F6]/5 border border-[#3B82F6]/20 rounded-xl">
                                        <h4 className="text-xs font-bold text-[#3B82F6] uppercase tracking-[0.2em] mb-3">Competitive Moat</h4>
                                        <p className="text-sm text-slate-300 leading-relaxed">
                                            <span className="font-bold text-white">Correlation Intelligence</span> — The defensible advantage is not the hardware alone, but the proprietary correlation engine that transforms raw Hall-effect displacement + PPG flow data into clinically meaningful, longitudinal physiological indices. This intelligence layer compounds with every user session.
                                        </p>
                                    </section>

                                    {/* Founder Wisdom */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/[0.02] border-l-4 border-l-amber-500 border border-white/5">
                                            <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3">⚠ The Real Secret</h4>
                                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                                "The hardware is the bait. The real value is in the longitudinal data model and the correlation intelligence that emerges from thousands of sessions across diverse physiology."
                                            </p>
                                        </div>
                                        <div className="p-6 bg-white/[0.02] border-l-4 border-l-red-500 border border-white/5">
                                            <h4 className="text-xs font-black text-red-500 uppercase tracking-widest mb-3">⚠ Critical Founder Advice</h4>
                                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                                "Do not over-engineer Build 1. Ship the simplest sensor stack that produces valid signal. Hall + PPG + Temp is enough. Everything else is Build 2+."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Build 1 Schematic */}
                                    <div className="mt-8 pt-8 border-t border-white/10">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-6 pb-2 text-center underline decoration-[#3B82F6]/50 underline-offset-8">Build 1 Schematic Reference</h4>
                                        <div className="w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-inner relative p-6">
                                            <img
                                                src={build1Schematic}
                                                className="w-full h-auto max-h-[800px] object-contain mx-auto"
                                                alt="Sentinel Build 1 Schematic"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Build 2 & 3 — CLASSIFIED */
                                <div className="flex-1 flex items-center justify-center min-h-[60vh] animate-in fade-in duration-500">
                                    <div className="text-center space-y-8 max-w-md">
                                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/5 border-2 border-red-500/20 mx-auto">
                                            <svg className="w-10 h-10 text-red-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v.01M12 12a2 2 0 100-4 2 2 0 000 4zm0 0v3m-6.364-5.364A9 9 0 1118.364 6.636 9 9 0 015.636 12.636z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">CLASSIFIED</h3>
                                            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-6">
                                                {activeBuild === 'build2' ? 'BUILD 2 — BETA HARDWARE' : 'BUILD 3 — PRODUCTION HARDWARE'}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-center gap-3">
                                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500/80">Access Level: Restricted</span>
                                            <div className="h-1.5 w-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                                            This hardware revision is under active development and restricted to authorized engineering personnel only.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex-none p-6 bg-black border-t border-white/5 flex justify-between items-center">
                            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-600">
                                <span>INTERNAL USE ONLY</span>
                                <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                <span>REF:NODE-01</span>
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
