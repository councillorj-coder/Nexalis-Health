
import React, { useState } from 'react';

type TabKey = 'overview' | 'specs' | 'reference';

const EngineeringCompass: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    return (
        <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-[#080808]">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                        <span className="text-emerald-500">Node 05:</span> Compass™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Systemic Context Node</p>
                </div>

                <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'overview' ? 'bg-red-700 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Product Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'specs' ? 'bg-red-700 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Technical Specs
                    </button>
                    <button
                        onClick={() => setActiveTab('reference')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'reference' ? 'bg-red-700 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(220, 38, 38, 0.15) 0%, transparent 40%)'
                    }}
                />

                <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-16">

                    {activeTab === 'overview' ? (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Product Hero */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-bold text-white leading-tight">
                                        Systemic context node for longitudinal health interpretation.
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        Compass™ is the context anchor for the Nexalis system. It captures whole-body signals—cardiovascular load, recovery state, autonomic balance, and daily rhythm—so intimate-region markers can be interpreted with clarity. Compass™ converts “what happened to the body” into context, allowing both consumer and clinical insights to separate signal from noise.
                                    </p>
                                    <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-500 uppercase tracking-widest font-mono">
                                        <span className="px-3 py-1 border border-white/10 rounded">Context Anchor</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Low-Friction</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">All-Day</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Longitudinal</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Encrypted</span>
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
                                            src={`${import.meta.env.BASE_URL}compass-realistic.png?v=2`}
                                            alt="Compass Product"
                                            className="max-w-full h-[300px] object-contain opacity-100"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Why This Exists */}
                            <section className="space-y-6 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">Why This Exists</h3>
                                <p className="text-base text-slate-400 leading-relaxed max-w-4xl">
                                    Intimate-region physiology is highly sensitive to systemic context: sleep quality, stress load, medication timing, hydration, inflammation, exertion, and recovery. Without context, even accurate local sensing can be misread. Compass™ provides a stable reference layer that helps the Nexalis Health Intelligence Engine attribute changes correctly—distinguishing true physiologic shifts from temporary context effects.
                                </p>
                            </section>

                            {/* What It Measures */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">What It Measures</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { title: 'Cardio Load & Recovery', desc: 'Heart rate patterns and recovery behavior across rest and activity.' },
                                        { title: 'Autonomic Balance (HRV)', desc: 'Trend-level autonomic state markers to support recovery and stress modeling.' },
                                        { title: 'Daily Rhythm & Sleep Context', desc: 'Rest windows, stability of rhythm, and sleep-linked baseline anchoring.' },
                                        { title: 'Respiration Proxy (Context)', desc: 'Breathing-rate trend signatures (derived from motion/PPG patterns).' },
                                        { title: 'Temperature & Stress Context', desc: 'Peripheral temperature trends (or skin temp where feasible) for context correlation.' },
                                        { title: 'Motion & Activity State', desc: 'Activity classification and movement context for artifact rejection and load modeling.' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-colors">
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
                                        { step: '1. Signal Acquisition', loc: 'ON-DEVICE', desc: 'Capture systemic context signals continuously at low power.' },
                                        { step: '2. Artifact Filtering', loc: 'ON-DEVICE', desc: 'Remove motion corruption and poor-contact windows.' },
                                        { step: '3. Index Conversion', loc: 'ON-APP', desc: 'Transform signals into stable context indices and curves.' },
                                        { step: '4. Secure Storage', loc: 'ENCRYPTION', desc: 'Encrypt at rest and in transit; preserve long-term continuity.' },
                                        { step: '5. Context Fusion', loc: 'ANALYSIS', desc: 'Fuse context indices with Nexalis node signals for interpretation.' }
                                    ].map((step, i) => (
                                        <div key={i} className="p-4 border border-white/10 bg-white/[0.01] relative group hover:bg-white/[0.03] transition-colors flex flex-col h-full">
                                            <div className="text-[10px] text-red-500 uppercase font-bold tracking-widest mb-1">{step.loc}</div>
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
                                {/* Cardiovascular Options */}
                                <div className="space-y-4 p-4 bg-red-500/[0.02] border border-red-500/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400 border-b border-red-900/40 pb-2">Cardiovascular Options</h4>
                                    <ul className="text-[11px] text-slate-400 space-y-2 font-mono">
                                        <li>• Single wavelength reflective PPG (power-optimized)</li>
                                        <li>• Multi-wavelength PPG (robustness)</li>
                                        <li>• ECG (chest variant; highest fidelity)</li>
                                        <li>• Hybrid PPG + ECG (validation mode)</li>
                                    </ul>
                                </div>

                                {/* Autonomic / Stress Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Autonomic / Stress Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• HRV derived features (trend, stability)</li>
                                        <li>• EDA / skin conductance (experimental)</li>
                                        <li>• Respiratory inference (IMU + PPG fusion)</li>
                                    </ul>
                                </div>

                                {/* Temperature Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Temperature Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Skin temp (integrated)</li>
                                        <li>• Dual-point thermal gradient (experimental)</li>
                                        <li>• Ambient correction sensor (optional)</li>
                                    </ul>
                                </div>

                                {/* Power & Packaging Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Power & Packaging Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Inductive coil designs (ring or dock)</li>
                                        <li>• Coin cell vs Li-Po trade architecture</li>
                                        <li>• Dynamic sensor gating</li>
                                        <li>• On-device compression of raw segments</li>
                                    </ul>
                                </div>

                                {/* Sync & Time Options */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Sync & Time Alignment</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• BLE time sync protocol across nodes</li>
                                        <li>• Shared epoch timestamps</li>
                                        <li>• Session context tags</li>
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
                                    Compass™ is a small-form, all-day wearable designed to deliver high-consistency systemic context for the Nexalis ecosystem. It prioritizes reliable resting-state and sleep-state signal capture, low power consumption, and data abstraction.
                                </p>
                            </section>

                            {/* Form Factor Options */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">02. Form Factor Options</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 border border-white/10 bg-white/[0.02]">
                                        <h4 className="text-sm font-bold text-white mb-2">A) Ring Compass (Default)</h4>
                                        <ul className="text-xs text-slate-400 space-y-1 font-mono">
                                            <li>• Highest wear adherence</li>
                                            <li>• Strong sleep-state signal fidelity</li>
                                            <li>• Low-friction continuous context capture</li>
                                        </ul>
                                    </div>
                                    <div className="p-4 border border-white/10 bg-white/[0.02]">
                                        <h4 className="text-sm font-bold text-white mb-2">B) Over-the-Heart Compass (Clinical)</h4>
                                        <ul className="text-xs text-slate-400 space-y-1 font-mono">
                                            <li>• Higher-fidelity cardiac timing (ECG-grade)</li>
                                            <li>• More robust during exertion</li>
                                            <li>• Preferred for validation studies</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Core Sensing Architecture */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">03. Core Sensing Architecture (Optimized)</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Cardio */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cardiovascular</h4>
                                            <span className="text-[10px] text-red-500 font-mono">Primary</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Reflective PPG (optimized wavelength)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Heart rate + Context-level HRV</li>
                                                <li>• Contact-quality confidence scoring</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Motion */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Motion & Context</h4>
                                            <span className="text-[10px] text-red-500 font-mono">Required</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>6-axis IMU minimum</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Activity classification + Artifact tagging</li>
                                                <li>• Sleep/rest window inference</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Temperature */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Temperature</h4>
                                            <span className="text-[10px] text-red-500 font-mono">Context Anchor</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Skin temperature sensor</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Temperature trend signatures</li>
                                                <li>• Stress/Load correlation</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Optional */}
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 opacity-50 hover:opacity-100 transition-opacity">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Optional</h4>
                                            <span className="text-[10px] text-slate-500 font-mono">Feasibility</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>ECG, EDA, or SpO2</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• ECG (Chest variant only)</li>
                                                <li>• EDA (Power-cost sensitive)</li>
                                                <li>• SpO2 (Only if justified)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Detailed Specs Grid */}
                            <section className="space-y-4 pt-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* 04. Power & Charging */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4 h-full">
                                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest border-b border-white/5 pb-2">04. Power & Charging</h4>
                                        <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                            <li className="flex justify-between"><span>Battery Life</span> <span className="text-white">48–72h (Mixed)</span></li>
                                            <li className="flex justify-between"><span>Battery Type</span> <span className="text-white">Li-Po / Coin</span></li>
                                            <li className="flex justify-between"><span>Charging</span> <span className="text-white">Inductive</span></li>
                                            <li className="flex justify-between"><span>Protection</span> <span className="text-white">IC Mandatory</span></li>
                                        </ul>
                                    </div>

                                    {/* 05. Electronics & Firmware */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4 h-full">
                                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest border-b border-white/5 pb-2">05. Electronics & Firmware</h4>
                                        <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                            <li className="flex justify-between"><span>MCU</span> <span className="text-white">BLE SoC (nRF52+)</span></li>
                                            <li className="flex justify-between"><span>Sampling</span> <span className="text-white">Duty-Cycled</span></li>
                                            <li className="flex justify-between"><span>Artifacts</span> <span className="text-white">Classification</span></li>
                                            <li className="flex justify-between"><span>Update</span> <span className="text-white">OTA Support</span></li>
                                        </ul>
                                    </div>

                                    {/* 06. Output (Abstracted) */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4 h-full">
                                        <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest border-b border-white/5 pb-2">06. Output (Abstracted)</h4>
                                        <ul className="text-[10px] space-y-2 font-mono text-slate-400">
                                            <li>• Cardio Load Trend</li>
                                            <li>• Recovery Curve Signature</li>
                                            <li>• HRV Balance Trend</li>
                                            <li>• Sleep Context Index</li>
                                            <li>• Activity State Timeline</li>
                                            <li>• Temperature Context Trend</li>
                                        </ul>
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
                    background: rgba(220, 38, 38, 0.5);
                }
            ` }} />
        </div >
    );
};

export default EngineeringCompass;
