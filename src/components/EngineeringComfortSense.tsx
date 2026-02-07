
import React, { useState } from 'react';

type TabKey = 'overview' | 'v1_mapping' | 'v2_activation' | 'core_specs' | 'spine_design' | 'electronics' | 'open_questions';

const EngineeringComfortSense: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    return (
        <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-[#080808]">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                        <span className="text-emerald-500">Node 04:</span> ComfortSense™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Session-Based Internal Mapping</p>
                </div>

                <div className="flex gap-1 bg-white/5 p-1 rounded-lg overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('v1_mapping')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'v1_mapping' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        v1 Mapping
                    </button>
                    <button
                        onClick={() => setActiveTab('v2_activation')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'v2_activation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        v2 Activation
                    </button>
                    <button
                        onClick={() => setActiveTab('core_specs')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'core_specs' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Core Specs
                    </button>
                    <button
                        onClick={() => setActiveTab('spine_design')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'spine_design' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Spine Design
                    </button>
                    <button
                        onClick={() => setActiveTab('electronics')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'electronics' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Electronics
                    </button>
                    <button
                        onClick={() => setActiveTab('open_questions')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'open_questions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Open Questions
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Internal Gradient Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(79, 70, 229, 0.15) 0%, transparent 40%)'
                    }}
                />

                <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-16">

                    {activeTab === 'overview' ? (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Product Hero */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-bold text-white leading-tight">
                                        Session-based internal mapping wand for geometry + fitment intelligence.
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        ComfortSense™ is a session-based internal mapping node designed to capture repeatable pressure distribution signatures and a max-expansion index using a conforming, non-rigid spine. It outputs non-explicit, abstracted maps intended for longitudinal comparison and compatibility modeling—not anatomy.
                                    </p>
                                    <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-500 uppercase tracking-widest font-mono">
                                        <span className="px-3 py-1 border border-white/10 rounded">Session-Based</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Pressure Mapping</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Conforming Spine</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Non-Explicit</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Sealed</span>
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
                                            src="/comfortsense-photo.png"
                                            alt="ComfortSense Product"
                                            className="max-w-full h-[300px] object-contain opacity-100"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Why This Exists */}
                            <section className="space-y-6 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">Why This Exists</h3>
                                <p className="text-base text-slate-400 leading-relaxed max-w-4xl">
                                    Internal fit and comfort mechanics are currently inferred through subjective trial-and-error and inconsistent descriptions. ComfortSense™ exists to generate repeatable internal map signatures so changes can be tracked objectively across time and interventions—without explicit visualization or anatomy rendering.
                                </p>
                                <ul className="space-y-2 text-sm text-slate-400 list-disc pl-5 marker:text-indigo-500">
                                    <li>Repeatable mapping sessions (baseline and follow-ups)</li>
                                    <li>Non-rigid comfort-first form factor (conforming spine)</li>
                                    <li>Pressure-first measurement (highest signal value)</li>
                                    <li>Max expansion indexing via a tip ToF ranging element (“LiDAR”)</li>
                                </ul>
                            </section>

                            {/* What It Measures */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">What It Measures</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { title: 'Pressure Distribution Signature', desc: 'Multi-zone pressure map capturing distribution and uniformity.' },
                                        { title: 'Peak Zone Localization', desc: 'Identification of highest-load regions during standardized holds.' },
                                        { title: 'Stability & Confidence', desc: 'Contact stability scoring and artifact rejection windows.' },
                                        { title: 'Max Expansion Index (ToF Tip)', desc: 'Tip ranging index capturing maximum internal expansion in a controlled orientation.' },
                                        { title: 'Map Repeatability (Session Delta)', desc: 'Baseline vs follow-up comparison for drift and intervention outcomes.' },
                                        { title: 'Reactive Region Detection', desc: 'Region ranking based on strongest measured response within the session protocol.' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors">
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
                                        { step: '1. Session Capture', loc: 'ON-DEVICE', desc: 'Standardized sequence captures baseline map + expansion index.' },
                                        { step: '2. Validity Scoring', loc: 'ON-DEVICE', desc: 'Reject unstable contact windows and motion-corrupted frames.' },
                                        { step: '3. Feature Extraction', loc: 'ON-APP', desc: 'Convert raw readings into abstract map vectors and indices.' },
                                        { step: '4. Secure Storage', loc: 'ENCRYPTION', desc: 'Store encrypted signatures, not explicit representations.' },
                                        { step: '5. Longitudinal Comparison', loc: 'ANALYSIS', desc: 'Compare sessions to quantify drift and intervention outcomes.' }
                                    ].map((step, i) => (
                                        <div key={i} className="p-4 border border-white/10 bg-white/[0.01] relative group hover:bg-white/[0.03] transition-colors flex flex-col h-full">
                                            <div className="text-[10px] text-indigo-500 uppercase font-bold tracking-widest mb-1">{step.loc}</div>
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

                            {/* Outputs Summary */}
                            <section className="space-y-4 pt-12 border-t border-white/5">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Outputs (Overview-Level)</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        'Pressure Map Signature (abstract)',
                                        'Peak Zone Ranking',
                                        'Max Expansion Index (ToF)',
                                        'Stability/Confidence Score',
                                        'Session Delta Summary'
                                    ].map((tag, i) => (
                                        <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-xs text-slate-400 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </section>

                        </div>
                    ) : activeTab === 'v1_mapping' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* System Intent */}
                            <section className="space-y-6">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white">v1 Mapping</h3>
                                    <div className="text-xs text-indigo-400 font-mono border-l-2 border-indigo-500 pl-3">
                                        Session protocol (No Vibration) — credibility-first build
                                    </div>
                                </div>
                                <p className="text-lg text-slate-300 leading-relaxed font-light font-mono text-sm max-w-3xl">
                                    Capture a repeatable baseline map and a max-expansion index under standardized conditions using a conforming, non-rigid spine. This version is purely measurement-driven: no activation, no vibration.
                                </p>
                                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">No Actuation</span>
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Repeatability First</span>
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Pressure-Primary</span>
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">ToF Tip</span>
                                </div>
                            </section>

                            {/* v1 Session Sequence */}
                            <section className="space-y-8 pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold text-white">v1 Session Sequence (Protocol)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        { step: '01', title: 'Device Readiness', items: ['Dock removed / device awake', 'Self-check: pressure + ToF + temp', 'Session clock starts'] },
                                        { step: '02', title: 'Contact Establishment', items: ['Short stabilization window', 'Generate Contact Confidence Score', 'If confidence < threshold → prompt'] },
                                        { step: '03', title: 'Initial Map Capture', items: ['Capture multi-zone pressure map', 'Output: Pressure Dist. Sig (PRE)', 'Output: Peak Zone Ranking (PRE)'] },
                                        { step: '04', title: 'Controlled Sweep', items: ['Slow, standardized sweep phase', 'Output: Coverage Completeness Score', 'Used to improve repeatability'] },
                                        { step: '05', title: 'Max Expansion Index', items: ['Tip oriented into direction window', 'Capture ToF distance samples', 'Output: Max Expansion Index'] },
                                        { step: '06', title: 'Session Closeout', items: ['Summarize key signatures', 'Store encrypted session package'] }
                                    ].map((s, i) => (
                                        <div key={i} className="p-5 bg-white/[0.02] border border-white/5 flex flex-col gap-3 hover:border-indigo-500/20 transition-colors">
                                            <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                                                <span className="text-indigo-500 font-black text-sm">Step {s.step}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-200 text-sm">{s.title}</h4>
                                            <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4 marker:text-indigo-500/50">
                                                {s.items.map((item, j) => <li key={j}>{item}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* v1 Core Measurements */}
                            <section className="space-y-8 pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold text-white">v1 Core Measurements</h3>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-3 p-4 bg-indigo-900/[0.1] border border-indigo-500/20">
                                        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Pressure Map Vector</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Multi-zone array values time-aligned into an abstract map signature. Includes uniformity and distribution statistics alongside peak zone coordinates in an abstract grid.
                                        </p>
                                    </div>
                                    <div className="space-y-3 p-4 bg-indigo-900/[0.1] border border-indigo-500/20">
                                        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Max Expansion Index</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            ToF-derived max distance metric (normalized). Includes a confidence score based on signal stability during the capture window.
                                        </p>
                                    </div>
                                    <div className="space-y-3 p-4 bg-indigo-900/[0.1] border border-indigo-500/20">
                                        <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Stability & Validity</h4>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Contact confidence timeline and artifact flags (motion, slip, unstable contact) to ensure data acts as a valid baseline.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Outputs & Requirements */}
                            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">v1 Outputs (Abstracted)</h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Pressure Distribution Signature (PRE)',
                                            'Peak Zone Ranking (PRE)',
                                            'Uniformity / Asymmetry Markers',
                                            'Max Expansion Index (ToF)',
                                            'Contact Confidence Score',
                                            'Session Validity Grade'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">v1 Repeatability Controls</h3>
                                    <ul className="space-y-2 text-xs text-slate-400 font-light">
                                        <li>• Fixed timing windows for holds</li>
                                        <li>• Validity gating (minimum confidence thresholds)</li>
                                        <li>• Standardized sweep speed window</li>
                                        <li>• Normalization to per-user baseline vector</li>
                                        <li>• Consistent ToF orientation constraints</li>
                                    </ul>
                                </section>
                            </div>

                            {/* Design Constraints */}
                            <section className="space-y-4 pt-8 border-t border-white/5">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">v1 Design Constraints</h3>
                                <div className="p-4 border border-white/5 bg-white/[0.01] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
                                    <div>• Spine must conform without kinking</div>
                                    <div>• Pressure array stable in geometry</div>
                                    <div>• ToF window optically stable (no glare)</div>
                                    <div>• No exposed metallic elements on body-contact</div>
                                    <div>• Sealed and cleanable; session-based power</div>
                                </div>
                            </section>

                        </div>
                    ) : activeTab === 'v2_activation' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* System Intent & Badges */}
                            <section className="space-y-6">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white">v2 Activation Mapping</h3>
                                    <div className="text-xs text-indigo-400 font-mono border-l-2 border-indigo-500 pl-3">
                                        Session protocol (Micro-Vibration) — Phase 2 activation response
                                    </div>
                                </div>
                                <p className="text-lg text-slate-300 leading-relaxed font-light font-mono text-sm max-w-3xl">
                                    Add a controlled micro-vibration activation window to produce a measurable pre → post response delta. This is not for pleasure—it’s a standardized activation stimulus to reveal reactivity patterns, improve signal interpretability, and quantify intervention response.
                                </p>
                                <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Micro-Vibration</span>
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Pre/Post Delta</span>
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Reactivity Mapping</span>
                                    <span className="px-2 py-1 bg-white/5 rounded border border-white/5">Phase 2</span>
                                </div>
                            </section>

                            {/* v2 Session Sequence */}
                            <section className="space-y-8 pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold text-white">v2 Session Sequence (Protocol)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { step: '01', title: 'Device Readiness', items: ['Self-check: pressure + ToF + actuator', 'Confirm actuator domain isolated', 'Session clock starts'] },
                                        { step: '02', title: 'Contact Stab.', items: ['Stabilization window', 'Generate Contact Confidence Score', 'Reseat if confidence < threshold'] },
                                        { step: '03', title: 'Pre-Map Capture', items: ['Fixed hold window', 'Output: Pressure Dist. (PRE)', 'Output: Peak Zone (PRE)'] },
                                        { step: '04', title: 'Pre ToF Index', items: ['Fixed ToF window', 'Output: Max Exp. Index (PRE)'] },
                                        { step: '05', title: 'Activation (Vibe)', items: ['Duty-cycled micro-vibration burst', 'Fixed duration (short)', 'Artifact tagging enabled'] },
                                        { step: '06', title: 'Post-Map Capture', items: ['Immediate repeat of fixed hold', 'Output: Pressure Dist. (POST)', 'Output: Peak Zone (POST)'] },
                                        { step: '07', title: 'Post ToF Index', items: ['Repeat ToF window', 'Output: Max Exp. Index (POST)'] },
                                        { step: '08', title: 'Analysis', items: ['Compute deltas with gating', 'Store encrypted session package'] }
                                    ].map((s, i) => (
                                        <div key={i} className="p-4 bg-white/[0.02] border border-white/5 flex flex-col gap-2 hover:border-indigo-500/20 transition-colors">
                                            <div className="flex items-baseline justify-between border-b border-white/5 pb-2">
                                                <span className="text-indigo-500 font-black text-xs">Step {s.step}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-200 text-xs">{s.title}</h4>
                                            <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-3 marker:text-indigo-500/50">
                                                {s.items.map((item, j) => <li key={j}>{item}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Delta Outputs & Reactivity Logic */}
                            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">v2 Delta Outputs (Abstracted)</h3>
                                    <ul className="space-y-3">
                                        {[
                                            'ΔPressure Map (POST − PRE)',
                                            'ΔPeak Zone Shift (location/magnitude)',
                                            'Reactivity Region Locator (ranked)',
                                            'Response Timing Signature',
                                            'ΔMax Expansion Index (ToF POST − PRE)',
                                            'Session Validity Grade'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3 text-xs text-slate-300 font-mono">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="space-y-4 p-5 bg-indigo-900/[0.05] border border-indigo-500/20 rounded-sm">
                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Most Reactive Region Logic</h3>
                                    <div className="space-y-4 text-xs text-slate-400">
                                        <div>
                                            <strong className="text-slate-300 block mb-1">Inputs:</strong>
                                            Pre/post vectors, Confidence timeline, Artifact flags.
                                        </div>
                                        <div>
                                            <strong className="text-slate-300 block mb-1">Ranking Rules:</strong>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Exclude frames flagged for instability</li>
                                                <li>Compute per-zone delta metrics (peak delta, mean delta over stable window, persistence)</li>
                                                <li>Primary: highest persistent delta zone</li>
                                                <li>Secondary: strongest peak delta if persistence ties</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <strong className="text-slate-300 block mb-1">Output:</strong>
                                            Top-K zones with confidence scores.
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Activation Constraints */}
                            <section className="space-y-4 pt-8 border-t border-white/5">
                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Actuation Constraints & Guarantees</h3>
                                <div className="p-4 border border-white/5 bg-white/[0.01] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400 font-mono">
                                    <div>• Micro-vibration must be low amplitude, time bounded</div>
                                    <div>• Actuator power domain isolated from pressure front-end</div>
                                    <div>• Pressure sampling timing must avoid aliasing</div>
                                    <div>• Abort actuation if confidence drops below threshold</div>
                                    <div>• Must remain comparable to v1 for baseline mapping</div>
                                    <div>• Post-map window begins after defined "settle" delay</div>
                                </div>
                            </section>

                        </div>
                    ) : activeTab === 'core_specs' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Header */}
                            <section className="space-y-4">
                                <h3 className="text-3xl font-black text-white">Core Technical Specs</h3>
                                <div className="p-4 border border-indigo-500/30 bg-indigo-900/[0.1] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                                    <div className="space-y-2">
                                        <div className="text-indigo-400 font-bold uppercase">System Type</div>
                                        <div className="text-slate-300">Session-based internal mapping wand</div>
                                        <div className="text-indigo-400 font-bold uppercase mt-3">Primary Meas.</div>
                                        <div className="text-slate-300">Pressure mapping (multi-zone)</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-indigo-400 font-bold uppercase">Secondary Meas.</div>
                                        <div className="text-slate-300">Tip ToF ranging (“LiDAR”) for max expansion</div>
                                        <div className="text-indigo-400 font-bold uppercase mt-3">Actuation</div>
                                        <div className="text-slate-300">v1 none • v2 micro-vibration (Phase 2)</div>
                                    </div>
                                </div>
                            </section>

                            {/* 01. Form Factor & 02. Sensing Stack */}
                            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">01. Form Factor & Mechanical</h3>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white/[0.02] border border-white/5">
                                            <h4 className="text-xs font-bold text-slate-300 mb-1">Spine Architecture</h4>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">Conforming, non-rigid spine (anti-kink required). Designed for repeatable curvature without sharp bend points.</p>
                                        </div>
                                        <div className="p-3 bg-white/[0.02] border border-white/5">
                                            <h4 className="text-xs font-bold text-slate-300 mb-1">Exterior & Session Use</h4>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">Soft-touch medical silicone overmold. Fully cleanable/sealed. Battery life deprioritized for signal quality (session-based usage).</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">02. Core Sensing Stack</h3>
                                    <ul className="space-y-4">
                                        <li>
                                            <strong className="block text-xs text-indigo-400 mb-1">A) Pressure Mapping (Primary)</strong>
                                            <span className="text-[10px] text-slate-400 block">Flexible multi-zone array (8–24 zones). Radial/segment distribution preferred. High repeatability/low drift.</span>
                                        </li>
                                        <li>
                                            <strong className="block text-xs text-indigo-400 mb-1">B) ToF Tip (Max Expansion)</strong>
                                            <span className="text-[10px] text-slate-400 block">Time-of-flight ranging module behind optical window. Fixed-orientation sampling with confidence scoring.</span>
                                        </li>
                                        <li>
                                            <strong className="block text-xs text-indigo-400 mb-1">C) Stability & Thermal</strong>
                                            <span className="text-[10px] text-slate-400 block">Contact confidence via pressure pattern + capacitive. Dual-point temp sensing for context gating.</span>
                                        </li>
                                    </ul>
                                </section>
                            </div>

                            {/* 03. Actuation, 04. Electronics, 05. Power */}
                            <section className="space-y-8 pt-8 border-t border-white/5">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">03. Actuation (v2)</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">
                                            Micro-vibration module (low amp, duty-cycled). Fixed window inside protocol. Pre/post maps isolated from artifact. Aliasing avoidance required.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">04. Electronics</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">
                                            BLE SoC (Nordic nRF52+). Time-aligned sampling across domains. Local buffering for session. OTA update capability.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">05. Power & Charging</h3>
                                        <p className="text-[10px] text-slate-400 leading-relaxed">
                                            Session-based profile (clean rails &gt; battery life). Li-Po micro pouch. Dock-based charging preferred (inductive optional).
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* 06. Outputs & 07. Data Package */}
                            <section className="space-y-6 pt-8 border-t border-white/5">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">06. Abstracted Outputs & 07. Data Package</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-4 border border-white/5 bg-white/[0.01]">
                                        <h4 className="text-xs font-bold text-indigo-400 mb-2">v1 + v2 Outputs (Canonical)</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Pressure Dist. Sig (PRE/POST)', 'Peak Zone Ranking', 'Max Exp. Index (ToF)', 'Contact Confidence', 'Session Validity', 'ΔPressure Map', 'Reactive Region Locator', 'Response Timing'].map((t, i) => (
                                                <span key={i} className="px-2 py-1 bg-black border border-white/10 text-[10px] text-slate-500 rounded">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-4 border border-white/5 bg-white/[0.01]">
                                        <h4 className="text-xs font-bold text-indigo-400 mb-2">Encrypted Session Record</h4>
                                        <ul className="text-[10px] text-slate-400 space-y-1 list-disc pl-3">
                                            <li>Metadata (timestamp, protocol ver, validity)</li>
                                            <li>Pre/post measurement vectors</li>
                                            <li>ToF indices + stability timeline</li>
                                            <li>Derived indices (deltas, reactivity)</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                        </div>
                    ) : activeTab === 'spine_design' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Header */}
                            <section className="space-y-6">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white">Spine Design Reference</h3>
                                    <div className="text-xs text-indigo-400 font-mono border-l-2 border-indigo-500 pl-3">
                                        Conforming (non-rigid) session wand spine — repeatable, anti-kink architectures
                                    </div>
                                </div>
                                <p className="text-lg text-slate-300 leading-relaxed font-light font-mono text-sm max-w-3xl">
                                    A spine that conforms comfortably while keeping the pressure-mapping surface and internal electronics in a predictable geometry. The spine must bend smoothly (large radius), resist kinking, and maintain mapping repeatability session-to-session.
                                </p>
                            </section>

                            {/* Spine Architecture Options */}
                            <section className="space-y-8 pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold text-white">Spine Architecture Options</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors">
                                        <h4 className="text-lg font-bold text-indigo-400 mb-4">Option 1: Continuous Flex Backbone</h4>
                                        <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                                            <p><strong>Concept:</strong> A thin, continuous backbone (polymer spring ribbon) embedded inside silicone.</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Overmolded so contact surface remains uniformly soft</li>
                                                <li>Flex PCB bonded near neutral axis to reduce shear</li>
                                                <li>Ensures smooth, predictable curvature</li>
                                                <li>Minimal mechanical complexity</li>
                                            </ul>
                                            <div className="p-3 bg-black/20 border border-white/5 text-[10px] font-mono mt-4">
                                                CRITICAL: Ensure no localized stiffness steps. Use anti-kink geometry (wide ribbon).
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-colors">
                                        <h4 className="text-lg font-bold text-indigo-400 mb-4">Option 2: Segmented “Vertebrae” Spine</h4>
                                        <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                                            <p><strong>Concept:</strong> Soft interlocking segments that allow bending while preventing sharp local folds.</p>
                                            <ul className="list-disc pl-4 space-y-1">
                                                <li>Vertebrae segments embedded in silicone with elastomer links</li>
                                                <li>Segment interfaces limit local curvature</li>
                                                <li>Excellent anti-kink protection</li>
                                                <li>Isolates ToF tip zone from excessive bending</li>
                                            </ul>
                                            <div className="p-3 bg-black/20 border border-white/5 text-[10px] font-mono mt-4">
                                                CRITICAL: Segments must not telegraph as ridges. Uniform outer softness required.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Spine Stack Placement Rules */}
                            <section className="space-y-8 pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold text-white">Spine Stack Placement Rules (Non-negotiables)</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { title: '1) Stable Sensor Plane', desc: 'Pressure array must see consistent contact mechanics. Avoid torsional twist.' },
                                        { title: '2) Neutral-Axis Placement', desc: 'Place flex PCB near neutral axis to reduce strain cycling and drift.' },
                                        { title: '3) Anti-Kink Safeguard', desc: 'Enforce minimum bend radius. Kink = false peaks and flex failure.' },
                                        { title: '4) Controlled Tip Zone', desc: 'Predictable orientation for ToF during capture. Local stiffness gradient.' }
                                    ].map((rule, i) => (
                                        <div key={i} className="p-4 bg-indigo-900/[0.05] border border-indigo-500/20">
                                            <h4 className="font-bold text-indigo-400 text-xs mb-2">{rule.title}</h4>
                                            <p className="text-[10px] text-slate-400 leading-relaxed">{rule.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Materials, Build & Validation */}
                            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Materials & Build Notes</h3>
                                    <ul className="space-y-3 text-xs text-slate-400">
                                        <li>
                                            <strong className="text-slate-200">Overmold:</strong> Medical-grade silicone, consistent durometer. Uniform surface finish.
                                        </li>
                                        <li>
                                            <strong className="text-slate-200">Bonding:</strong> Sensor skin must not delaminate. Avoid adhesive creep.
                                        </li>
                                        <li>
                                            <strong className="text-slate-200">Flex Durability:</strong> Strain relief at PCB transitions. No sharp corners.
                                        </li>
                                    </ul>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Spine Validation Checklist</h3>
                                    <div className="p-4 border border-white/5 bg-white/[0.01] space-y-2">
                                        {[
                                            'Minimum bend radius compliance',
                                            'Repeatability of pressure maps (10+ sessions)',
                                            'No ridge/hard-point transmission to outer skin',
                                            'Flex cycling endurance test',
                                            'Tip ToF stability during controlled window'
                                        ].map((check, i) => (
                                            <div key={i} className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                                <div className="w-3 h-3 border border-indigo-500/50 rounded-sm" />
                                                {check}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                        </div>
                    ) : activeTab === 'electronics' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Header */}
                            <section className="space-y-6">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white">Internal Electronics Reference</h3>
                                    <div className="text-xs text-indigo-400 font-mono border-l-2 border-indigo-500 pl-3">
                                        Pressure-first mapping wand — clean analog, stable ToF, isolated actuation (v2)
                                    </div>
                                </div>
                                <p className="text-lg text-slate-300 leading-relaxed font-light font-mono text-sm max-w-3xl">
                                    Deliver high-repeatability pressure maps with minimal drift/noise, while integrating a ToF tip for max-expansion indexing. Battery life is secondary; signal integrity is primary (pressure domain must be the “cleanest” rail).
                                </p>
                            </section>

                            {/* Domains & Architecture */}
                            <section className="space-y-8 pt-8 border-t border-white/5">
                                <h3 className="text-xl font-bold text-white">Electronics Architecture (Domains)</h3>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { name: 'Analog Domain', desc: 'Pressure Front-End (Cleanest)', color: 'border-indigo-500 text-indigo-400' },
                                        { name: 'Digital Domain', desc: 'MCU + Storage + Timing', color: 'border-white/20 text-slate-300' },
                                        { name: 'ToF Domain', desc: 'Optical Module + I2C/SPI', color: 'border-white/20 text-slate-300' },
                                        { name: 'Actuation Domain', desc: 'Isolated Power + Driver (v2)', color: 'border-white/20 text-slate-300' },
                                        { name: 'Power Domain', desc: 'Dock-First Charging', color: 'border-white/20 text-slate-300' }
                                    ].map((d, i) => (
                                        <div key={i} className={`p-4 border ${d.color} bg-white/[0.02] rounded-sm flex flex-col gap-1 min-w-[200px]`}>
                                            <span className="text-xs font-bold uppercase tracking-wider">{d.name}</span>
                                            <span className="text-[10px] opacity-70">{d.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Sensing Stacks */}
                            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">A) Pressure Mapping Stack (Primary)</h3>
                                    <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                                        <p><strong>Implementation:</strong> Flexible capacitive pressure array (8–24 zones) via flex PCB. Readout via CDC or multiplexed charge timing.</p>
                                        <div className="p-3 bg-indigo-900/[0.1] border border-indigo-500/20 space-y-2">
                                            <div className="font-bold text-indigo-400">Engineering Requirements</div>
                                            <ul className="list-disc pl-3 space-y-1">
                                                <li>Driven shield behind array to reduce coupling</li>
                                                <li>Stable reference & temperature compensation</li>
                                                <li>Per-zone calibration (offset + gain)</li>
                                                <li>Drift control: baseline tracking only during stable windows</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">B) ToF Tip (“LiDAR”) Integration</h3>
                                    <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                                        <p><strong>Rules:</strong> Dedicated optical window with light baffling. Fixed geometry relative to tip.</p>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 space-y-2">
                                            <div className="font-bold text-slate-300">Electrical & Protocol</div>
                                            <ul className="list-disc pl-3 space-y-1">
                                                <li>Separate power filtering (LC + local decoupling)</li>
                                                <li>Bus integrity: short traces, good pullups</li>
                                                <li>Capture in fixed window only (no motion)</li>
                                                <li>Confidence scoring via return stability</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* MCU, Actuation, Power */}
                            <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-white/5">
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">C) MCU & Firmware</h3>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        BLE SoC (nRF52+). precise scheduling, I2C/SPI/ADC IO.
                                        <br /><br />
                                        <strong>Session State Machine:</strong> Readiness → Contact → Pre Map → ToF → (Actuation) → Post Map → Closeout.
                                        <br /><br />
                                        <strong>Time Alignment:</strong> Map vectors and ToF indices stored with consistent epoch.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">D) Actuation (v2)</h3>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        <strong>Core Rule:</strong> Actuator must never contaminate pressure rails.
                                        <br /><br />
                                        Dedicated driver & isolated power rail. Local bulk capacitance.
                                        <br /><br />
                                        <strong>Isolation:</strong> Pre/post windows never overlap actuation. Settle window required.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">E) Power & Sealing</h3>
                                    <p className="text-[10px] text-slate-400 leading-relaxed">
                                        <strong>Power:</strong> Session-optimized (clean rails &gt; battery life). LiPo micro pouch. Aggressive power gating for non-active domains.
                                        <br /><br />
                                        <strong>Sealing:</strong> No exposed metal on contact. Seams away from sensing regions. Flex strain relief.
                                    </p>
                                </div>
                            </div>

                            {/* Validation Checklist */}
                            <section className="space-y-6 pt-8 border-t border-white/5">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Electronics Validation Checklist</h3>
                                <div className="p-4 border border-white/5 bg-white/[0.01] grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {[
                                        'Pressure map repeatability (10+ sessions)',
                                        'Drift characterization (start vs end)',
                                        'ToF stability under realistic conditions',
                                        'Actuation isolation (zero pressure noise)',
                                        'Flex cycle endurance + seal integrity'
                                    ].map((check, i) => (
                                        <div key={i} className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                                            <div className="w-3 h-3 border border-indigo-500/50 rounded-sm" />
                                            {check}
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Header */}
                            <section className="space-y-6">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white">Engineering Open Questions</h3>
                                    <div className="text-xs text-indigo-400 font-mono border-l-2 border-indigo-500 pl-3">
                                        Engineer backlog anchors (high-signal unknowns)
                                    </div>
                                </div>
                                <p className="text-lg text-slate-300 leading-relaxed font-light font-mono text-sm max-w-3xl">
                                    These are the decisions that most affect feasibility, repeatability, and signal quality. Each item should end with a chosen “v0.1 decision” and a test plan.
                                </p>
                            </section>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* A) Pressure Mapping */}
                                <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-colors space-y-4">
                                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-2">A) Pressure Mapping</h4>
                                    <div className="space-y-3 text-xs text-slate-400">
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Zone Count & Layout</strong>
                                            Target 8, 12, 16, or 24 zones? Radial rings vs. segmented grid?
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Sensor Tech</strong>
                                            Capacitive array vs FSR matrix? Dielectric microstructure approach?
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Calibration</strong>
                                            Per-zone offset + gain. Temperature compensation? Drift handling (lock vs. adaptive).
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Surface Mechanics</strong>
                                            Prevent "ridge telegraphing". Silicone durometer & thickness control.
                                        </div>
                                    </div>
                                </div>

                                {/* B) Spine & Form Factor */}
                                <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-colors space-y-4">
                                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-2">B) Spine & Form Factor</h4>
                                    <div className="space-y-3 text-xs text-slate-400">
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Architecture</strong>
                                            Continuous flex vs. Segmented vertebrae.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Neutral Axis</strong>
                                            Exact placement of flex PCB to minimize strain cycling.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Tip Stability</strong>
                                            Stiffness gradient design to support ToF orientation.
                                        </div>
                                    </div>
                                </div>

                                {/* C) ToF Tip */}
                                <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-colors space-y-4">
                                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-2">C) ToF Tip (“LiDAR”)</h4>
                                    <div className="space-y-3 text-xs text-slate-400">
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Optical Window</strong>
                                            Geometry, material, and baffling strategy.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Direction Model</strong>
                                            Single-axis vs. multi-angle? Guaranteeing orientation.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Confidence Scoring</strong>
                                            Rules for rejecting low reflectance or inconsistent returns.
                                        </div>
                                    </div>
                                </div>

                                {/* D) v2 Micro-Vibration */}
                                <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-colors space-y-4">
                                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-2">D) v2 Actuation</h4>
                                    <div className="space-y-3 text-xs text-slate-400">
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Actuator Selection</strong>
                                            ERM vs LRA vs piezo interactions with noise.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Isolation</strong>
                                            Separate power domain, ground return strategy.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Protocol Timing</strong>
                                            Duration, separate settle delay.
                                        </div>
                                    </div>
                                </div>

                                {/* E) Protocol & Repeatability */}
                                <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-colors space-y-4">
                                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-2">E) Protocol</h4>
                                    <div className="space-y-3 text-xs text-slate-400">
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Session Standardization</strong>
                                            Fixed hold windows. Minimizing user variability.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Validity Grading</strong>
                                            Pass/Partial/Reject criteria. Slip detection.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Reactive Region</strong>
                                            Top-K vs single zone. Persistence vs peak delta.
                                        </div>
                                    </div>
                                </div>

                                {/* F & G) Manufacturing & Data */}
                                <div className="p-6 bg-white/[0.02] border border-white/10 hover:border-indigo-500/30 transition-colors space-y-4">
                                    <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20 pb-2">F & G) Mfg & Data</h4>
                                    <div className="space-y-3 text-xs text-slate-400">
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Sealing</strong>
                                            Full overmold vs split-shell. Cleaning compatibility.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Data Package</strong>
                                            Canonical session record format. Map coordinate system.
                                        </div>
                                        <div>
                                            <strong className="block text-slate-200 mb-1">Processing</strong>
                                            On-device abstraction vs raw dump to app.
                                        </div>
                                    </div>
                                </div>

                            </div>
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
                    background: rgba(79, 70, 229, 0.5);
                }
            ` }} />
        </div >
    );
};

export default EngineeringComfortSense;
