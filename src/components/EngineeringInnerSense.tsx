
import React, { useState } from 'react';

type TabKey = 'overview' | 'specs' | 'reference';

const EngineeringInnerSense: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    return (
        <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-[#080808]">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                        <span className="text-emerald-500">Node 03:</span> InnerSense™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Clinical Grade Sensing Architecture</p>
                </div>

                <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'overview' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Product Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'specs' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Technical Specs
                    </button>
                    <button
                        onClick={() => setActiveTab('reference')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'reference' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Eng Reference
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Internal Gradient Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(225, 29, 72, 0.15) 0%, transparent 40%)'
                    }}
                />

                <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-16">

                    {activeTab === 'overview' ? (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Product Hero */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-bold text-white leading-tight">
                                        Clinical-grade pelvic physiology signal acquisition.
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        InnerSense™ is a sealed, passive, intravaginal wearable designed to capture real pelvic physiology in everyday life. It prioritizes low-noise signal capture, comfort-stable geometry, and principled data abstraction for clinically defensible longitudinal monitoring.
                                    </p>
                                    <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-500 uppercase tracking-widest font-mono">
                                        <span className="px-3 py-1 border border-white/10 rounded">Non-Explicit</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Passive</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Continuous</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Sealed</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Low-Noise</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div
                                        className="flex justify-center"
                                        style={{
                                            maskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 55%)',
                                            WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 20%, transparent 55%)'
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.BASE_URL}innersense-realism.png?v=4`}
                                            alt="InnerSense Product"
                                            className="max-w-full h-[300px] object-contain opacity-100"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Why This Exists */}
                            <section className="space-y-6 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">Why This Exists</h3>
                                <p className="text-base text-slate-400 leading-relaxed max-w-4xl">
                                    Pelvic and vaginal health is often evaluated through snapshots—brief exams, isolated tests, and subjective descriptions—despite symptoms and physiologic shifts occurring across daily life. InnerSense™ is designed to measure longitudinal pelvic signal patterns with minimal user friction, enabling baseline modeling, change detection, and objective tracking of intervention outcomes over time.
                                </p>
                            </section>

                            {/* What It Measures */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">What It Measures</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { title: 'Pelvic Activity Dynamics', desc: 'Multi-zone internal activity patterns and variability across daily life.' },
                                        { title: 'Thermal Regulation', desc: 'Internal temperature trends, gradients, and recovery signatures.' },
                                        { title: 'Hydration / Moisture Patterns', desc: 'Relative tissue hydration and moisture context trends (non-lab, trend-based).' },
                                        { title: 'Contact & Stability Context', desc: 'Contact stability and placement consistency signals used for artifact rejection.' },
                                        { title: 'Baseline Drift', desc: 'Long-term physiologic shifts across weeks/months indicating improvement, degradation, or transition.' },
                                        { title: 'Response & Recovery Timing', desc: 'Onset, progression, and recovery characteristics across episodes or intervention windows.' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-colors">
                                            <h4 className="font-bold text-white mb-2">{item.title}</h4>
                                            <p className="text-sm text-slate-400">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Data Abstraction Pipeline */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">Data Abstraction Pipeline</h3>
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                    {[
                                        { step: '1. Signal Acquisition', loc: 'ON-DEVICE', desc: 'Capture raw multi-domain pelvic signals (activity, thermal, moisture/context).' },
                                        { step: '2. Context & Rejection', loc: 'ON-DEVICE', desc: 'Contact validation + motion/stability context to reduce false interpretation.' },
                                        { step: '3. Index Conversion', loc: 'ON-APP', desc: 'Normalization into abstract, time-series indices and curves.' },
                                        { step: '4. Profile Protection', loc: 'ENCRYPTION', desc: 'Encrypted storage and transmission of physiologic pattern data.' },
                                        { step: '5. Longitudinal Insight', loc: 'ANALYSIS', desc: 'Trend detection, baseline modeling, and intervention response signatures.' }
                                    ].map((step, i) => (
                                        <div key={i} className="p-4 border border-white/10 bg-white/[0.01] relative group hover:bg-white/[0.03] transition-colors flex flex-col h-full">
                                            <div className="text-[10px] text-rose-500 uppercase font-bold tracking-widest mb-1">{step.loc}</div>
                                            <div className="font-bold text-sm text-white mb-2">{step.step}</div>
                                            <div className="text-xs text-slate-500 leading-relaxed">{step.desc}</div>
                                            {i < 4 && (
                                                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700 z-10 bg-black rounded-full">
                                                    →
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    ) : activeTab === 'reference' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2 mb-6 text-center">Extended Sensing & Architecture Options (Engineer Reference)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Pelvic Activity / Pressure Options */}
                                <div className="space-y-4 p-4 bg-rose-500/[0.02] border border-rose-500/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400 border-b border-rose-900/40 pb-2">Pelvic Activity / Pressure Options</h4>
                                    <ul className="text-[11px] text-slate-400 space-y-2 font-mono">
                                        <li>• Capacitive pressure arrays (multi-zone)</li>
                                        <li>• FSR matrix layers</li>
                                        <li>• Piezo-resistive elements</li>
                                        <li>• Micro-pressure chamber (air/gel) + MEMS transducer</li>
                                        <li>• Hydrostatic displacement sensing (fluid channel)</li>
                                    </ul>
                                </div>

                                {/* Moisture / Tissue-State Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Moisture / Tissue-State Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Capacitive dielectric trend sensing</li>
                                        <li>• Humidity sensing modules (protected)</li>
                                        <li>• Bio-impedance (single or multi-frequency, experimental)</li>
                                        <li>• Contact impedance mapping (experimental)</li>
                                    </ul>
                                </div>

                                {/* Thermal Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Thermal Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Multi-point thermistors</li>
                                        <li>• Thermal gradient arrays</li>
                                        <li>• Heat flux sensing (experimental)</li>
                                    </ul>
                                </div>

                                {/* Stability / Context Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Stability / Context Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Capacitive proximity/contact validation</li>
                                        <li>• Micro-IMU duty-cycled context sensing</li>
                                        <li>• Pattern-based placement stability inference (software-first)</li>
                                    </ul>
                                </div>

                                {/* Power / Charging Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Power / Charging Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Resonant inductive charging</li>
                                        <li>• Magnetic alignment dock strategies</li>
                                        <li>• Dynamic power-gated sensor domains</li>
                                        <li>• Supercapacitor buffer (experimental)</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* System Definition */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">01. System Definition</h3>
                                <p className="text-lg text-slate-300 leading-relaxed font-light font-mono text-sm">
                                    InnerSense™ is a sealed intravaginal wearable sensing node built for passive, longitudinal pelvic physiology monitoring. The system emphasizes comfort-stable fit, low-power operation, and abstracted outputs suitable for clinical review and personal tracking without explicit visualization.
                                </p>
                            </section>

                            {/* Core Sensing Architecture */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">02. Core Sensing Architecture (Optimized)</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Pelvic Activity Sensing */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pelvic Activity Sensing</h4>
                                            <span className="text-[10px] text-rose-500 font-mono">Primary Domain</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Multi-zone pressure sensing (3–6 zones)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Capacitive pressure pads or FSR array</li>
                                                <li>• Radial distribution preferred over single-point</li>
                                                <li>• Adaptive sampling (baseline + burst)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Thermal Sensing */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thermal Sensing</h4>
                                            <span className="text-[10px] text-rose-500 font-mono">Context + Anchor</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Dual-point or tri-point temperature sensors</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Thermal gradients + recovery curves</li>
                                                <li>• Contact-temperature validation logic supported</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Moisture / Hydration Context */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Moisture / Hydration</h4>
                                            <span className="text-[10px] text-rose-500 font-mono">Trend-Based</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Humidity/moisture sensing (protected)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Sealed-adjacent design or protected vent</li>
                                                <li>• Capacitive moisture context sensing</li>
                                                <li>• Context + trend signatures</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Contact Validation */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Validation</h4>
                                            <span className="text-[10px] text-rose-500 font-mono">Stability Backbone</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Capacitive confirmation & Stability checks</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Pressure-pattern stability checks</li>
                                                <li>• Optional micro-motion sensing</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Optional */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Optional (If Feasible)</h4>
                                            <span className="text-[10px] text-slate-500 font-mono">Experimental</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Optical circulatory sensing (power gated)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Reflective optical sensing</li>
                                                <li>• Duty-cycled sampling in burst windows</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Detailed Specs Grid */}
                            <section className="space-y-4 pt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* 03. Power & Charging */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4 h-full">
                                        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest border-b border-white/5 pb-2">03. Power & Charging</h4>
                                        <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                            <li className="flex justify-between"><span>Battery Life</span> <span className="text-white">12–24h (Mixed)</span></li>
                                            <li className="flex justify-between"><span>Battery Type</span> <span className="text-white">Li-Po Micro Cell</span></li>
                                            <li className="flex justify-between"><span>Charging</span> <span className="text-white">Inductive (Sealed)</span></li>
                                            <li className="flex justify-between"><span>Protection</span> <span className="text-white">Thermal Envelope</span></li>
                                        </ul>
                                    </div>

                                    {/* 04. Electronics & Firmware */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4 h-full">
                                        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest border-b border-white/5 pb-2">04. Electronics & Firmware</h4>
                                        <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                            <li className="flex justify-between"><span>MCU / SoC</span> <span className="text-white">BLE SoC (nRF52+)</span></li>
                                            <li className="flex justify-between"><span>Sampling</span> <span className="text-white">Burst Scheduler</span></li>
                                            <li className="flex justify-between"><span>Alignment</span> <span className="text-white">Multi-sensor Sync</span></li>
                                            <li className="flex justify-between"><span>Update</span> <span className="text-white">OTA Support</span></li>
                                        </ul>
                                    </div>

                                    {/* 05. Output (Abstracted) */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4 h-full">
                                        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest border-b border-white/5 pb-2">05. Output (Abstracted)</h4>
                                        <ul className="text-[10px] space-y-2 font-mono text-slate-400">
                                            <li>• Pelvic Activity Trend Signature</li>
                                            <li>• Thermal Regulation Pattern</li>
                                            <li>• Hydration/Moisture Context Trend</li>
                                            <li>• Contact Stability Confidence</li>
                                            <li>• Baseline Drift Indicator</li>
                                            <li>• Episode Response & Recovery Curve</li>
                                        </ul>
                                        <div className="pt-2 text-[9px] text-rose-400 italic text-center">
                                            (No explicit visuals. No anatomical rendering.)
                                        </div>
                                    </div>
                                </div>
                            </section>

                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(225, 29, 72, 0.5);
                }
            ` }} />
        </div >
    );
};

export default EngineeringInnerSense;
