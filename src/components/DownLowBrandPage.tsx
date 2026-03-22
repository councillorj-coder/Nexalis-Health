import React, { useEffect, useState } from 'react';

export default function DownLowBrandPage({ onBack }: { onBack: () => void }) {
    const [selectedTimeframe, setSelectedTimeframe] = useState('30 days');

    return (
        <div
            className="min-h-screen bg-[#E8E4D8] text-[#050505] selection:bg-black/10 overflow-x-hidden relative"
            style={{
                fontFamily: "'Montserrat', sans-serif",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpath stroke='%23000000' stroke-width='1.5' stroke-opacity='0.1' d='M0 120L120 0ZM-30 90L90 -30ZM30 150L150 30Z'/%3E%3C/svg%3E")`,
                backgroundSize: '80px 80px'
            }}
        >
            {/* ── HEADER REGION (10vh Master Ribbon) ────────────────── */}
            <header
                className="relative h-[10vh] bg-[#050505]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48'%3E%3Cpath d='M48 0L48 48' stroke='white' stroke-opacity='0.08' stroke-width='1'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat'
                }}
            >
                <nav className="absolute top-0 w-full h-full z-50 px-0 flex justify-between items-center">
                    <div className="ml-6 flex items-center h-full translate-y-1 overflow-hidden w-[180px]">
                        <img
                            src="/new-dl-logo.png"
                            alt="The DownLow Studio Logo"
                            className="w-full scale-[2.2] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                        />
                    </div>
                    <button
                        onClick={onBack}
                        className="text-[9px] font-bold uppercase tracking-[0.8em] text-white/40 hover:text-white transition-all duration-1000 flex items-center gap-8 group pr-12"
                    >
                        <span className="w-16 h-[1px] bg-white/10 group-hover:bg-white transition-all duration-1000" />
                        Archive
                    </button>
                </nav>
            </header>

            {/* ── SECTION 1 (Waitlist Architecture) ────────────────── */}
            <section
                className="min-h-screen bg-[#E8E4D8] relative z-20 -mt-[10vh] pb-32"
                style={{
                    clipPath: "polygon(0 10vh, 62% 10vh, 66% 0, 100% 0, 100% 100%, 0 100%)",
                    WebkitClipPath: "polygon(0 10vh, 62% 10vh, 66% 0, 100% 0, 100% 100%, 0 100%)"
                }}
            >

                {/* ── 01: BOLD PRODUCT HEADER & WAITLIST ── */}
                <div className="max-w-7xl mx-auto pt-44 px-[32px] grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <span className="w-12 h-[1px] bg-black/20" />
                            <span className="text-[10px] uppercase tracking-[0.6em] text-black/40 font-bold">STATION_001 // ALPHA_CORE</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-black">
                            DL RING // <br />MEN’S <br />STUDIO RING
                        </h1>
                    </div>

                    <div className="pb-4 space-y-12">
                        <p className="text-lg md:text-xl text-black/60 font-light leading-relaxed max-w-sm">
                            Access is strictly restricted. Apply for private authentication into the Alpha network.
                        </p>
                        <button className="group relative px-12 py-6 bg-black text-white overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02]">
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 text-xs font-bold uppercase tracking-[0.4em]">Request Access</span>
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/20" />
                        </button>
                    </div>
                </div>

                {/* ── 02: SIMPLE PRODUCT OVERVIEW ── */}
                <div className="max-w-7xl mx-auto mt-48 px-[32px] grid grid-cols-1 lg:grid-cols-2 gap-24">
                    <div className="aspect-[4/5] bg-black overflow-hidden group shadow-2xl border border-black/5">
                        <img
                            src="/roostler-product-image-1.png"
                            alt="The DOWNLOW Studio Architecture"
                            className="w-full h-full object-cover shadow-2xl"
                        />
                    </div>
                    <div className="flex flex-col justify-center space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-[10px] uppercase tracking-[0.8em] text-black/30 font-bold">The_Core_Dynamic</h2>
                            <h3 className="text-3xl font-light tracking-tight leading-tight text-black" style={{ fontFamily: "'Cinzel', serif" }}>
                                DL RING: <br />BRED FOR PERFORMANCE.
                            </h3>
                            <p className="text-sm font-bold uppercase tracking-widest text-black/60">
                                Designed to wear at the base and capture real-time response.
                            </p>
                        </div>

                        <div className="space-y-8 text-sm text-black/70 leading-relaxed max-w-md">
                            <p>
                                DL Ring turns sensory signals into a clean dashboard and a private archive you can label, revisit, and learn from.
                                Built for the moments that matter and the pattern behind them. It reads what your body is doing as things build, peak, and settle, then translates it into simple outputs you can actually use. Not medical. Not awkward. Just private performance intelligence with a premium feel.
                            </p>

                            <div className="space-y-4 pt-4 border-t border-black/5">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">What you’ll see in real time</h4>
                                <ul className="space-y-3 text-[11px] uppercase tracking-widest text-black/50 list-none p-0">
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-[1px] bg-black/20" /> The Pump tracks your circulation engine</li>
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-[1px] bg-black/20" /> The Build tracks expansion, support, and hold</li>
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-[1px] bg-black/20" /> Maneuver Studio maps tempo, control, range, stability, and transitions</li>
                                    <li className="flex items-center gap-3"><span className="w-1.5 h-[1px] bg-black/20" /> DL Index scores the full picture so progress is obvious</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-black/5">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Your sessions, saved automatically</h4>
                                    <p className="text-[11px] text-black/50 leading-relaxed uppercase tracking-widest">
                                        DL Ring creates sessions from real events, not button taps. Save the ones that hit, name them, add a note, and come back to them anytime.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Trends that reveal your signature</h4>
                                    <p className="text-[11px] text-black/50 leading-relaxed uppercase tracking-widest">
                                        See your baseline, your best days, and your direction over time. DL Ring shows what’s improving and what conditions create your strongest sessions.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 flex items-center justify-between border-t border-black/5">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-red-600">Private by default</p>
                                    <p className="text-[9px] text-black/40 uppercase tracking-widest">Your data is yours. Nothing shared unless you choose it.</p>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-black hover:tracking-[0.5em] transition-all">
                                    Explore Live Metrics →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 03: NO_BOUNDARIES BIOMETRIC REGISTER ── */}
                <div className="max-w-7xl mx-auto mt-48 px-[32px] pb-64">
                    <div className="flex items-center gap-6 mb-24 opacity-20">
                        <span className="text-[10px] font-mono tracking-widest uppercase">System_Build_01 // No_Boundaries_Register</span>
                        <div className="h-[1px] flex-1 bg-black" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
                        {/* 01: THE PUMP (Engine Readout) */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">The Pump</h4>
                                <p className="text-[11px] leading-relaxed text-black/50 uppercase tracking-widest max-w-sm">
                                    Your engine readout. Tracks circulation signal in real time and turns it into simple numbers that explain session strength.
                                </p>
                            </div>
                            <div className="space-y-8">
                                {[
                                    { t: "Pulse Power", d: "How strong your circulation signal is right now" },
                                    { t: "Rise Speed", d: "How quickly you build compared to your personal average" },
                                    { t: "Peak Level", d: "Your highest level reached in a session" },
                                    { t: "Recovery Speed", d: "How fast you return to baseline afterward" },
                                    { t: "Flow Balance", d: "How smooth your flow pattern is, calm versus fluctuating" }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-black/80">{item.t}</h5>
                                        <p className="text-[9px] leading-relaxed text-black/40 uppercase tracking-widest">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 02: THE BUILD (Structure Layer) */}
                        <div className="space-y-12">
                            <div className="space-y-4">
                                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">The Build</h4>
                                <p className="text-[11px] leading-relaxed text-black/50 uppercase tracking-widest max-w-sm">
                                    Your structure layer. Shows support levels, growth from baseline, ramp speed, and hold sustainability.
                                </p>
                            </div>
                            <div className="space-y-8">
                                {[
                                    { t: "Firmness Level", d: "Your live support level right now" },
                                    { t: "Growth Level", d: "Real time increase from your relaxed baseline" },
                                    { t: "Build Speed", d: "How quickly firmness rises once activation begins" },
                                    { t: "Hold Strength", d: "How well firmness stays locked in over time" },
                                    { t: "Baseline Strength", d: "Your natural starting point before activation" }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <h5 className="text-[10px] font-bold uppercase tracking-widest text-black/80">{item.t}</h5>
                                        <p className="text-[9px] leading-relaxed text-black/40 uppercase tracking-widest">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Session Phases Map */}
                            <div className="pt-12 space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-widest text-black/30">Session Phases</h5>
                                <div className="flex items-center gap-0 w-full h-[2px] bg-black/5 rounded-full overflow-hidden">
                                    <div className="h-full w-1/4 bg-black/10" />
                                    <div className="h-full w-1/4 bg-black/40" />
                                    <div className="h-full w-1/4 bg-black/80" />
                                    <div className="h-full w-1/4 bg-black/20" />
                                </div>
                                <div className="grid grid-cols-4 gap-4 text-[8px] font-black uppercase tracking-[0.2em] text-black/40">
                                    <div>Warm up</div>
                                    <div className="text-center">Build</div>
                                    <div className="text-center">Hold</div>
                                    <div className="text-right">Reset</div>
                                </div>
                            </div>
                        </div>

                        {/* 03: DL INDEX (Scoreboard) */}
                        <div className="space-y-12 bg-[#E8E4D8]/90 p-12 backdrop-blur-md shadow-2xl border border-black/5">
                            <div className="space-y-4">
                                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">DL Index</h4>
                                <p className="text-[11px] leading-relaxed text-black/50 uppercase tracking-widest max-w-sm">
                                    The scoreboard. Blends The Pump and The Build into flagship scores within the neural console.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {[
                                    { t: "Performance Index", d: "How well circulation converts into real firmness" },
                                    { t: "Confidence Index", d: "Daily readiness based on baseline flow quality and build responsiveness" },
                                    { t: "Response Efficiency", d: "How efficiently increased flow produces firmness" },
                                    { t: "Stability Index", d: "How steady you stay when things ramp, combining flow smoothness and firmness steadiness" },
                                    { t: "Endurance Index", d: "How long flow and firmness stay aligned at elevated levels" }
                                ].map((item, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3">
                                            {item.t}
                                            <span className="h-[1px] flex-1 bg-black/5" />
                                        </h5>
                                        <p className="text-[9px] leading-relaxed text-black/40 uppercase tracking-widest italic">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Privacy First Disclaimer */}
                            <div className="pt-24 space-y-4 opacity-40">
                                <div className="h-[1px] w-8 bg-black/20" />
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-red-600">Privacy First</p>
                                    <p className="text-[8px] leading-relaxed uppercase tracking-widest max-w-[240px]">These metrics are for personal insight and training. No explicit act labeling. No sharing.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* FULL-WIDTH INDEX UI CONSOLE - ULTRA-SUBTLE BORDER */}
                    <div className="mt-48 max-w-6xl mx-auto px-[32px]">
                        <div className="relative w-full rounded shadow-xl ring-[0.5px] ring-black/10 overflow-hidden">
                            {/* Primary Visual */}
                            <img
                                src="/roostler-index-ui-fixed.png"
                                alt="DL Index Console"
                                className="w-full h-auto max-h-[90vh] object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* ── 04: MANEUVER STUDIO (Motion Biometrics) ── */}
                <div className="max-w-7xl mx-auto py-32 px-[32px] border-t border-black/5 relative z-30">
                    <div className="space-y-16">
                        {/* Hero Header */}
                        <div className="max-w-2xl space-y-6">
                            <h2 className="text-4xl font-light tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                Maneuver Studio™
                            </h2>
                            <p className="text-lg leading-relaxed text-black/70">
                                Maneuver Studio turns your session movement into a clean performance readout. DL Ring uses built-in motion sensing to track rhythm, control, and intensity shifts, then translates it into simple labels that are easy to understand and easy to improve. No awkward language. Just insight.
                            </p>
                        </div>

                        {/* Five Outputs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 py-12 border-y border-black/5">
                            {[
                                { title: "Tempo", options: "Slow / Flow / Sprint", desc: "Your pace tier through the session. It shows when you settle into your best groove and when you spike into high intensity." },
                                { title: "Control", options: "Smooth / Choppy", desc: "How refined your movement is. Smooth means intentional and consistent. Choppy usually shows up with fatigue or losing rhythm." },
                                { title: "Range", options: "Short / Standard / Deep", desc: "Your motion arc profile. Helps you learn whether your best performance comes from shorter controlled movement or a longer arc." },
                                { title: "Stability", options: "Steady / Wild", desc: "Your composure under intensity. Steady means your pattern holds together. Wild signals volatility and uneven rhythm." },
                                { title: "Transitions", options: "Low / Med / High", desc: "How often you change pace or pattern. Some perform best locked into one groove. Others thrive with variation." }
                            ].map((item, idx) => (
                                <div key={idx} className="space-y-4">
                                    <div className="space-y-1">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">{item.title}</h3>
                                        <div className="text-sm font-bold tracking-tight">{item.options}</div>
                                    </div>
                                    <p className="text-[11px] leading-relaxed text-black/60">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 pt-8">
                            {/* Behind the Scenes */}
                            <div className="space-y-8">
                                <h3 className="text-sm font-black uppercase tracking-[0.3em]">Behind the scenes</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {[
                                        { t: "Rhythm and cadence", d: "Strokes per minute and how stable your tempo stays over time" },
                                        { t: "Amplitude", d: "A range-of-motion proxy that separates short patterns from long arc patterns" },
                                        { t: "Smoothness", d: "How controlled the movement is versus jerky or turbulent motion" },
                                        { t: "Consistency", d: "Variance over time so you can see how repeatable your pattern really is" },
                                        { t: "Burst patterns", d: "Sprints, pauses, resets, and surge moments that shape intensity" },
                                        { t: "Session phases", d: "Warm-up, peak, and cool-down inferred from cadence and variability" }
                                    ].map((metric, idx) => (
                                        <div key={idx} className="flex gap-6 items-start group">
                                            <span className="text-[10px] font-black text-black/20 mt-1 tabular-nums">0{idx + 1}</span>
                                            <div className="space-y-1">
                                                <div className="text-[13px] font-bold tracking-tight">{metric.t}</div>
                                                <div className="text-[11px] text-black/50">{metric.d}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Phases & Signatures */}
                            <div className="space-y-16">
                                <div className="space-y-8">
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Session Phases</h3>
                                    <div className="space-y-6">
                                        <p className="text-sm text-black/60 leading-relaxed">DL Ring automatically maps how you ramp, so progress is easy to see over time.</p>
                                        <div className="flex items-center gap-0 w-full h-8 bg-black/5 rounded-full overflow-hidden p-1">
                                            <div className="h-full w-1/4 bg-black/10 flex items-center justify-center text-[9px] font-bold uppercase tracking-widest px-4">Warm-up</div>
                                            <div className="h-full w-2/4 bg-black/80 text-white flex items-center justify-center text-[9px] font-bold uppercase tracking-widest px-4">Peak</div>
                                            <div className="h-full w-1/4 bg-black/20 flex items-center justify-center text-[9px] font-bold uppercase tracking-widest px-4">Cool-down</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-[10px] text-black/50 leading-tight italic">
                                            <div>Rhythm forms</div>
                                            <div className="text-center">Tempo alignment</div>
                                            <div className="text-right">Recovery focus</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-[0.3em]">Style Signatures</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {["Steady Flow", "Precision Pulse", "Surge Mode", "Long Arc Drive"].map((label) => (
                                            <div key={label} className="px-4 py-2 border border-black/10 text-[11px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-default">
                                                {label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── 05: MANEUVER CONSOLE (Output Visualization) ── */}
                <div className="max-w-7xl mx-auto py-48 px-[32px] border-t border-black/5 relative z-30">
                    <div className="flex items-center gap-6 mb-24 opacity-20">
                        <span className="text-[10px] font-mono tracking-widest uppercase">System_Output_02 // Maneuver_Console</span>
                        <div className="h-[1px] flex-1 bg-black" />
                    </div>

                    <div className="space-y-32">
                        {/* FULL-WIDTH MANEUVER STUDIO MOCKUP - SUBTLE BORDER */}
                        <div className="w-full relative rounded shadow-2xl ring-[0.5px] ring-black/10 overflow-hidden max-w-6xl mx-auto">
                            <img
                                src="/roostlr-maneuver-studio-mockup.png"
                                alt="Maneuver Studio Output Mockup"
                                className="w-full h-auto max-h-[90vh] object-contain"
                            />
                        </div>

                        {/* Privacy Footer */}
                        <div className="pt-24 pb-24 flex justify-between items-end border-t border-black/5">
                            <div className="max-w-lg space-y-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Privacy First</h3>
                                <p className="text-[11px] leading-relaxed text-black/40">
                                    Maneuver Studio tracks motion quality and pacing, not explicit act labeling. Metrics are for personal insight and improvement.
                                </p>
                            </div>
                            <div className="text-[10px] font-black text-black/10 uppercase tracking-[1em]">
                                Maneuver Studio v1.0
                            </div>
                        </div>
                    </div>
                </div>


                {/* ARCHITECTURAL FOOTER */}
                <div className="absolute bottom-16 left-[32px] right-[32px] opacity-10 space-y-1">
                    <div className="h-[1px] w-full bg-black mb-4" />
                    <div className="flex items-center justify-between">
                        <p className="text-[8px] font-mono tracking-[0.5em] text-black uppercase">STATION_001 // NEXALIS BIOMETRIC DIVISION // DL RING // NO COMPROMISE</p>
                        <p className="text-[8px] font-mono tracking-[0.5em] text-black uppercase">CORE_HARDWARE_STACK_RECOGNIZED</p>
                    </div>
                </div>
            </section>

            {/* ── SECTION 2: TRENDS (The Long Game) ────────────────── */}
            <section className="bg-[#E8E4D8] relative z-30 pb-48">
                <div className="max-w-7xl mx-auto py-48 px-[32px] border-t border-black/5">
                    <div className="flex items-center gap-6 mb-24 opacity-20">
                        <span className="text-[10px] font-mono tracking-widest uppercase">System_Analytics_03 // Trends_Engine</span>
                        <div className="h-[1px] flex-1 bg-black" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-light tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                Trends
                            </h2>
                            <p className="text-lg leading-relaxed text-black/70 max-w-xl">
                                Trends is where DownLow becomes more than a live readout. It’s the long game. You see what’s improving, what’s slipping, and what patterns create your best sessions so you can repeat them on purpose.
                            </p>
                        </div>
                        <div className="flex flex-col justify-end space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Your timeline, your choice</h3>
                                <div className="flex gap-4">
                                    {['7 days', '30 days', '90 days'].map((period) => (
                                        <button
                                            key={period}
                                            onClick={() => setSelectedTimeframe(period)}
                                            className={`px-6 py-3 border border-black/10 text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${selectedTimeframe === period ? 'bg-black text-white shadow-xl scale-105' : 'bg-white/50 hover:bg-black/5'}`}
                                        >
                                            {period}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-[11px] text-black/50 uppercase tracking-widest">
                                You’ll always see your baseline, your best days, and your recent direction at a glance.
                            </p>
                        </div>
                    </div>

                    {/* Three Trend Layers */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-48">
                        {/* DL Index Trend */}
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">DL Index Trend</h4>
                                <p className="text-[11px] leading-relaxed text-black/50 uppercase tracking-widest">Your main scoreboard over time.</p>
                            </div>
                            <div className="space-y-4">
                                {(selectedTimeframe === '7 days' ? [
                                    { n: 'Performance Index', v: '92.4', t: '+2.4%' },
                                    { n: 'Confidence Index', v: '88.1', t: 'STABLE' },
                                    { n: 'Stability Index', v: '91.2', t: 'RISING' },
                                    { n: 'Endurance Index', v: '84.5', t: 'STEADY' }
                                ] : selectedTimeframe === '30 days' ? [
                                    { n: 'Performance Index', v: '89.2', t: '+8.1%' },
                                    { n: 'Confidence Index', v: '85.4', t: '+4.2%' },
                                    { n: 'Stability Index', v: '88.7', t: '+1.5%' },
                                    { n: 'Endurance Index', v: '82.1', t: 'UP_TREND' }
                                ] : [
                                    { n: 'Performance Index', v: '84.1', t: '+22.4%' },
                                    { n: 'Confidence Index', v: '81.2', t: '+18.7%' },
                                    { n: 'Stability Index', v: '82.4', t: '+12.1%' },
                                    { n: 'Endurance Index', v: '78.5', t: '+15.2%' }
                                ]).map((item) => (
                                    <div key={item.n} className="flex justify-between items-end border-b border-black/5 pb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/80">{item.n}</span>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-black/30 mb-0.5">{item.t}</div>
                                            <div className="text-lg font-light tracking-tighter tabular-nums" style={{ fontFamily: "'Cinzel', serif" }}>{item.v}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* The Pump Trend */}
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">The Pump Trend</h4>
                                <p className="text-[11px] leading-relaxed text-black/50 uppercase tracking-widest">Circulation engine behavior across sessions.</p>
                            </div>
                            <div className="space-y-4">
                                {(selectedTimeframe === '7 days' ? [
                                    { n: 'Pulse Power', v: 'HIGH', t: 'PEAK_WEEK' },
                                    { n: 'Rise Speed', v: 'FAST', t: 'OPTIMIZED' },
                                    { n: 'Peak Level', v: 'RECORD', t: 'S_BUILD' },
                                    { n: 'Flow Balance', v: 'SMOOTH', t: '98/100' },
                                    { n: 'Recovery Speed', v: 'FAST', t: 'IMPROVING' }
                                ] : selectedTimeframe === '30 days' ? [
                                    { n: 'Pulse Power', v: 'MED', t: 'U_TREND' },
                                    { n: 'Rise Speed', v: 'MED', t: 'STABLE' },
                                    { n: 'Peak Level', v: 'HIGH', t: 'CONSISTENT' },
                                    { n: 'Flow Balance', v: 'SMOOTH', t: '92/100' },
                                    { n: 'Recovery Speed', v: 'MED', t: 'STABLE' }
                                ] : [
                                    { n: 'Pulse Power', v: 'UP', t: '+18%' },
                                    { n: 'Rise Speed', v: 'UP', t: '+12%' },
                                    { n: 'Peak Level', v: 'RECORD', t: 'V_STABLE' },
                                    { n: 'Flow Balance', v: 'HIGH', t: '88/100' },
                                    { n: 'Recovery Speed', v: 'UP', t: '+5%' }
                                ]).map((item) => (
                                    <div key={item.n} className="flex justify-between items-end border-b border-black/5 pb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/80">{item.n}</span>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-black/30 mb-0.5">{item.t}</div>
                                            <div className="text-lg font-light tracking-tighter" style={{ fontFamily: "'Cinzel', serif" }}>{item.v}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* The Build Trend */}
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">The Build Trend</h4>
                                <p className="text-[11px] leading-relaxed text-black/50 uppercase tracking-widest">Expansion and staying power metrics.</p>
                            </div>
                            <div className="space-y-4">
                                {(selectedTimeframe === '7 days' ? [
                                    { n: 'Firmness Level', v: 'MAX', t: '99/100' },
                                    { n: 'Growth Level', v: 'PEAK', t: 'RECORD' },
                                    { n: 'Build Speed', v: '1.2s', t: 'EXTREME' },
                                    { n: 'Hold Strength', v: 'HIGH', t: 'STEADY' },
                                    { n: 'Baseline Strength', v: '9.2', t: 'RISING' }
                                ] : selectedTimeframe === '30 days' ? [
                                    { n: 'Firmness Level', v: 'HIGH', t: '94/100' },
                                    { n: 'Growth Level', v: 'HIGH', t: 'STABLE' },
                                    { n: 'Build Speed', v: '1.5s', t: 'GOOD' },
                                    { n: 'Hold Strength', v: 'MED', t: 'STABLE' },
                                    { n: 'Baseline Strength', v: '8.8', t: 'CONSISTENT' }
                                ] : [
                                    { n: 'Firmness Level', v: 'UP', t: '+15%' },
                                    { n: 'Growth Level', v: 'UP', t: '+22%' },
                                    { n: 'Build Speed', v: '1.8s', t: 'STABLE' },
                                    { n: 'Hold Strength', v: 'UP', t: '+4%' },
                                    { n: 'Baseline Strength', v: '8.5', t: '+12%' }
                                ]).map((item) => (
                                    <div key={item.n} className="flex justify-between items-end border-b border-black/5 pb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-black/80">{item.n}</span>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-black/30 mb-0.5">{item.t}</div>
                                            <div className="text-lg font-light tracking-tighter" style={{ fontFamily: "'Cinzel', serif" }}>{item.v}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pattern Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-48 bg-black/[0.02] p-12 border border-black/5">
                        <div className="space-y-8">
                            <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">Pattern insights that actually help</h3>
                            <p className="text-sm text-black/60 leading-relaxed">Trends doesn’t just show graphs. It highlights what changed.</p>
                        </div>
                        <div className="space-y-6">
                            {(selectedTimeframe === '7 days' ? [
                                "Morning sessions showing 12% higher Flow Balance",
                                "Rise Speed peak detected on Tuesday during Alpha sync",
                                "Recovery Speed improved after 3 consecutive active days"
                            ] : selectedTimeframe === '30 days' ? [
                                "Your best sessions happen when Flow Balance stays smooth",
                                "Build Speed improved this month while Hold Strength stayed steady",
                                "Control is rising, transitions are calming, endurance is climbing"
                            ] : [
                                "Long-term Firmness Level showing 22% growth since start",
                                "Baseline Strength has shifted upwards by 15% overall",
                                "Consistent patterns emerging in weekend late-night cycles"
                            ]).map((insight, idx) => (
                                <div key={idx} className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <span className="w-2 h-2 rounded-full bg-black/20 mt-1.5" />
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-black/70 italic">"{insight}"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Personal Bests & Repeatable Wins */}
                    <div className="space-y-16 mb-48">
                        <div className="space-y-4">
                            <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-black text-center">Personal bests and “repeatable wins”</h3>
                            <p className="text-sm text-black/60 text-center max-w-2xl mx-auto">DL Ring automatically surfaces the sessions worth saving and repeating.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                            {(selectedTimeframe === '7 days' ? [
                                { t: "Best this week", v: "Tuesday" },
                                { t: "Most consistent", v: "Mon-Wed" },
                                { t: "Peak Flow", v: "99/100" },
                                { t: "Min Build", v: "0.8s" },
                                { t: "Max Stable", v: "High" },
                                { t: "Score", v: "98.1" }
                            ] : [
                                { t: `Best in ${selectedTimeframe}`, v: selectedTimeframe === '30 days' ? "Oct 12" : "July 14" },
                                { t: "Most consistent", v: "Week 42" },
                                { t: "Strongest hold", v: "98/100" },
                                { t: "Fastest rise", v: "1.2s" },
                                { t: "Smoothest flow", v: "High" },
                                { t: "Highest score", v: "94.2" }
                            ]).map((win, idx) => (
                                <div key={idx} className="space-y-2 group cursor-pointer transition-all hover:scale-110">
                                    <div className="text-[9px] font-black uppercase tracking-widest text-black/30 group-hover:text-black transition-colors">{win.t}</div>
                                    <div className="text-xl font-light tracking-tighter" style={{ fontFamily: "'Cinzel', serif" }}>{win.v}</div>
                                </div>
                            ))}
                        </div>
                        <div className="text-center pt-8">
                            <p className="text-[10px] text-black/40 uppercase tracking-widest mb-4">Tap any highlight and DL Ring jumps you back into the exact session so you can study it and label it.</p>
                        </div>
                    </div>

                    {/* Signature Visible */}
                    <div className="max-w-3xl mx-auto text-center space-y-8 py-24 border-y border-black/5">
                        <h3 className="text-2xl font-light tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>Your signature becomes visible</h3>
                        <p className="text-sm text-black/60 leading-relaxed uppercase tracking-widest">
                            Over time you’ll start seeing your personal pattern, not random nights. Trends helps you spot the conditions that produce your best results and the habits that move the numbers.
                        </p>
                    </div>

                    {/* Final Privacy Note */}
                    <div className="mt-32 pt-24 border-t border-black/5 flex justify-between items-start">
                        <div className="max-w-lg space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Privacy first</h3>
                            <p className="text-[11px] leading-relaxed text-black/40">
                                Trends are private by default. Notes are user written. No explicit act labeling, and nothing is shared unless you choose it.
                            </p>
                        </div>
                        <div className="text-[10px] font-black text-black/10 uppercase tracking-[1em]">
                            Trends Engine v1.0
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 3: SESSION ARCHIVE (The Library) ────────────────── */}
            <section className="bg-white relative z-30 pb-48 border-t border-black/5">
                <div className="max-w-7xl mx-auto py-48 px-[32px]">
                    <div className="flex items-center gap-6 mb-24 opacity-20">
                        <span className="text-[10px] font-mono tracking-widest uppercase">System_Storage_05 // Session_Archive</span>
                        <div className="h-[1px] flex-1 bg-black" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-light tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                Session Archive
                            </h2>
                            <p className="text-lg leading-relaxed text-black/70 max-w-xl">
                                Session Archive is your private highlight reel and training log. Sessions are automatically created when DL Ring detects an activation event, so you don’t have to hit start or stop. When something real happens, it captures it, summarizes it, and saves it cleanly.
                            </p>
                        </div>
                        <div className="flex flex-col justify-end space-y-6">
                            <div className="p-8 bg-[#E8E4D8]/30 border border-black/5 rounded-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-4 text-center">Sessions are event triggered</h3>
                                <p className="text-[11px] leading-relaxed text-black/60 text-center uppercase tracking-widest">
                                    DL Ring recognizes key moments like activation, ramp, peak, and return, then turns that window into a session entry you can review later. You can also choose to save or discard anything.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Archive Browser UI */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-48">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-3 space-y-12">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-black">Fast filters, zero digging</h4>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="SEARCH BY TITLE OR NOTE..."
                                            className="w-full bg-transparent border-b border-black/10 py-2 text-[10px] font-mono uppercase tracking-widest focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div className="pt-4 space-y-2">
                                        <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Sort by</p>
                                        <select className="w-full bg-transparent border border-black/5 p-2 text-[10px] font-bold uppercase tracking-widest outline-none">
                                            <option>Highest Score</option>
                                            <option>Strongest Hold</option>
                                            <option>Smoothest Flow</option>
                                            <option>Best Control</option>
                                            <option>Recent First</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-black">Filter by tags & style</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Deep Flow', 'Alpha Spike', 'Endurance', 'Rhythm', 'Precision', 'Steady Flow', 'Surge Mode'].map(tag => (
                                        <button key={tag} className="px-3 py-1 border border-black/10 text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Session List */}
                        <div className="lg:col-span-9 space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-black/40">Your sessions, organized</h3>
                                <span className="text-[9px] font-mono text-black/20">Showing 4 of 128 entries</span>
                            </div>
                            {[
                                { title: "MORNING COFFEE RUN", date: "FEB 24, 2026", duration: "18m", score: "94.2", label: "HIGH ENERGY", favorite: true, note: "Flow balance was exceptional today." },
                                { title: "THURSDAY NIGHT RESET", date: "FEB 22, 2026", duration: "42m", score: "88.7", label: "DEEP FOCUS", favorite: false, note: "Amora loved it when I did this" },
                                { title: "ALPHA SYNC EXPERIMENT", date: "FEB 20, 2026", duration: "25m", score: "96.5", label: "PEAK POWER", favorite: true, note: "Testing new ramp profile. Significant rise speed increase." },
                                { title: "SUNDAY AFTERNOON", date: "FEB 16, 2026", duration: "31m", score: "82.4", label: "STABLE", favorite: false, note: "Consistent hold strength across phases." }
                            ].map((session, idx) => (
                                <div key={idx} className="group border border-black/5 p-8 hover:bg-[#E8E4D8]/10 transition-all cursor-pointer relative overflow-hidden">
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[9px] font-mono text-black/30">{session.date} // {session.duration}</span>
                                                {session.favorite && <span className="text-red-500 text-[10px]">★</span>}
                                            </div>
                                            <h3 className="text-xl font-light tracking-tight group-hover:tracking-widest transition-all duration-500" style={{ fontFamily: "'Cinzel', serif" }}>
                                                {session.title}
                                            </h3>
                                            <div className="flex gap-4 items-center">
                                                <span className="px-2 py-0.5 bg-black/5 text-[9px] font-black uppercase tracking-widest text-black/50">{session.label}</span>
                                                <p className="text-[10px] italic text-black/40">"{session.note}"</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <div className="text-[9px] font-black text-black/20 uppercase tracking-widest">Index Score</div>
                                            <div className="text-3xl font-light tabular-nums" style={{ fontFamily: "'Cinzel', serif" }}>{session.score}</div>
                                            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-1.5 h-1.5 bg-black/40 rounded-full" />
                                                <div className="w-1.5 h-1.5 bg-black/20 rounded-full" />
                                                <div className="w-1.5 h-1.5 bg-black/10 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute right-0 bottom-0 top-0 w-[4px] bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Compare and Learn Section */}
                    <div className="border border-black/5 bg-[#E8E4D8]/20 p-16 mb-48">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-8">
                                <h3 className="text-2xl font-light tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>Compare and learn</h3>
                                <p className="text-sm text-black/60 leading-relaxed uppercase tracking-widest">
                                    Open any session to see the full breakdown. DL Ring maps your Pump and Build curves against your session phases from warm up to peak to reset. Your style signature and maneuver profile become clear.
                                </p>
                                <button className="px-8 py-4 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-transform">
                                    Open Detailed Analysis
                                </button>
                            </div>
                            <div className="relative aspect-video bg-black/5 flex items-center justify-center overflow-hidden group">
                                <div className="absolute inset-0 flex items-end px-8 pb-8 gap-1">
                                    {[0.2, 0.4, 0.3, 0.6, 0.8, 0.9, 0.7, 0.5, 0.4, 0.6, 0.9, 1.0, 0.8, 0.6, 0.3, 0.1].map((h, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 bg-black/10 group-hover:bg-black/20 transition-all duration-1000"
                                            style={{ height: `${h * 100}%`, transitionDelay: `${i * 50}ms` }}
                                        />
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-black/20 group-hover:text-black/40 transition-colors">Visualizing_Signature_Alpha_01</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Make it Memorable section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-48 text-center pt-24 border-t border-black/5">
                        <div className="space-y-4">
                            <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-black">Make it memorable</h3>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/40 underline underline-offset-8 decoration-black/10">Rename a session</h4>
                            <p className="text-[10px] text-black/50 uppercase tracking-widest px-8">Turn good sessions into repeatable ones by renaming them with your own title.</p>
                        </div>
                        <div className="space-y-4 flex flex-col justify-end">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/40 underline underline-offset-8 decoration-black/10">Add a quick note</h4>
                            <p className="text-[10px] text-black/50 uppercase tracking-widest px-8">“Amora loved it when I did this” — Private notes help you remember the vibe.</p>
                        </div>
                        <div className="space-y-4 flex flex-col justify-end">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/40 underline underline-offset-8 decoration-black/10">Star favorites</h4>
                            <p className="text-[10px] text-black/50 uppercase tracking-widest px-8">Star your best sessions so they’re easy to find and study later.</p>
                        </div>
                    </div>

                    {/* Archive Privacy Note */}
                    <div className="pt-24 border-t border-black/5 flex justify-between items-start">
                        <div className="max-w-lg space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Privacy first</h3>
                            <p className="text-[11px] leading-relaxed text-black/40 uppercase tracking-widest">
                                Your archive is private by default. Notes are user written. Nothing is shared unless you choose it, and you can delete anything anytime.
                            </p>
                        </div>
                        <div className="text-[10px] font-black text-black/10 uppercase tracking-[1em]">
                            Archive Engine v1.0
                        </div>
                    </div>
                </div>
            </section>

            {/* ── SECTION 4: BATTERY + CHARGING ────────────────── */}
            <section className="bg-[#E8E4D8] relative z-30 pb-64 border-t border-black/5">
                <div className="max-w-7xl mx-auto py-48 px-[32px]">
                    <div className="flex items-center gap-6 mb-24 opacity-20">
                        <span className="text-[10px] font-mono tracking-widest uppercase">System_Power_04 // Battery_Charging</span>
                        <div className="h-[1px] flex-1 bg-black" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-light tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>
                                Battery + Charging
                            </h2>
                            <p className="text-lg leading-relaxed text-black/70 max-w-xl">
                                DL Ring is built to run quietly in the background and go full power when it matters. You get dependable battery life, fast recharging, and smart modes that match how you actually use it.
                            </p>
                        </div>
                        <div className="flex flex-col justify-end space-y-6">
                            <div className="p-8 bg-white/30 border border-black/5 rounded-sm">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-4 text-center">Charging</h3>
                                <p className="text-[11px] leading-relaxed text-black/60 text-center uppercase tracking-widest">
                                    DL Ring charges quickly on a compact dock designed for daily convenience. Set it down, it aligns, and it tops up fast so you’re always ready without thinking about it.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Battery Modes Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-48">
                        {[
                            {
                                mode: "Performance Mode",
                                subtitle: "Best live feed",
                                desc: "Highest sampling for the smoothest real-time dashboard and the most detailed Pump, Build, and Maneuver Studio readouts. Ideal for active sessions and instant feedback.",
                                color: "bg-black text-white"
                            },
                            {
                                mode: "Dynamic Mode",
                                subtitle: "The smart default",
                                desc: "DL Ring stays in an efficient longitudinal state, then automatically boosts into high-performance sensing when an activation event is detected. You get long battery life without missing the moments you care about.",
                                color: "bg-white border border-black/10"
                            },
                            {
                                mode: "Longitudinal Mode",
                                subtitle: "Maximum battery life",
                                desc: "DL Ring focuses on low-power tracking and useful trend metrics, capturing baseline changes and key summaries while minimizing sampling and radio use.",
                                color: "bg-white border border-black/10 opacity-60 hover:opacity-100 transition-opacity"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-10 space-y-8 flex flex-col justify-between ${item.color}`}>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-light tracking-tight" style={{ fontFamily: "'Cinzel', serif" }}>{item.mode}</h3>
                                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${idx === 0 ? 'text-white/40' : 'text-black/30'}`}>{item.subtitle}</div>
                                </div>
                                <p className={`text-[11px] leading-relaxed uppercase tracking-widest ${idx === 0 ? 'text-white/60' : 'text-black/50'}`}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* What this means in real life */}
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-black text-white p-16 space-y-12 relative overflow-hidden">
                            <div className="relative z-10 space-y-8">
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/40 text-center">What this means in real life</h3>
                                <div className="grid grid-cols-1 gap-8">
                                    {[
                                        { t: "Performance Mode", d: "Use when you want the richest live experience." },
                                        { t: "Dynamic Mode", d: "Use for everyday wear and automatic session capture." },
                                        { t: "Longitudinal Mode", d: "Use when you want the longest runtime while still building meaningful trends." }
                                    ].map((use, i) => (
                                        <div key={i} className="flex gap-8 items-center border-b border-white/5 pb-6 last:border-0 group cursor-default">
                                            <div className="text-[10px] font-mono text-white/20 group-hover:text-white transition-colors">0{i + 1}</div>
                                            <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/80">
                                                <span className="text-white">{use.t}</span> — {use.d}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32" />
                        </div>
                    </div>

                    {/* Section Footer */}
                    <div className="mt-48 pt-24 border-t border-black/5 flex justify-between items-end">
                        <div className="max-w-lg space-y-4">
                            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-black/20">DOWNLOW POWER DIVISION // ARCHITECTURAL_READY</p>
                        </div>
                        <div className="text-[10px] font-black text-black/10 uppercase tracking-[1em]">
                            Power Engine v1.0
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
