
import React, { useState } from 'react';

type TabKey = 'overview' | 'specs' | 'reference';

const EngineeringMantrix: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    return (
        <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-[#080808]">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                        <span className="text-emerald-500">Node 02:</span> Mantrix™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Clinical Grade Sensing Architecture</p>
                </div>

                <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Product Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'specs' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Technical Specs
                    </button>
                    <button
                        onClick={() => setActiveTab('reference')}
                        className={`px-6 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all ${activeTab === 'reference' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 40%)'
                    }}
                />

                <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-16">

                    {activeTab === 'overview' ? (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* OVERVIEW CONTENT PORTED FROM MantrixPage.tsx */}

                            {/* Product Hero */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-bold text-white leading-tight">
                                        Clinical-grade rigidity and physiological signal acquisition.
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        Designed to capture continuous, real-world erectile physiology using passive, non-invasive sensing and principled data abstraction.
                                    </p>
                                    <div className="pt-4 flex gap-4 text-xs text-slate-500 uppercase tracking-widest font-mono">
                                        <span className="px-3 py-1 border border-white/10 rounded">Non-Invasive</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Passive</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Continuous</span>
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
                                            src={`${import.meta.env.BASE_URL}mantrix-product.png`}
                                            alt="Mantrix Product"
                                            className="max-w-full h-auto opacity-90 drop-shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Why This Exists */}
                            <section className="space-y-6 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">Why This Exists</h3>
                                <p className="text-base text-slate-400 leading-relaxed max-w-4xl">
                                    Erectile dysfunction develops gradually, through changes in rigidity, stability, and response over time, yet it is typically evaluated using brief clinical tests, questionnaires, or artificial stimulation that capture only isolated moments. This makes early changes difficult to detect and long-term patterns hard to understand. Because erectile function is continuous and sensitive to real-world conditions, meaningful measurement requires passive, non-invasive sensing that operates without user input or visual anatomical capture. Mantrix was designed to meet clinical measurement standards first, while also enabling individuals to track erectile health, performance, and recovery over time as part of broader wellness monitoring.
                                </p>
                            </section>

                            {/* What It Measures */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">What It Measures</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <h4 className="font-bold text-white mb-2">Rigidity Dynamics</h4>
                                        <p className="text-sm text-slate-400">Changes in circumferential firmness during natural erectile response.</p>
                                    </div>
                                    <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <h4 className="font-bold text-white mb-2">Stability Over Time</h4>
                                        <p className="text-sm text-slate-400">The ability to maintain rigidity without rapid fluctuation or collapse.</p>
                                    </div>
                                    <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <h4 className="font-bold text-white mb-2">Response Timing</h4>
                                        <p className="text-sm text-slate-400">Onset, progression, and recovery characteristics across episodes.</p>
                                    </div>
                                    <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <h4 className="font-bold text-white mb-2">Variability Patterns</h4>
                                        <p className="text-sm text-slate-400">Night-to-night and context-dependent changes in rigidity behavior.</p>
                                    </div>
                                    <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <h4 className="font-bold text-white mb-2">Baseline Drift</h4>
                                        <p className="text-sm text-slate-400">Long-term shifts in erectile response that may indicate improvement, degradation, or recovery.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Signal Diagram / Data Flow */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">Data Abstraction Pipeline</h3>
                                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                                    {[
                                        { title: '1. Signal Acquisition', subtitle: 'On-Device', desc: 'Passive capture of circumferential changes.' },
                                        { title: '2. Raw Output', subtitle: 'Device → App', desc: 'Bluetooth LE transmission of encrypted sensor data.' },
                                        { title: '3. Index Conversion', subtitle: 'On-App', desc: 'Normalization into abstract time-series indices.' },
                                        { title: '4. Profile Protection', subtitle: 'Encryption', desc: 'Identity separation from physiological data.' },
                                        { title: '5. Longitudinal Insight', subtitle: 'Analysis', desc: 'Trend detection and stability mapping.' }
                                    ].map((step, i) => (
                                        <div key={i} className="flex-1 p-4 border border-white/10 bg-white/[0.01] relative group hover:bg-white/[0.03] transition-colors">
                                            <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest mb-1">{step.subtitle}</div>
                                            <div className="font-bold text-sm text-white mb-2">{step.title}</div>
                                            <div className="text-xs text-slate-500 leading-relaxed">{step.desc}</div>
                                            {i < 4 && (
                                                <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-700 z-10 bg-black">
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
                                {/* Pressure / Force */}
                                <div className="space-y-4 p-4 bg-emerald-500/[0.02] border border-emerald-500/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 border-b border-emerald-900/40 pb-2">Pressure / Force Measurement</h4>
                                    <ul className="text-[11px] text-slate-400 space-y-2 font-mono">
                                        <li>• Sealed micro-pressure chamber (air/gel)</li>
                                        <li>• Differential pressure transducers (MEMS)</li>
                                        <li>• Absolute pressure sensors (PSI/kPa range)</li>
                                        <li>• Capacitive pressure arrays</li>
                                        <li>• Piezo-resistive pressure elements</li>
                                        <li>• Piezoelectric force sensors</li>
                                        <li>• Hydrostatic sensing via displacement</li>
                                        <li>• Force-torque sensing ring topology</li>
                                        <li>• Load cell micro-elements (thin-film)</li>
                                    </ul>
                                </div>

                                {/* Circumferential */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Circumference & Expansion</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Printed stretch conductors (ETI traces)</li>
                                        <li>• Liquid metal strain channels</li>
                                        <li>• Carbon nanotube stretch sensors</li>
                                        <li>• Graphene-based strain films</li>
                                        <li>• Optical fiber strain sensing (micro-bend)</li>
                                        <li>• Capacitive ring expansion sensing</li>
                                        <li>• Inductive loop circumference sensing</li>
                                        <li>• Resistive elastomer strain layers</li>
                                        <li>• Multi-segment triangulation</li>
                                    </ul>
                                </div>

                                {/* Impedance */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Electrical & Impedance</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Bio-impedance spectroscopy (multi-freq)</li>
                                        <li>• Skin/tissue impedance measurement</li>
                                        <li>• Conductive contact impedance sensing</li>
                                        <li>• Differential impedance mapping</li>
                                        <li>• AC impedance tomography</li>
                                        <li>• Capacitive coupling matching</li>
                                    </ul>
                                </div>

                                {/* Optical */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Optical & Photonic</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Multi-wavelength PPG (RGB / IR)</li>
                                        <li>• Time-of-flight distance sensing</li>
                                        <li>• Optical deformation via reflectance</li>
                                        <li>• IR thermal photodiodes</li>
                                        <li>• Ambient light rejection systems</li>
                                    </ul>
                                </div>

                                {/* Motion */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Motion, Orientation & Stability</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• 9-axis IMU (with magnetometer)</li>
                                        <li>• High-resolution gyro (low-drift)</li>
                                        <li>• Micro-vibration sensing (piezo)</li>
                                        <li>• Slip detection via accelerometer var</li>
                                        <li>• Resonant frequency shift detection</li>
                                        <li>• Angular displacement sensing</li>
                                    </ul>
                                </div>

                                {/* Thermal */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Thermal Sensing Options</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• NTC thermistors (multi-point)</li>
                                        <li>• Thermal gradient sensing arrays</li>
                                        <li>• IR thermal sensing (contactless)</li>
                                        <li>• Heat flux sensors</li>
                                        <li>• Thermal response rate measurement</li>
                                    </ul>
                                </div>

                                {/* Power Systems */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Power & Energy Architecture</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Resonant wireless charging</li>
                                        <li>• Magnetic alignment charging dock</li>
                                        <li>• USB-C wired charging (sealed)</li>
                                        <li>• Supercapacitor hybrid buffering</li>
                                        <li>• Energy harvesting (motion/thermal)</li>
                                        <li>• Dynamic power-gated sensor domains</li>
                                    </ul>
                                </div>

                                {/* Electronics */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Substrate & Electronics</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Flexible PCB (FPCB) / Rigid-flex</li>
                                        <li>• Stretchable electronics substrate</li>
                                        <li>• Multi-layer polyimide stack</li>
                                        <li>• Shielded analog sensor lanes</li>
                                        <li>• EMI isolation zones</li>
                                        <li>• Solid-state micro-battery ready</li>
                                    </ul>
                                </div>

                                {/* Materials */}
                                <div className="space-y-4 p-4 bg-white/[0.02] border border-white/5">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 border-b border-white/10 pb-2">Materials & Integration</h4>
                                    <ul className="text-[11px] text-slate-500 space-y-2 font-mono">
                                        <li>• Conductive silicone overmolding</li>
                                        <li>• Embedded traces in elastomers</li>
                                        <li>• Hydrophobic sensor coatings</li>
                                        <li>• Antimicrobial surface treatments</li>
                                        <li>• Sensor-transparent encapsulation</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Firmware Hooks */}
                            <section className="p-6 bg-slate-900 border border-white/10">
                                <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4">Firmware & Data Handling (Dev Environment)</h4>
                                <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 text-[11px] text-slate-400 font-mono italic">
                                    <div>• [IRQ] Event-triggered burst sampling</div>
                                    <div>• [DMA] High-rate raw sensor buffering</div>
                                    <div>• [DSP] Local signal preprocessing</div>
                                    <div>• [TS] Domain timestamp synchronization</div>
                                    <div>• [FAIL] Fail-soft sensor degradation handling</div>
                                    <div>• [MUX] Dynamic sensor enable/disable</div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* TECHNICAL CONTENT PORTED FROM TechnicalBriefModal.tsx */}

                            {/* System Overview */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">01. System Definition</h3>
                                <p className="text-lg text-slate-300 leading-relaxed font-light font-mono text-sm">
                                    Mantrix™ is a sealed, non-explicit wearable sensing ring designed for continuous structural, circulatory, and stability measurement with minimal power draw and high signal reliability. The system prioritizes passive sensing, low-noise signal capture, and comfort-preserving geometry.
                                </p>
                            </section>

                            {/* Core Architecture Grid */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">02. Core Sensing Architecture</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pressure & Load</h4>
                                            <span className="text-[10px] text-emerald-500 font-mono">Capacitive</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Multi-zone capacitive pressure sensors (3–4 radial zones)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Low power consumption</li>
                                                <li>• High repeatability, minimal drift</li>
                                                <li>• Adaptive sampling burst cycles</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Circumferential Change</h4>
                                            <span className="text-[10px] text-emerald-500 font-mono">Strain</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Printed stretch conductors (serpentine geometry) on flexible substrate</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• No mechanical resistance to expansion</li>
                                                <li>• Stable over repeated strain cycles</li>
                                                <li>• Result: Abstracted expansion index</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Circulatory Sensing</h4>
                                            <span className="text-[10px] text-emerald-500 font-mono">Optical</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Single-wavelength reflective PPG (green)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Low-power reflective implementation</li>
                                                <li>• Measures amplitude and flow response trends</li>
                                                <li>• Recovery dynamics tracking</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thermal Sensing</h4>
                                            <span className="text-[10px] text-emerald-500 font-mono">Digital</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400 font-mono">
                                            <p>Dual-point digital temperature sensors</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Contact confirmation & validation</li>
                                                <li>• Thermal trend tracking</li>
                                                <li>• Intermittent wake capability</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Detailed Specs Table */}
                            <section className="space-y-4 pt-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">03. Technical Specifications</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Power */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4">
                                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Power & Energy</h4>
                                        <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Battery</span> <span className="text-white">Li-Po Micro Pouch</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Capacity</span> <span className="text-white">~120mAh</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Charging</span> <span className="text-white">Qi Wireless (Rx)</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Target Life</span> <span className="text-white">24-48 Hours</span></li>
                                        </ul>
                                    </div>

                                    {/* Compute */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4">
                                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Compute & Comms</h4>
                                        <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>SoC</span> <span className="text-white">Nordic nRF52840</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Core</span> <span className="text-white">ARM Cortex-M4F</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Radio</span> <span className="text-white">Bluetooth 5.0 LE</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Security</span> <span className="text-white">HW AES-128</span></li>
                                        </ul>
                                    </div>

                                    {/* Materials */}
                                    <div className="p-6 bg-slate-900 border border-white/10 space-y-4">
                                        <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Physical Build</h4>
                                        <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Rating</span> <span className="text-white">IP68</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Material</span> <span className="text-white">Medical Silicone</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Encapsulation</span> <span className="text-white">Overmolded</span></li>
                                            <li className="flex justify-between border-b border-white/5 pb-1"><span>Weight</span> <span className="text-white">~12g</span></li>
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
                    background: rgba(16, 185, 129, 0.5);
                }
            ` }} />
        </div >
    );
};

export default EngineeringMantrix;
