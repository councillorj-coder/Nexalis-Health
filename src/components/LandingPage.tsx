import { useMemo, useState } from 'react'
import NexalisLogo from './NexalisLogo'

export default function LandingPage(props: {
    onEnterOverview: () => void;
    engineeringPassword: string;
    onEnterEngineering: () => void;

}) {
    const [showEngineeringGate, setShowEngineeringGate] = useState(false)
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)

    const normalizedExpected = useMemo(() => props.engineeringPassword.trim(), [props.engineeringPassword])

    const tryEnterEngineering = () => {
        if (password.trim() === normalizedExpected) {
            setError(null)
            setShowEngineeringGate(false)
            setPassword('')
            props.onEnterEngineering()
            return
        }
        setError('Incorrect password')
    }
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 viewport-glow relative overflow-hidden">


            {/* Navigation */}
            <nav className="absolute top-0 w-full z-50 px-6 py-8 flex justify-between items-center max-w-7xl mx-auto left-1/2 -translate-x-1/2">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <NexalisLogo size={52} />
                    <span className="text-xl font-bold tracking-tighter">NEXALIS HEALTH</span>
                </div>
            </nav>

            {/* Engineering Gate (Client-side; temporary) */}
            {showEngineeringGate ? (
                <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-black/80 shadow-2xl p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="text-sm font-semibold tracking-wide text-white/70">Restricted</div>
                                <h2 className="mt-1 text-xl font-bold">Engineering Portal</h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Enter the portal password to continue.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowEngineeringGate(false)
                                    setPassword('')
                                    setError(null)
                                }}
                                className="text-white/60 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="mt-5">
                            <label className="text-xs font-semibold tracking-wide text-white/60">Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') tryEnterEngineering()
                                }}
                                type="password"
                                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/25"
                                placeholder="••••••••"
                                autoFocus
                            />
                            {error ? (
                                <div className="mt-2 text-sm text-rose-400">{error}</div>
                            ) : (
                                <div className="mt-2 text-xs text-slate-500">
                                    This is a temporary gate for early sharing.
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowEngineeringGate(false)
                                    setPassword('')
                                    setError(null)
                                }}
                                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={tryEnterEngineering}
                                className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-bold text-black hover:scale-[1.01] transition-transform"
                            >
                                Enter
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Hero Section */}
            <section className="relative pt-44 pb-32 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
                    <span className="text-white">The Intelligence System</span><br />
                    <span className="text-white/40 font-semibold tracking-[-0.06em] text-4xl md:text-6xl block mt-4 transition-opacity duration-1000 hover:text-white/60">For Human Intimate Health</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-12 tracking-normal">
                    The missing layer of human health data.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center relative">
                    {/* Data Streaming Animation SVG - Behind Buttons */}
                    <svg
                        className="absolute inset-0 w-[1600px] h-[400px] -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 pointer-events-none z-0"
                        viewBox="-400 0 1600 400"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            {/* Exact stream gradients from EnterSystemPage */}
                            <linearGradient id="streamGradientLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                                <stop offset="20%" stopColor="rgba(59,130,246,0.5)" />
                                <stop offset="60%" stopColor="rgba(147,197,253,0.8)" />
                                <stop offset="90%" stopColor="rgba(224,242,254,0.4)" />
                                <stop offset="100%" stopColor="rgba(224,242,254,0)" />
                            </linearGradient>
                            <linearGradient id="streamGradientRight" x1="100%" y1="0%" x2="0%" y2="0%">
                                <stop offset="0%" stopColor="rgba(225,29,72,0)" />
                                <stop offset="20%" stopColor="rgba(225,29,72,0.5)" />
                                <stop offset="60%" stopColor="rgba(251,113,133,0.8)" />
                                <stop offset="90%" stopColor="rgba(251,191,36,0.4)" />
                                <stop offset="100%" stopColor="rgba(251,191,36,0)" />
                            </linearGradient>

                            {/* Reference paths for particles - Centered on screen (x=400) */}
                            <path id="landingPathLeft" d="M-400 202 Q0 30, 400 202" />
                            <path id="landingPathRight" d="M1200 202 Q800 370, 400 202" />
                        </defs>

                        {/* Blue streams from left - Deep upward aesthetic curve */}
                        <g className="opacity-70">
                            {[
                                { d: "M-400 182 Q0 20, 400 202", dur: "12s", begin: "0s", w: 1.5 },
                                { d: "M-400 202 Q0 40, 400 202", dur: "13s", begin: "0.4s", w: 1.3 },
                                { d: "M-400 222 Q0 60, 400 202", dur: "11s", begin: "0.8s", w: 1.2 },
                                { d: "M-400 192 Q0 30, 400 202", dur: "10.5s", begin: "1.1s", w: 1.1 },
                                { d: "M-400 212 Q0 50, 400 202", dur: "11.5s", begin: "1.4s", w: 1 },
                                // Added streams
                                { d: "M-400 172 Q0 10, 400 202", dur: "14s", begin: "0.2s", w: 1.4 },
                                { d: "M-400 232 Q0 70, 400 202", dur: "12.5s", begin: "0.6s", w: 1.1 },
                                { d: "M-400 197 Q0 25, 400 202", dur: "11.8s", begin: "0.9s", w: 1.2 },
                                { d: "M-400 207 Q0 45, 400 202", dur: "13.2s", begin: "1.2s", w: 1 },
                                { d: "M-400 187 Q0 22, 400 202", dur: "10.8s", begin: "1.5s", w: 1.3 }
                            ].map((s, i) => (
                                <path key={`blue-s-${i}`} d={s.d} stroke="url(#streamGradientLeft)" strokeWidth={s.w} fill="none" strokeDasharray="1000 1000">
                                    <animate attributeName="stroke-dashoffset" values="1000;-1000" dur={s.dur} repeatCount="indefinite" begin={s.begin} />
                                </path>
                            ))}
                        </g>

                        {/* Red streams from right - Deep downward aesthetic curve */}
                        <g className="opacity-70">
                            {[
                                { d: "M1200 182 Q800 360, 400 202", dur: "12s", begin: "0.3s", w: 1.5 },
                                { d: "M1200 202 Q800 380, 400 202", dur: "13s", begin: "0.6s", w: 1.3 },
                                { d: "M1200 222 Q800 400, 400 202", dur: "11s", begin: "0.9s", w: 1.2 },
                                { d: "M1200 192 Q800 370, 400 202", dur: "10.5s", begin: "1.1s", w: 1.1 },
                                { d: "M1200 212 Q800 390, 400 202", dur: "11.5s", begin: "1.3s", w: 1 },
                                // Added streams
                                { d: "M1200 172 Q800 350, 400 202", dur: "13.5s", begin: "0.2s", w: 1.4 },
                                { d: "M1200 232 Q800 410, 400 202", dur: "12.2s", begin: "0.5s", w: 1.1 },
                                { d: "M1200 197 Q800 375, 400 202", dur: "11.4s", begin: "0.8s", w: 1.2 },
                                { d: "M1200 207 Q800 385, 400 202", dur: "12.8s", begin: "1.0s", w: 1 },
                                { d: "M1200 187 Q800 365, 400 202", dur: "10.7s", begin: "1.2s", w: 1.3 }
                            ].map((s, i) => (
                                <path key={`red-s-${i}`} d={s.d} stroke="url(#streamGradientRight)" strokeWidth={s.w} fill="none" strokeDasharray="1000 1000">
                                    <animate attributeName="stroke-dashoffset" values="1000;-1000" dur={s.dur} repeatCount="indefinite" begin={s.begin} />
                                </path>
                            ))}
                        </g>

                        {/* Sparkling data particles - Left side (Doubled) */}
                        <g>
                            {Array.from({ length: 14 }).map((_, i) => (
                                <circle key={`left-p-${i}`} r={1.2 + (i % 4) * 0.4} fill="rgba(147,197,253,0.9)">
                                    <animateMotion dur={`${4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.4}s`}>
                                        <mpath href="#landingPathLeft" />
                                    </animateMotion>
                                    <animate attributeName="opacity" values="0;0.6;1;0.8;0.3;0" dur={`${4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} keyTimes="0;0.2;0.4;0.6;0.85;1" />
                                </circle>
                            ))}
                        </g>

                        {/* Sparkling data particles - Right side (Doubled) */}
                        <g>
                            {Array.from({ length: 14 }).map((_, i) => (
                                <circle key={`right-p-${i}`} r={1.2 + (i % 4) * 0.4} fill="rgba(251,113,133,0.9)">
                                    <animateMotion dur={`${4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.4 + 0.3}s`}>
                                        <mpath href="#landingPathRight" />
                                    </animateMotion>
                                    <animate attributeName="opacity" values="0;0.6;1;0.8;0.3;0" dur={`${4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.4 + 0.3}s`} keyTimes="0;0.2;0.4;0.6;0.85;1" />
                                </circle>
                            ))}
                        </g>

                        {/* Center convergence glow - Aligned with Enter System button */}
                        <circle cx="400" cy="202" r="50" fill="rgba(255,255,255,0.12)" className="blur-2xl">
                            <animate attributeName="opacity" values="0.08;0.18;0.08" dur="4s" repeatCount="indefinite" />
                            <animate attributeName="r" values="40;60;40" dur="4s" repeatCount="indefinite" />
                        </circle>
                    </svg>

                    {/* Portal Selection (Primary CTA) */}
                    <div className="relative z-10 flex flex-col sm:flex-row gap-3 items-stretch">
                        <button
                            onClick={props.onEnterOverview}
                            className="group px-8 py-4 rounded-xl bg-white text-black font-bold text-lg hover:scale-[1.01] transition-transform shadow-xl text-left"
                        >
                            <div className="text-lg leading-none">Project Overview</div>
                            <div className="mt-1 text-xs font-semibold tracking-wide text-black/60">Investors • Doctors</div>
                        </button>
                        <button
                            onClick={() => {
                                setError(null)
                                setShowEngineeringGate(true)
                            }}
                            className="group px-8 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-xl text-white font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-colors shadow-xl text-left"
                        >
                            <div className="text-lg leading-none">Engineering Portal</div>
                            <div className="mt-1 text-xs font-semibold tracking-wide text-white/60">Password required</div>
                        </button>
                    </div>
                </div>
            </section>









            {/* Footer Branding */}
            <footer className="py-20 px-6 border-t border-white/5 bg-gradient-to-t from-blue-900/10 to-transparent">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                    <div>
                        <div className="text-2xl font-black tracking-tighter mb-4">NEXALIS HEALTH</div>
                        <p className="text-slate-500 max-w-xs text-sm">
                            Clinical-grade hardware. Bio-intelligent software. Private-by-design.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                        <div className="space-y-4">
                            <div className="font-bold">Ecosystem</div>
                            <div className="text-slate-500 hover:text-white cursor-pointer transition-colors">Rigisense</div>
                            <div className="text-slate-500 hover:text-white cursor-pointer transition-colors">InnerSense</div>
                            <div className="text-slate-500 hover:text-white cursor-pointer transition-colors">Axis</div>
                        </div>
                        <div className="space-y-4">
                            <div className="font-bold">Company</div>
                            <div className="text-slate-500 hover:text-white cursor-pointer transition-colors">Whitepapers</div>
                            <div className="text-slate-500 hover:text-white cursor-pointer transition-colors">Security</div>
                            <div className="text-slate-500 hover:text-white cursor-pointer transition-colors">Terms</div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-[10px] text-slate-600 text-center uppercase tracking-[0.3em]">
                    Biological Intelligence • High Performance • Proprietary Engine
                </div>
            </footer>
        </div>
    )
}
