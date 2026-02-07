import React, { useState } from 'react';

type TabKey = 'engines' | 'interface' | 'sigils' | 'architecture' | 'security';

const EngineeringAppUI: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('engines');

    return (
        <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-[#080808]">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                        <span className="text-blue-500">System:</span> App UI
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Interface & Intelligence Architecture</p>
                </div>

                <div className="flex gap-1 bg-white/5 p-1 rounded-lg overflow-x-auto">
                    {[
                        { key: 'engines', label: 'Intelligence Engines' },
                        { key: 'interface', label: 'Interface Architecture' },
                        { key: 'sigils', label: 'Nexalis Sigils™' },
                        { key: 'architecture', label: 'System Architecture' },
                        { key: 'security', label: 'Privacy & Security' },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as TabKey)}
                            className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Internal Gradient Background */}
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 40%)'
                    }}
                />

                <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-16">
                    {activeTab === 'engines' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-bold text-white leading-tight">
                                        The Intelligence Layer Behind Every Device.
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        Nexalis is built around two core software engines that transform raw sensor data into structured, meaningful wellness insights. This software layer is what turns the hardware ecosystem into a long-term, defensible platform.
                                    </p>
                                </div>
                                <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                    <h4 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-4">Architecture Advantage</h4>
                                    <ul className="space-y-3 text-sm text-slate-400">
                                        <li className="flex gap-3">
                                            <span className="text-blue-500">01</span>
                                            <span>Hardware can be copied; engines cannot.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-blue-500">02</span>
                                            <span>Creates a defensible data ecosystem.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-blue-500">03</span>
                                            <span>Enables future AI personalization.</span>
                                        </li>
                                    </ul>
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                                        Engine 01
                                    </div>
                                    <h4 className="text-2xl font-bold text-white">Health Intelligence Engine</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Converts multi-sensor inputs into clear, clinically inspired wellness metrics. Serves as the foundation for all Nexalis insights.
                                    </p>
                                    <div className="space-y-4 pt-4">
                                        <h5 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Processed Data</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {['Vascular Response', 'Pressure Patterns', 'Thermal Rhythms', 'Physiologic Timing', 'Trend Patterns'].map(item => (
                                                <span key={item} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-slate-300 font-mono uppercase">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                                        Engine 02 (Optional)
                                    </div>
                                    <h4 className="text-2xl font-bold text-white">Compatibility Intelligence Engine</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Pattern alignment analysis for couples who opt in. Identifies alignment, timing harmony, and comfort balance using safe, abstract signals.
                                    </p>
                                    <div className="space-y-4 pt-4">
                                        <h5 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Key Outputs</h5>
                                        <div className="flex flex-wrap gap-2">
                                            {['Alignment Score', 'Timing Synchrony', 'Comfort Balance', 'Fit Harmony Map'].map(item => (
                                                <span key={item} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] text-slate-300 font-mono uppercase">{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sigils' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Sigils Overview */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Representation System</span>
                                    </div>
                                    <h3 className="text-4xl font-black text-white leading-tight uppercase tracking-tighter">
                                        Nexalis Sigils™
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed font-light">
                                        Sigils are Nexalis’ symbolic representation system for human physical variability. Instead of presenting raw measurements, the app converts sensor outputs into abstract, vector-based glyphs that are screenshot-safe, privacy-forward, and instantly readable.
                                    </p>
                                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl italic text-slate-400 text-sm">
                                        "Sigils behave like an 'astrology symbol' for physiology—grounded in real sensor-derived parameters and a stable mapping grammar."
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { title: 'Screenshot Safe', icon: '📸' },
                                        { title: 'Privacy Forward', icon: '🔐' },
                                        { title: 'Repeatable', icon: '🔁' },
                                        { title: 'Parametric', icon: '📐' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center text-center gap-3">
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="text-[10px] uppercase tracking-widest font-black text-slate-300">{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Design Intent */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h4 className="text-xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-px bg-blue-500/50" />
                                    Design Intent & Constraints
                                </h4>
                                <div className="grid md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black uppercase text-blue-400 tracking-wider">Human Readability</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">Recognize “me” at a glance. Notice changes over time without interpreting complex numerical data.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black uppercase text-blue-400 tracking-wider">Engineering Determinism</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">Metrics always render the same sigil within defined tolerances, enabling testing and clinical comparability.</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h5 className="text-xs font-black uppercase text-blue-400 tracking-wider">Non-Explicit Abstraction</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">Encodes relationships (ratios, profiles, distributions) rather than literal anatomical shapes.</p>
                                    </div>
                                </div>
                            </section>

                            {/* Sigil Families */}
                            <section className="space-y-8">
                                <h4 className="text-xl font-bold text-white flex items-center gap-3">
                                    <span className="w-8 h-px bg-blue-500/50" />
                                    Sigil Families
                                </h4>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-blue-500/[0.02] border border-blue-500/10 rounded-3xl space-y-6">
                                        <div className="flex justify-between items-start">
                                            <h5 className="text-xl font-bold text-white">Structural Sigils</h5>
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest px-2 py-1 bg-blue-500/10 rounded">FitSense</span>
                                        </div>
                                        <p className="text-sm text-slate-400">Strong geometry, architectural lines, and symmetry cues. Encodes length and girth primarily as proportions.</p>
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Spine Signature</div>
                                                <div className="text-[10px] text-slate-300">Verticality signature</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Girth Signature</div>
                                                <div className="text-[10px] text-slate-300">Outer boundary span</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Taper Style</div>
                                                <div className="text-[10px] text-slate-300">Curvature tendency</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Stability</div>
                                                <div className="text-[10px] text-slate-300">Negative space balance</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 bg-rose-500/[0.02] border border-rose-500/10 rounded-3xl space-y-6">
                                        <div className="flex justify-between items-start">
                                            <h5 className="text-xl font-bold text-white">Harmonic Sigils</h5>
                                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest px-2 py-1 bg-rose-500/10 rounded">ComfortSense</span>
                                        </div>
                                        <p className="text-sm text-slate-400">Soft containment, layered contours, rhythmic geometry. Encodes depth and response curves.</p>
                                        <div className="grid grid-cols-2 gap-4 pt-4">
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Depth Signature</div>
                                                <div className="text-[10px] text-slate-300">Vessel height mapping</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Pressure Map</div>
                                                <div className="text-[10px] text-slate-300">Inner contour thickness</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Complexity</div>
                                                <div className="text-[10px] text-slate-300">Rippled layer count</div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Equilibrium</div>
                                                <div className="text-[10px] text-slate-300">Void alignment balance</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Technical Mapping Layer */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h4 className="text-xl font-bold text-white">Data → Sigil Mapping</h4>
                                <div className="space-y-4">
                                    {[
                                        {
                                            step: 'Phase 01: Normalization',
                                            content: 'Transform raw sensor output into stable, dimensionless ratios (0..1). Quantize into defined bands to prevent noise-driven visual flicker.'
                                        },
                                        {
                                            step: 'Phase 02: Parametric Grammar',
                                            content: 'Primitive set (Spine, Shell, Caps, Voids) controlled by the normalized vector parameters.'
                                        },
                                        {
                                            step: 'Phase 03: Deterministic Render',
                                            content: 'Input vector must yield byte-stable SVG output. Versioned specs ensure longitudinal data integrity.'
                                        }
                                    ].map((phase, i) => (
                                        <div key={i} className="flex gap-6 p-6 bg-white/[0.01] border border-white/5 rounded-xl group hover:bg-white/[0.03] transition-colors">
                                            <div className="text-2xl font-black text-slate-700 group-hover:text-blue-500 transition-colors">0{i + 1}</div>
                                            <div>
                                                <h6 className="text-[11px] font-black uppercase tracking-widest text-blue-400 mb-1">{phase.step}</h6>
                                                <p className="text-xs text-slate-400 leading-relaxed">{phase.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Engineering Deliverables */}
                            <section className="grid md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                                <div className="space-y-6">
                                    <h4 className="text-xl font-bold text-white">Technical Maintenance</h4>
                                    <ul className="space-y-4">
                                        {[
                                            { label: 'Sigil Spec v1.0', detail: 'Mapping tables, primitive definitions, quantization ranges.' },
                                            { label: 'Renderer Library', detail: 'Cross-platform TS renderer: params -> stable SVG.' },
                                            { label: 'Reference Vectors', detail: 'QA gold masters for male/female parameter edge cases.' },
                                            { label: 'Privacy Vault', detail: 'Normalized vector persistence layer vs raw metrics.' }
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                                <div>
                                                    <div className="text-xs font-bold text-slate-200">{item.label}</div>
                                                    <div className="text-[10px] text-slate-500 mt-0.5">{item.detail}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 bg-blue-900/10 border border-blue-500/10 rounded-3xl flex flex-col justify-center items-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <h5 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">IP Advantage</h5>
                                    <p className="text-sm text-slate-300 font-light leading-relaxed">
                                        Nexalis is not just collecting data.<br />
                                        We are creating the language people use to understand it.
                                    </p>
                                </div>
                            </section>

                            {/* Sigil Reference Examples */}
                            <section className="space-y-12 pt-12 border-t border-white/5 pb-12">
                                <div className="space-y-4">
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Nexalis Sigil™ — Reference Examples</h4>
                                    <p className="text-sm text-slate-500 italic font-light">Illustrative descriptions; not tied to any individual metadata.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-12">
                                    {/* Structural Sigils */}
                                    <div className="space-y-6">
                                        <h5 className="text-xs font-black uppercase text-blue-500 tracking-widest flex items-center gap-4">
                                            Structural Variants (FitSense)
                                            <span className="h-px bg-blue-500/20 flex-1" />
                                        </h5>
                                        <div className="grid md:grid-cols-3 gap-6">
                                            {[
                                                {
                                                    title: "Example 1: Balanced",
                                                    char: "Median length/girth, high symmetry, minimal taper variance.",
                                                    appearance: "Centered vertical spine, evenly spaced outer arcs, identical caps.",
                                                    interpretation: "Visually calm and stable; balanced structure.",
                                                    note: "Parameter vectors cluster around mid-range bands."
                                                },
                                                {
                                                    title: "Example 2: Extended",
                                                    char: "High length/girth ratio, slight distal taper, high symmetry.",
                                                    appearance: "Taller spine, narrow outer arcs, elongated curvature.",
                                                    interpretation: "Strong vertical emphasis; light, precise structure.",
                                                    note: "High length ratio shifts spine height band."
                                                },
                                                {
                                                    title: "Example 3: Compact",
                                                    char: "Length below median, girth above median, high stability.",
                                                    appearance: "Shorter spine, thick stroke weight, flared outer arcs.",
                                                    interpretation: "Strong mass presence; dense structure.",
                                                    note: "Girth ratio dominates arc span calculation."
                                                }
                                            ].map((ex, i) => (
                                                <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                                                    <h6 className="font-bold text-white text-sm">{ex.title}</h6>
                                                    <div className="space-y-3">
                                                        <div className="text-[10px]"><span className="text-slate-500 uppercase font-bold tracking-tighter">Char:</span> <span className="text-slate-300">{ex.char}</span></div>
                                                        <div className="text-[10px]"><span className="text-slate-500 uppercase font-bold tracking-tighter">Visual:</span> <span className="text-slate-300">{ex.appearance}</span></div>
                                                        <div className="text-[10px]"><span className="text-slate-500 uppercase font-bold tracking-tighter">Meaning:</span> <span className="text-slate-300">{ex.interpretation}</span></div>
                                                        <div className="text-[9px] p-2 bg-blue-500/5 border border-blue-500/10 rounded font-mono text-blue-400">
                                                            ENG: {ex.note}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Harmonic Sigils */}
                                    <div className="space-y-6">
                                        <h5 className="text-xs font-black uppercase text-rose-500 tracking-widest flex items-center gap-4">
                                            Harmonic Variants (ComfortSense)
                                            <span className="h-px bg-rose-500/20 flex-1" />
                                        </h5>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {[
                                                {
                                                    title: "Example 4: Deep / Soft Distribution",
                                                    char: "Depth above median, even pressure, high elastic compliance.",
                                                    appearance: "Tall vessel, uniform inner contour, large central void.",
                                                    interpretation: "Calm, receptive geometry; deep harmonic balance.",
                                                    note: "Depth ratio drives vessel height; elasticity selects smooth curves."
                                                },
                                                {
                                                    title: "Example 5: Variable / Layered",
                                                    char: "Moderate depth, distinct pressure zones, variable compliance.",
                                                    appearance: "Medium vessel, nested inner contours, rippled geometry.",
                                                    interpretation: "Dynamic internal structure; visual rhythm.",
                                                    note: "Zone clustering determines layer count; ripple amplitude capped."
                                                }
                                            ].map((ex, i) => (
                                                <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                                    <h6 className="font-bold text-white text-sm">{ex.title}</h6>
                                                    <div className="space-y-3">
                                                        <div className="text-[10px]"><span className="text-slate-500 uppercase font-bold tracking-tighter">Char:</span> <span className="text-slate-300">{ex.char}</span></div>
                                                        <div className="text-[10px]"><span className="text-slate-500 uppercase font-bold tracking-tighter">Visual:</span> <span className="text-slate-300">{ex.appearance}</span></div>
                                                        <div className="text-[10px]"><span className="text-slate-500 uppercase font-bold tracking-tighter">Meaning:</span> <span className="text-slate-300">{ex.interpretation}</span></div>
                                                        <div className="text-[9px] p-2 bg-rose-500/5 border border-rose-500/10 rounded font-mono text-rose-400">
                                                            ENG: {ex.note}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Usage Section */}
                                <div className="mt-12 p-8 bg-white/[0.01] border border-white/5 rounded-3xl grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <h5 className="text-xs font-black uppercase text-slate-500 tracking-[0.2em]">Application Guidelines</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            Reference examples define expected visual behavior, not artistic interpretation. They serve as the "Golden Master" for cross-platform rendering consistency.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { role: 'QA Validation', task: 'Parameter vectors → correct sigil family' },
                                            { role: 'Component Integrity', task: 'Band transitions → predictable visual changes' },
                                            { role: 'Privacy Compliance', task: 'Verify sigils remain non-explicit/abstract' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-[10px]">
                                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                <span className="font-bold text-slate-300 w-32 shrink-0">{item.role}:</span>
                                                <span className="text-slate-500">{item.task}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Engineering Rationale */}
                            <section className="space-y-12 pt-12 border-t border-white/5 pb-12">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Engineering Philosophy</span>
                                    </div>
                                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Engineering Rationale</h4>
                                    <p className="text-lg text-slate-400 font-light leading-relaxed">
                                        Why Nexalis Sigils are Intentionally Hard to Decode. Sigils are not icons; they are a symbolic compression layer designed to encode multi-dimensional data while resisting immediate, literal interpretation.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <h5 className="text-xs font-black uppercase text-blue-400 tracking-widest">1. Avoiding Visual Dominance</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">To prevent symbols from collapsing into "number surrogates," Sigils distribute meaning across multiple interacting structures. No single element (height, width) ever fully explains the form.</p>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <h5 className="text-xs font-black uppercase text-blue-400 tracking-widest">2. Multi-System Interaction</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">Sigils use at least two geometric systems—global orientation and internal secondary geometries—that partially conflict, creating interpretive resistance.</p>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <h5 className="text-xs font-black uppercase text-blue-400 tracking-widest">3. Behavior over Shape</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">Meaning is encoded in how geometry behaves (curvature acceleration, thickness modulation) rather than recognizable anatomical shapes.</p>
                                    </div>
                                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                                        <h5 className="text-xs font-black uppercase text-blue-400 tracking-widest">4. Negative Space as Data</h5>
                                        <p className="text-xs text-slate-400 leading-relaxed">Absence is intentional. Offset voids and irregular gaps are first-class carriers of encoded information, slowing visual decoding.</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8 pt-8">
                                    <div className="space-y-4">
                                        <h5 className="text-sm font-bold text-white">Long-Term Obfuscation</h5>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">Familiarity builds meaning, not labels. Sigils allow users to notice physiological changes before they understand the technical cause.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h5 className="text-sm font-bold text-white">Implementation Check</h5>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">"Does removing one element make the meaning obvious? If yes, complexity is too low. Does changing one parameter affect multiple regions? If no, mapping is too literal."</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h5 className="text-sm font-bold text-white">Success Criteria</h5>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">Two sigils can look superficially similar yet encode different behaviors. Engineers require the spec to explain differences.</p>
                                    </div>
                                </div>

                                <div className="p-8 bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20 rounded-3xl text-center">
                                    <h5 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Final Mental Model</h5>
                                    <p className="text-white text-xl font-light leading-relaxed max-w-2xl mx-auto italic">
                                        "Think of Nexalis Sigils as a deterministic, symbolic hash of human physiology—readable through familiarity, not inspection."
                                    </p>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'interface' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="space-y-8">
                                <h3 className="text-2xl font-black text-white">Interface Design Philosophy</h3>
                                <p className="text-slate-400 max-w-3xl leading-relaxed">
                                    All visualizations are abstract—graphs, curves, waveforms, and indexes. No anatomy. No explicit imagery. Nexalis prioritizes a clean, high-end medtech aesthetic inspired by research-grade instrumentation.
                                </p>

                                <div className="grid md:grid-cols-2 gap-12 pt-8">
                                    <div className="space-y-4">
                                        <div className="aspect-[4/3] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
                                            <img src="/consumer-ui-wireframe.png" alt="Consumer UI" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl">
                                                <h5 className="text-xs font-bold text-white">Consumer Dashboard</h5>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Personal Wellness Mapping</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="aspect-[4/3] bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-50" />
                                            <img src="/clinician-ui-wireframe.png" alt="Clinician UI" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl">
                                                <h5 className="text-xs font-bold text-white">Clinician Workspace</h5>
                                                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Research-Grade Analytics</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h4 className="text-xl font-bold text-white">Visual Package Library</h4>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        { title: 'Autonomic Balance', desc: 'Minimal two-line HRV-style curve (calm vs reactive).' },
                                        { title: 'Vascular Response Arc', desc: 'Subtle gradient line representing responsiveness.' },
                                        { title: 'Structural Symmetry Map', desc: 'Geometric mirrored shapes representing stability.' },
                                        { title: 'Compression Response', desc: 'Smooth line showing structural adaptation.' },
                                        { title: 'Equilibrium Scatter', desc: 'Points showing shifting physiologic center.' },
                                        { title: 'Variability Window', desc: 'Overlapping curves highlighting signal density.' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors rounded-xl">
                                            <h5 className="font-bold text-white mb-2 text-sm">{item.title}</h5>
                                            <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'architecture' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">Full System Architecture</h3>
                                <div className="grid md:grid-cols-5 gap-4 py-8">
                                    {[
                                        { step: '1. Hardware Node', desc: 'Sensor clusters (Axis, RigiSense, etc.)' },
                                        { step: '2. Signal Abstraction', desc: 'Remove raw units, convert to indexes' },
                                        { step: '3. Logic Pipeline', desc: 'Attribute changes to systemic context' },
                                        { step: '4. API Gateway', desc: 'Secure transmission to encrypted cloud' },
                                        { step: '5. Display Layer', desc: 'Non-explicit abstract visualization' }
                                    ].map((s, i) => (
                                        <div key={i} className="p-4 border border-white/10 bg-white/[0.01] rounded-lg relative">
                                            <div className="font-bold text-xs text-blue-400 mb-2">{s.step}</div>
                                            <div className="text-[10px] text-slate-500 leading-tight">{s.desc}</div>
                                            {i < 4 && <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700">→</div>}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="grid md:grid-cols-2 gap-8">
                                <div className="p-6 bg-slate-900 border border-white/10 rounded-xl space-y-4">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-white/5 pb-2">Software Stack</h4>
                                    <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                        <li className="flex justify-between"><span>Core Engine</span> <span className="text-white">Node.js / Rust (WebAssembly)</span></li>
                                        <li className="flex justify-between"><span>Compute</span> <span className="text-white">Edge AI / Cloud Fusion</span></li>
                                        <li className="flex justify-between"><span>Interface</span> <span className="text-white">React Native / WebGL</span></li>
                                        <li className="flex justify-between"><span>Database</span> <span className="text-white">PostgreSQL + TimeSeries</span></li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-slate-900 border border-white/10 rounded-xl space-y-4">
                                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest border-b border-white/5 pb-2">Data Integrity</h4>
                                    <ul className="text-[10px] space-y-3 font-mono text-slate-400">
                                        <li className="flex justify-between"><span>Sampling Sync</span> <span className="text-white">± 2ms cross-node</span></li>
                                        <li className="flex justify-between"><span>Index Resolution</span> <span className="text-white">16-bit Float</span></li>
                                        <li className="flex justify-between"><span>Storage</span> <span className="text-white">AES-DSA Encrypted</span></li>
                                        <li className="flex justify-between"><span>Audit Log</span> <span className="text-white">Immutable Ledger</span></li>
                                    </ul>
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2 mb-6">Privacy & Security Framework</h3>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-4 p-6 bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl">
                                    <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                        🛡️
                                    </div>
                                    <h4 className="text-lg font-bold text-white">Anonymized Signals</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-mono">
                                        Identity is cryptographically separated from physiological data. The system never stores anatomical imagery or explicit identifiers.
                                    </p>
                                </div>
                                <div className="space-y-4 p-6 bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl">
                                    <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                        🔐
                                    </div>
                                    <h4 className="text-lg font-bold text-white">Biometric Locking</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-mono">
                                        Access to the Nexalis dashboard requires hardware-level biometric authentication (FaceID/TouchID) or physical node proximity.
                                    </p>
                                </div>
                                <div className="space-y-4 p-6 bg-blue-500/[0.02] border border-blue-500/10 rounded-2xl">
                                    <div className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                                        📡
                                    </div>
                                    <h4 className="text-lg font-bold text-white">End-to-End Encryption</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-mono">
                                        Data is encrypted at the sensor level before BLE transmission and remains encrypted until reaching the secure analysis vault.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 p-8 bg-blue-900/10 border border-blue-500/20 rounded-3xl text-center space-y-4">
                                <h4 className="text-blue-400 text-xs font-black uppercase tracking-[0.4em]">Privacy Commitment</h4>
                                <p className="text-white text-lg font-light leading-relaxed max-w-2xl mx-auto">
                                    "Your physiology is your data. Nexalis provides the clarity to understand it without ever compromising the privacy that protects it."
                                </p>
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
                    background: rgba(59, 130, 246, 0.5);
                }
            ` }} />
        </div>
    );
};

export default EngineeringAppUI;
