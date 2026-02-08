import { useEffect, useState } from 'react'
import { NexalisAppVisual } from './NexalisAppVisual';
import { nodes } from '../data/engineering-data';

export default function EnterSystemPage(props: { onBack: () => void }) {
    const [scrollY, setScrollY] = useState(0)
    const [pageLoaded, setPageLoaded] = useState(false)
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Trigger page entry animation
    useEffect(() => {
        const timer = setTimeout(() => setPageLoaded(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // Get active node details
    const activeNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

    return (
        <div className={`min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans leading-relaxed overflow-x-hidden transition-opacity duration-700 ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>

            {/* Left Sidebar Navigation - Fixed Width Icon Bar */}
            <aside className="fixed left-0 top-0 h-full w-20 z-[60] flex flex-col items-center py-8 border-r border-white/10 bg-black/60 backdrop-blur-xl">
                {/* Back Button */}
                <button
                    onClick={props.onBack}
                    className="mb-12 p-3 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95"
                    title="Back to Landing"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Node Icons */}
                <div className="flex-1 flex flex-col gap-6 w-full px-3">
                    {nodes.map((node) => {
                        const isActive = selectedNode === node.id;
                        return (
                            <button
                                key={node.id}
                                onClick={() => setSelectedNode(isActive ? null : node.id)}
                                className={`group relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-300
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105'
                                        : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-white hover:scale-105'
                                    }`}
                            >
                                <span className="text-[10px] font-black tracking-tighter">{node.name.substring(0, 2).toUpperCase()}</span>

                                {/* Hover Label Tooltip */}
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    <span className="text-xs font-bold text-slate-200">{node.name}</span>
                                </div>

                                {/* Active Indicator Dot */}
                                {isActive && (
                                    <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-white shadow-lg animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Status decoration */}
                <div className="mt-auto flex flex-col items-center gap-2 opacity-30">
                    <div className="w-px h-8 bg-gradient-to-b from-transparent via-white to-transparent" />
                    <span className="text-[9px] uppercase tracking-widest text-white/40">SYS • V.02</span>
                </div>
            </aside>

            {/* Slide-out Overview Panel */}
            <div className={`fixed left-20 top-0 h-full w-[420px] z-[55] bg-black/95 backdrop-blur-3xl border-r border-white/10 transform transition-transform duration-500 ease-out cubic-bezier(0.16, 1, 0.3, 1) ${selectedNode ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {activeNodeData && (
                    <div className="h-full flex flex-col relative overflow-hidden">
                        {/* Background Ambient Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none" />

                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Header */}
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-300">{activeNodeData.formFactor}</span>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter mb-2 leading-[0.9]">{activeNodeData.name}™</h2>
                                <p className="text-sm text-blue-400 font-medium">{activeNodeData.tagline}</p>
                                <div className="h-1 w-12 bg-blue-600 rounded-full mt-4" />
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${activeNodeData.status === 'Stable' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                    activeNodeData.status === 'Beta' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                        activeNodeData.status === 'Dev' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                            'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                                    }`}>
                                    {activeNodeData.status}
                                </span>
                            </div>

                            {/* Why This Exists */}
                            <div className="space-y-3 p-5 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Why This Exists</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {activeNodeData.purpose}
                                </p>
                            </div>

                            {/* What It Measures */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">What It Measures</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    {activeNodeData.keyMeasurements.map((measurement, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-lg border border-white/5 hover:border-blue-500/20 transition-colors">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="text-xs text-slate-300 font-medium">{measurement}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Consumer Outputs */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">What You'll See</h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeNodeData.outputs.map((output, i) => (
                                        <div key={i} className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs font-medium text-blue-300">
                                            {output}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Architecture Domains */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Domains</h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeNodeData.domains.map((domain, i) => (
                                        <div key={domain}
                                            className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-medium text-slate-400 uppercase tracking-wider"
                                        >
                                            {domain}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer / Disclaimer */}
                        <div className="p-6 border-t border-white/5 bg-black/50 backdrop-blur">
                            <div className="flex items-start gap-3 opacity-60">
                                <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-[10px] text-slate-500 leading-relaxed">
                                    Technical specifications and engineering details are restricted to the Engineering Portal.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>




            {/* Main Content (Hero Section) - Pushed smoothly when panel opens */}
            <main className={`transition-all duration-500 ease-out cubic-bezier(0.16, 1, 0.3, 1) ${selectedNode ? 'pl-[420px] opacity-40 grayscale-[0.5]' : 'pl-20'
                }`}>

                {/* Navigation (Top Right only now) */}
                <nav className="fixed top-0 right-0 z-50 p-6 flex justify-end items-center">
                    <span className="text-sm font-medium uppercase tracking-widest text-slate-400 bg-black/50 backdrop-blur px-4 py-2 rounded-full border border-white/10">
                        System Interface
                    </span>
                </nav>

                {/* Hero Section with Animation */}
                <section className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-20">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }} />
                    </div>

                    {/* Title - Above Animation */}
                    <div className={`text-center mb-8 space-y-6 transition-all duration-700 delay-200 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                            <span className="text-white/90">THE NEXALIS</span><br />
                            <span className="text-white/40">SYSTEM</span>
                        </h1>
                        <p className="text-sm uppercase tracking-widest text-slate-400">Continuous Health Intelligence</p>
                    </div>

                    {/* Animated Hero Visual */}
                    <div className={`relative w-full max-w-5xl h-[350px] md:h-[500px] flex items-center justify-center transition-all duration-700 delay-[400ms] ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {/* Male Wireframe Image (Left) */}
                        <div className="absolute left-0 md:left-12 top-1/2 -translate-y-1/2 opacity-70">
                            <img
                                src={`${import.meta.env.BASE_URL}wireframe-male.png`}
                                alt="Male System"
                                className="h-[180px] sm:h-[250px] md:h-[350px] w-auto object-contain"
                                style={{
                                    filter: 'brightness(0.8) contrast(1.1)',
                                    maskImage: 'radial-gradient(ellipse 60% 70% at center, black 40%, transparent 100%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at center, black 40%, transparent 100%)'
                                }}
                            />
                            {/* Data Node overlay */}
                            <div className="absolute bottom-[52%] left-1/2 -translate-x-1/2">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 border-2 border-blue-500/60 animate-pulse" />
                            </div>
                        </div>

                        {/* Female Wireframe Image (Right) */}
                        <div className="absolute right-0 md:right-12 top-1/2 -translate-y-1/2 opacity-70">
                            <img
                                src={`${import.meta.env.BASE_URL}wireframe-female.png`}
                                alt="Female System"
                                className="h-[180px] sm:h-[250px] md:h-[350px] w-auto object-contain"
                                style={{
                                    filter: 'brightness(0.8) contrast(1.1)',
                                    maskImage: 'radial-gradient(ellipse 60% 70% at center, black 40%, transparent 100%)',
                                    WebkitMaskImage: 'radial-gradient(ellipse 60% 70% at center, black 40%, transparent 100%)'
                                }}
                            />
                            {/* Data Node overlay */}
                            <div className="absolute bottom-[52%] left-1/2 -translate-x-1/2">
                                <div className="w-6 h-6 rounded-full bg-rose-500/20 border-2 border-rose-500/60 animate-pulse" style={{ animationDelay: '0.5s' }} />
                            </div>
                        </div>

                        {/* Central SVG Animation */}
                        {/* Central SVG Animation */}
                        <svg viewBox="0 0 800 400" className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="xMidYMid meet">


                            {/* SVG Definitions for Masks */}
                            <defs>
                                {/* Edge Fade Mask for Node Images */}
                                <linearGradient id="edgeFadeH" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="20%" stopColor="white" stopOpacity="1" />
                                    <stop offset="80%" stopColor="white" stopOpacity="1" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                                <radialGradient id="radialFade" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                                    <stop offset="85%" stopColor="white" stopOpacity="1" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </radialGradient>
                                <linearGradient id="edgeFadeV" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="15%" stopColor="white" stopOpacity="1" />
                                    <stop offset="85%" stopColor="white" stopOpacity="1" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                                <mask id="imageFadeMask">
                                    <rect x="-50" y="147" width="100" height="64" fill="url(#radialFade)" />
                                </mask>
                                <mask id="imageFadeMaskBottom">
                                    <rect x="-50" y="247" width="100" height="64" fill="url(#radialFade)" />
                                </mask>
                                <mask id="imageFadeMaskRight">
                                    <rect x="750" y="147" width="100" height="64" fill="url(#radialFade)" />
                                </mask>
                                <mask id="imageFadeMaskRightBottom">
                                    <rect x="750" y="247" width="100" height="64" fill="url(#radialFade)" />
                                </mask>
                                <mask id="imageFadeMaskAxisLeft">
                                    <rect x="-50" y="47" width="100" height="64" fill="url(#radialFade)" />
                                </mask>
                                <mask id="imageFadeMaskAxisRight">
                                    <rect x="750" y="47" width="100" height="64" fill="url(#radialFade)" />
                                </mask>
                            </defs>

                            {/* Linkage Line - Connecting App Visual to Nebula */}
                            <g>
                                {/* Line Glow */}
                                <line x1="400" y1="90" x2="400" y2="200" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" className="blur-[2px]">
                                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                                </line>
                                {/* Main Solid Line */}
                                <line x1="400" y1="90" x2="400" y2="200" stroke="rgba(147,197,253,1)" strokeWidth="0.5" strokeDasharray="6 4">
                                    <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite" />
                                </line>
                            </g>

                            {/* Nexalis App Text Box - positioned above nebula */}
                            <NexalisAppVisual />

                            {/* Heart Wireframes - Positioned in the chest region of the figures */}
                            <g>
                                {/* Male Heart */}
                                <image
                                    href={`${import.meta.env.BASE_URL}human-heart-wireframe.png`}
                                    x="113"
                                    y="128"
                                    width="24"
                                    height="24"
                                    className="opacity-80"
                                />
                                {/* Male Heart Pulse */}
                                <circle cx="125" cy="140" r="10" fill="rgba(59,130,246,0.2)" stroke="rgba(59,130,246,0.6)" strokeWidth="2">
                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                                </circle>

                                {/* Female Heart */}
                                <image
                                    href={`${import.meta.env.BASE_URL}human-heart-wireframe.png`}
                                    x="663"
                                    y="128"
                                    width="24"
                                    height="24"
                                    className="opacity-80"
                                />
                                {/* Female Heart Pulse */}
                                <circle cx="675" cy="140" r="10" fill="rgba(225,29,72,0.2)" stroke="rgba(225,29,72,0.6)" strokeWidth="2">
                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="0.5s" />
                                </circle>
                            </g>


                            {/* Male Interface Nodes (Left of Figure) */}
                            <g>
                                {/* Node 1. Mantrix - Top Left */}
                                <g>
                                    {/* Pelvic Linkage - Blue Glow */}
                                    <line x1="125" y1="190" x2="50" y2="156" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" className="blur-[2px]">
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                                    </line>
                                    {/* Pelvic Linkage - Blue Solid Core */}
                                    <line x1="125" y1="190" x2="50" y2="156" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="6 4">
                                        <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite" />
                                    </line>

                                    <g>
                                        <text x="0" y="152" textAnchor="middle"
                                            fill="white" fontSize="8" fontWeight="600" letterSpacing="0.5"
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                        >
                                            Node 1. Mantrix™
                                        </text>
                                        <image
                                            href={`${import.meta.env.BASE_URL}mantrix-wireframe.png`}
                                            x="-48"
                                            y="158"
                                            width="96"
                                            height="42"
                                            preserveAspectRatio="xMidYMid meet"
                                            mask="url(#imageFadeMask)"
                                        />
                                    </g>
                                </g>

                                {/* Node 4. Lumiere - Bottom Left */}
                                <g>
                                    {/* Pelvic Linkage - Blue Glow */}
                                    <line x1="125" y1="190" x2="50" y2="256" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" className="blur-[2px]">
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                                    </line>
                                    {/* Pelvic Linkage - Blue Solid Core */}
                                    <line x1="125" y1="190" x2="50" y2="256" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="6 4">
                                        <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite" />
                                    </line>

                                    <g>
                                        <text x="0" y="252" textAnchor="middle"
                                            fill="white" fontSize="8" fontWeight="600" letterSpacing="0.5"
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                        >
                                            Node 4. Lumiere™
                                        </text>
                                        <image
                                            href={`${import.meta.env.BASE_URL}lumiere-wireframe.png`}
                                            x="-48"
                                            y="258"
                                            width="96"
                                            height="42"
                                            preserveAspectRatio="xMidYMid meet"
                                            mask="url(#imageFadeMaskBottom)"
                                        />
                                    </g>
                                </g>

                                {/* Node 5. AXIS - Center Left (Heart) */}
                                <g>
                                    {/* Heart Linkage - Blue Glow */}
                                    <line x1="125" y1="140" x2="50" y2="72" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5" className="blur-[2px]">
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                                    </line>
                                    {/* Heart Linkage - Blue Solid Core */}
                                    <line x1="125" y1="140" x2="50" y2="72" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="6 4">
                                        <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite" />
                                    </line>

                                    <g>
                                        <text x="0" y="52" textAnchor="middle"
                                            fill="white" fontSize="8" fontWeight="600" letterSpacing="0.5"
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                        >
                                            Node 5. AXIS™
                                        </text>
                                        <image
                                            href={`${import.meta.env.BASE_URL}axis-wireframe.png`}
                                            x="-48"
                                            y="58"
                                            width="96"
                                            height="42"
                                            preserveAspectRatio="xMidYMid meet"
                                            mask="url(#imageFadeMaskAxisLeft)"
                                        />
                                    </g>
                                </g>
                            </g>

                            {/* Female Interface Nodes (Right of Figure) */}
                            <g>
                                {/* Node 2. InnerSense - Top Right */}
                                <g>
                                    {/* Pelvic Linkage - Red Glow */}
                                    <line x1="675" y1="190" x2="750" y2="156" stroke="rgba(225,29,72,0.6)" strokeWidth="1.5" className="blur-[2px]">
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                                    </line>
                                    {/* Pelvic Linkage - Red Solid Core */}
                                    <line x1="675" y1="190" x2="750" y2="156" stroke="#E11D48" strokeWidth="0.5" strokeDasharray="6 4">
                                        <animate attributeName="stroke-dashoffset" values="0;-10" dur="3s" repeatCount="indefinite" />
                                    </line>

                                    <g>
                                        <text x="800" y="152" textAnchor="middle"
                                            fill="white" fontSize="8" fontWeight="600" letterSpacing="0.5"
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                        >
                                            Node 2. InnerSense™
                                        </text>
                                        <image
                                            href={`${import.meta.env.BASE_URL}innersense-wireframe.png`}
                                            x="755"
                                            y="159"
                                            width="90"
                                            height="40"
                                            preserveAspectRatio="xMidYMid meet"
                                            mask="url(#imageFadeMaskRight)"
                                        />
                                    </g>
                                </g>

                                {/* Node 3. Luminara - Bottom Right */}
                                <g>
                                    {/* Pelvic Linkage - Red Glow */}
                                    <line x1="675" y1="190" x2="750" y2="256" stroke="rgba(225,29,72,0.6)" strokeWidth="1.5" className="blur-[2px]">
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                                    </line>
                                    {/* Pelvic Linkage - Red Solid Core */}
                                    <line x1="675" y1="190" x2="750" y2="256" stroke="#E11D48" strokeWidth="0.5" strokeDasharray="6 4">
                                        <animate attributeName="stroke-dashoffset" values="0;-10" dur="3s" repeatCount="indefinite" />
                                    </line>

                                    <g>
                                        <text x="800" y="252" textAnchor="middle"
                                            fill="white" fontSize="8" fontWeight="600" letterSpacing="0.5"
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                        >
                                            Node 3. Luminara™
                                        </text>
                                        <image
                                            href={`${import.meta.env.BASE_URL}luminara-wireframe.png`}
                                            x="752"
                                            y="258"
                                            width="96"
                                            height="42"
                                            preserveAspectRatio="xMidYMid meet"
                                            mask="url(#imageFadeMaskRightBottom)"
                                        />
                                    </g>
                                </g>

                                {/* Node 5. AXIS - Center Right (Heart) */}
                                <g>
                                    {/* Heart Linkage - Red Glow */}
                                    <line x1="675" y1="140" x2="750" y2="72" stroke="rgba(225,29,72,0.6)" strokeWidth="1.5" className="blur-[2px]">
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite" />
                                    </line>
                                    {/* Heart Linkage - Red Solid Core */}
                                    <line x1="675" y1="140" x2="750" y2="72" stroke="#E11D48" strokeWidth="0.5" strokeDasharray="6 4">
                                        <animate attributeName="stroke-dashoffset" values="0;-10" dur="3s" repeatCount="indefinite" />
                                    </line>

                                    <g>
                                        <text x="800" y="52" textAnchor="middle"
                                            fill="white" fontSize="8" fontWeight="600" letterSpacing="0.5"
                                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                                        >
                                            Node 5. AXIS™
                                        </text>
                                        <image
                                            href={`${import.meta.env.BASE_URL}axis-wireframe.png`}
                                            x="752"
                                            y="58"
                                            width="96"
                                            height="42"
                                            preserveAspectRatio="xMidYMid meet"
                                            mask="url(#imageFadeMaskAxisRight)"
                                        />
                                    </g>
                                </g>
                            </g>

                            {/* Male side streaming data - wave pattern: up, fan out, down into nebula */}
                            <g className="opacity-70">
                                {/* Curved wave streams - travel upward, fan out at peak, curve down to center */}
                                <path d="M125 185 Q150 165 260 158 Q340 160 400 200" stroke="url(#streamGradientLeft)" strokeWidth="1.5" fill="none" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="12s" repeatCount="indefinite" />
                                </path>
                                <path d="M128 182 Q155 170 270 163 Q345 165 400 200" stroke="url(#streamGradientLeft)" strokeWidth="1.3" fill="none" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="13s" repeatCount="indefinite" begin="0.4s" />
                                </path>
                                <path d="M130 180 Q160 175 280 170 Q350 172 400 200" stroke="url(#streamGradientLeft)" strokeWidth="1.2" fill="none" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="11s" repeatCount="indefinite" begin="0.8s" />
                                </path>
                                <path d="M126 188 Q148 180 250 175 Q335 178 400 200" stroke="url(#streamGradientLeft)" strokeWidth="1.1" fill="none" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="10.5s" repeatCount="indefinite" begin="1.1s" />
                                </path>
                                <path d="M132 178 Q165 168 290 160 Q355 163 400 200" stroke="url(#streamGradientLeft)" strokeWidth="1" fill="none" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="11.5s" repeatCount="indefinite" begin="1.4s" />
                                </path>
                                {/* Additional wave streams with varying arcs */}
                                <path d="M122 190 Q140 162 240 158 Q330 160 400 200" stroke="url(#streamGradientLeft)" strokeWidth="0.6" fill="none" opacity="0.55" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="14s" repeatCount="indefinite" begin="1.7s" />
                                </path>
                                <path d="M127 184 Q152 173 265 165 Q342 168 400 200" stroke="url(#streamGradientLeft)" strokeWidth="0.6" fill="none" opacity="0.5" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="12.5s" repeatCount="indefinite" begin="2s" />
                                </path>
                                <path d="M124 186 Q145 178 255 173 Q338 175 400 200" stroke="url(#streamGradientLeft)" strokeWidth="0.5" fill="none" opacity="0.5" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="12s" repeatCount="indefinite" begin="2.3s" />
                                </path>
                                <path d="M133 175 Q170 163 300 158 Q360 160 400 200" stroke="url(#streamGradientLeft)" strokeWidth="0.5" fill="none" opacity="0.45" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="13.5s" repeatCount="indefinite" begin="2.6s" />
                                </path>
                                <path d="M129 180 Q158 170 275 164 Q348 167 400 200" stroke="url(#streamGradientLeft)" strokeWidth="0.6" fill="none" opacity="0.5" strokeDasharray="500 500">
                                    <animate attributeName="stroke-dashoffset" values="500;-500" dur="11.8s" repeatCount="indefinite" begin="2.9s" />
                                </path>
                            </g>

                            {/* Female side streaming data - inverse wave pattern: down, fan out, up into nebula */}
                            <g className="opacity-70">
                                {/* Female side streaming data - inverse wave pattern: down, fan out, up into nebula */}
                                <g className="opacity-70">
                                    {/* Curved wave streams - travel downward, fan out at bottom, curve up to center */}
                                    <path d="M675 190 Q650 235 540 240 Q460 237 400 200" stroke="url(#streamGradientRight)" strokeWidth="1.5" fill="none" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="12s" repeatCount="indefinite" begin="0.3s" />
                                    </path>
                                    <path d="M672 193 Q645 230 535 235 Q458 232 400 200" stroke="url(#streamGradientRight)" strokeWidth="1.3" fill="none" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="13s" repeatCount="indefinite" begin="0.6s" />
                                    </path>
                                    <path d="M670 195 Q640 225 530 228 Q455 225 400 200" stroke="url(#streamGradientRight)" strokeWidth="1.2" fill="none" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="11s" repeatCount="indefinite" begin="0.9s" />
                                    </path>
                                    <path d="M674 187 Q652 220 545 222 Q462 220 400 200" stroke="url(#streamGradientRight)" strokeWidth="1.1" fill="none" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="10.5s" repeatCount="indefinite" begin="1.1s" />
                                    </path>
                                    <path d="M668 197 Q638 232 525 238 Q452 235 400 200" stroke="url(#streamGradientRight)" strokeWidth="1" fill="none" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="11.5s" repeatCount="indefinite" begin="1.3s" />
                                    </path>
                                    {/* Additional wave streams with varying arcs */}
                                    <path d="M678 185 Q658 238 560 242 Q468 240 400 200" stroke="url(#streamGradientRight)" strokeWidth="0.6" fill="none" opacity="0.55" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="14s" repeatCount="indefinite" begin="1.5s" />
                                    </path>
                                    <path d="M673 191 Q648 227 535 232 Q457 228 400 200" stroke="url(#streamGradientRight)" strokeWidth="0.6" fill="none" opacity="0.5" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="12.5s" repeatCount="indefinite" begin="1.9s" />
                                    </path>
                                    <path d="M676 188 Q655 222 548 225 Q465 222 400 200" stroke="url(#streamGradientRight)" strokeWidth="0.5" fill="none" opacity="0.5" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="12s" repeatCount="indefinite" begin="2.2s" />
                                    </path>
                                    <path d="M667 200 Q635 237 520 242 Q448 238 400 200" stroke="url(#streamGradientRight)" strokeWidth="0.5" fill="none" opacity="0.45" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="13.5s" repeatCount="indefinite" begin="2.5s" />
                                    </path>
                                    <path d="M671 194 Q642 228 532 233 Q455 230 400 200" stroke="url(#streamGradientRight)" strokeWidth="0.6" fill="none" opacity="0.5" strokeDasharray="500 500">
                                        <animate attributeName="stroke-dashoffset" values="500;-500" dur="11.8s" repeatCount="indefinite" begin="2.8s" />
                                    </path>
                                </g>
                            </g>

                            {/* Background glow effects - Concentrated central glow */}
                            <g className="blur-lg">
                                {/* Blue glow - more concentrated */}
                                <circle cx="400" cy="200" r="35" fill="rgba(59,130,246,0.4)">
                                    <animate attributeName="r" values="25;40;28;35;25" dur="8s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.3;0.6;0.4;0.55;0.3" dur="8s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="400" cy="200" r="28" fill="rgba(59,130,246,0.5)">
                                    <animate attributeName="r" values="20;30;25;32;20" dur="6.6s" repeatCount="indefinite" begin="0.5s" />
                                    <animate attributeName="opacity" values="0.35;0.65;0.45;0.3;0.35" dur="6.6s" repeatCount="indefinite" begin="0.5s" />
                                </circle>

                                {/* Red glow - more concentrated */}
                                <circle cx="400" cy="200" r="32" fill="rgba(225,29,72,0.4)">
                                    <animate attributeName="r" values="22;35;28;38;22" dur="7.4s" repeatCount="indefinite" begin="0.3s" />
                                    <animate attributeName="opacity" values="0.3;0.6;0.45;0.5;0.3" dur="7.4s" repeatCount="indefinite" begin="0.3s" />
                                </circle>
                                <circle cx="400" cy="200" r="24" fill="rgba(225,29,72,0.55)">
                                    <animate attributeName="r" values="18;28;22;30;18" dur="5.8s" repeatCount="indefinite" begin="0.8s" />
                                    <animate attributeName="opacity" values="0.4;0.7;0.45;0.55;0.4" dur="5.8s" repeatCount="indefinite" begin="0.8s" />
                                </circle>

                                {/* Purple fusion glow - tight core */}
                                <circle cx="400" cy="200" r="20" fill="rgba(180,100,220,0.6)">
                                    <animate attributeName="r" values="15;25;18;28;15" dur="5s" repeatCount="indefinite" begin="0.2s" />
                                    <animate attributeName="opacity" values="0.4;0.8;0.6;0.5;0.4" dur="5s" repeatCount="indefinite" begin="0.2s" />
                                </circle>
                            </g>

                            {/* Orbital paths for mixing particles around nebula */}
                            <defs>
                                {/* Inner orbit - male blue particles */}
                                <path id="orbitInner" d="M400 200 m-18,0 a18,18 0 1,0 36,0 a18,18 0 1,0 -36,0" fill="none" />
                                {/* Outer orbit - female red particles */}
                                <path id="orbitOuter" d="M400 200 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" fill="none" />
                                {/* Middle orbit - mixed */}
                                <path id="orbitMiddle" d="M400 200 m-28,0 a28,28 0 1,0 56,0 a28,28 0 1,0 -56,0" fill="none" />
                            </defs>

                            {/* Orbiting blue particles (male data) - multiple chaotic orbits */}
                            <g>
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <circle key={`orbit-blue-${i}`} r={1.2 + (i % 3) * 0.4} fill="rgba(59,130,246,0.85)">
                                        <animateMotion dur={`${5 + i * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.3}s`}>
                                            <mpath href="#orbitInner" />
                                        </animateMotion>
                                        <animate attributeName="opacity" values="0.5;1;0.5" dur={`${5 + i * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
                                    </circle>
                                ))}
                            </g>

                            {/* Orbiting red particles (female data) - multiple chaotic orbits */}
                            <g>
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <circle key={`orbit-red-${i}`} r={1.2 + (i % 3) * 0.4} fill="rgba(225,29,72,0.85)">
                                        <animateMotion dur={`${5.6 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.35}s`}>
                                            <mpath href="#orbitOuter" />
                                        </animateMotion>
                                        <animate attributeName="opacity" values="0.5;1;0.5" dur={`${5.6 + i * 0.7}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
                                    </circle>
                                ))}
                            </g>

                            {/* Dense slurry - mixing particles swirling chaotically */}
                            <g>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                                    <circle
                                        key={`slurry-${i}`}
                                        r={0.8 + (i % 4) * 0.3}
                                        fill={i % 2 === 0 ? "rgba(59,130,246,0.9)" : "rgba(225,29,72,0.9)"}
                                    >
                                        <animateMotion dur={`${4 + (i % 5) * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.2}s`}>
                                            <mpath href="#orbitMiddle" />
                                        </animateMotion>
                                        <animate attributeName="opacity" values="0.4;1;0.4" dur={`${4 + (i % 5) * 0.8}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
                                    </circle>
                                ))}
                            </g>

                            {/* Tiny core particles - very fast spinning at center */}
                            <g>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                                    <circle
                                        key={`core-${i}`}
                                        r={0.6 + (i % 3) * 0.2}
                                        fill={i % 3 === 0 ? "rgba(59,130,246,0.95)" : i % 3 === 1 ? "rgba(225,29,72,0.95)" : "rgba(180,130,220,0.9)"}
                                    >
                                        <animateMotion dur={`${3 + (i % 4) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.15}s`}>
                                            <mpath href="#orbitInner" />
                                        </animateMotion>
                                        <animate attributeName="opacity" values="0.6;1;0.6" dur={`${3 + (i % 4) * 0.5}s`} repeatCount="indefinite" begin={`${i * 0.15}s`} />
                                    </circle>
                                ))}
                            </g>

                            {/* Sparks - random bursts */}
                            <g>
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <circle
                                        key={`spark-${i}`}
                                        cx={400 + Math.cos(i * 1.047) * (12 + i * 4)}
                                        cy={200 + Math.sin(i * 1.047) * (12 + i * 4)}
                                        r={0.8}
                                        fill={i % 2 === 0 ? "rgba(147,197,253,0.9)" : "rgba(251,113,133,0.9)"}
                                    >
                                        <animate attributeName="opacity" values="0;1;0" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
                                        <animate attributeName="r" values="0.5;1.5;0.5" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
                                    </circle>
                                ))}
                            </g>

                            {/* Center fusion glow - intense pulsing core */}
                            <circle cx="400" cy="200" r="10" fill="url(#fusionGradient)" opacity="0.9">
                                <animate attributeName="r" values="8;16;8" dur="5s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.6;1;0.6" dur="5s" repeatCount="indefinite" />
                            </circle>

                            <defs>
                                <radialGradient id="fusionGradient" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                                    <stop offset="50%" stopColor="rgba(200,150,255,0.8)" />
                                    <stop offset="100%" stopColor="transparent" />
                                </radialGradient>
                            </defs>

                            {/* Sparkling data particles - Left side (fade out as they reach nebula) */}
                            <g>
                                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                    <g key={`left-particle-${i}`}>
                                        <circle r={1.5 + (i % 3) * 0.5} fill="rgba(59,130,246,0.9)">
                                            <animateMotion dur={`${4.5 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.25}s`}>
                                                <mpath href="#streamPathLeft" />
                                            </animateMotion>
                                            <animate attributeName="opacity" values="0;0.6;1;0.8;0.3;0" dur={`${4.5 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.25}s`} keyTimes="0;0.2;0.4;0.6;0.85;1" />
                                            <animate attributeName="r" values="0.5;1.5;2;1.5;0.8;0" dur={`${4.5 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.25}s`} keyTimes="0;0.2;0.4;0.6;0.85;1" />
                                        </circle>
                                    </g>
                                ))}
                            </g>

                            {/* Sparkling data particles - Right side (fade out as they reach nebula) */}
                            <g>
                                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                    <g key={`right-particle-${i}`}>
                                        <circle r={1.5 + (i % 3) * 0.5} fill="rgba(225,29,72,0.9)">
                                            <animateMotion dur={`${4.5 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.25 + 0.15}s`}>
                                                <mpath href="#streamPathRight" />
                                            </animateMotion>
                                            <animate attributeName="opacity" values="0;0.6;1;0.8;0.3;0" dur={`${4.5 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.25 + 0.15}s`} keyTimes="0;0.2;0.4;0.6;0.85;1" />
                                            <animate attributeName="r" values="0.5;1.5;2;1.5;0.8;0" dur={`${4.5 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.25 + 0.15}s`} keyTimes="0;0.2;0.4;0.6;0.85;1" />
                                        </circle>
                                    </g>
                                ))}
                            </g>

                            {/* Heart to Nebula Data Particles - Ribbon Flow */}
                            <g>
                                {/* Male Heart Data (Blue) - Distributed across 3 paths */}
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <circle key={`male-heart-dot-${i}`} r={1 + (i % 2) * 0.4} fill="#3B82F6">
                                        <animateMotion dur={`${5 + i * 1.2}s`} repeatCount="indefinite" begin={`${i * 1}s`}>
                                            <mpath href={i % 3 === 0 ? "#heartPathLeft" : i % 3 === 1 ? "#heartPathLeftUpper" : "#heartPathLeftLower"} />
                                        </animateMotion>
                                        <animate attributeName="opacity" values="0;1;0.8;0" dur={`${5 + i * 1.2}s`} repeatCount="indefinite" begin={`${i * 1}s`} keyTimes="0;0.2;0.8;1" />
                                        <circle r={2.5} fill="rgba(59,130,246,0.3)" className="blur-[2px]">
                                            <animate attributeName="opacity" values="0;0.6;0" dur={`${5 + i * 1.2}s`} repeatCount="indefinite" begin={`${i * 1}s`} />
                                        </circle>
                                    </circle>
                                ))}

                                {/* Female Heart Data (Red) - Distributed across 3 paths */}
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <circle key={`female-heart-dot-${i}`} r={1 + (i % 2) * 0.4} fill="#E11D48">
                                        <animateMotion dur={`${5 + i * 1.2}s`} repeatCount="indefinite" begin={`${i * 1 + 0.5}s`}>
                                            <mpath href={i % 3 === 0 ? "#heartPathRight" : i % 3 === 1 ? "#heartPathRightUpper" : "#heartPathRightLower"} />
                                        </animateMotion>
                                        <animate attributeName="opacity" values="0;1;0.8;0" dur={`${5 + i * 1.2}s`} repeatCount="indefinite" begin={`${i * 1 + 0.5}s`} keyTimes="0;0.2;0.8;1" />
                                        <circle r={2.5} fill="rgba(225,29,72,0.3)" className="blur-[2px]">
                                            <animate attributeName="opacity" values="0;0.6;0" dur={`${5 + i * 1.2}s`} repeatCount="indefinite" begin={`${i * 1 + 0.5}s`} />
                                        </circle>
                                    </circle>
                                ))}
                            </g>

                            {/* Unified Heart to Nebula Continuous Streams - Multi-layered Ribbon */}
                            <g className="opacity-30">
                                {/* Male Unified Ribbon */}
                                <path d="M125 140 Q260 110 400 200" stroke="rgba(59,130,246,0.3)" strokeWidth="1" fill="none" />
                                <path d="M125 140 Q260 130 400 200" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" fill="none" />
                                <path d="M125 140 Q260 90 400 200" stroke="rgba(59,130,246,0.2)" strokeWidth="0.8" fill="none" />

                                <path d="M125 140 Q260 110 400 200" stroke="#3B82F6" strokeWidth="0.5" fill="none" strokeDasharray="5 15">
                                    <animate attributeName="stroke-dashoffset" values="400;0" dur="10s" repeatCount="indefinite" />
                                </path>
                                <path d="M125 140 Q260 130 400 200" stroke="#3B82F6" strokeWidth="0.4" fill="none" strokeDasharray="8 20" opacity="0.6">
                                    <animate attributeName="stroke-dashoffset" values="300;0" dur="12s" repeatCount="indefinite" begin="-2s" />
                                </path>

                                {/* Female Unified Ribbon */}
                                <path d="M675 140 Q650 200 535 230 Q460 225 400 200" stroke="rgba(225,29,72,0.3)" strokeWidth="1" fill="none" />
                                <path d="M675 140 Q650 220 535 240 Q460 235 400 200" stroke="rgba(225,29,72,0.2)" strokeWidth="0.8" fill="none" />
                                <path d="M675 140 Q650 180 535 220 Q460 215 400 200" stroke="rgba(225,29,72,0.2)" strokeWidth="0.8" fill="none" />

                                <path d="M675 140 Q650 200 535 230 Q460 225 400 200" stroke="#E11D48" strokeWidth="0.5" fill="none" strokeDasharray="5 15">
                                    <animate attributeName="stroke-dashoffset" values="400;0" dur="10s" repeatCount="indefinite" begin="0.5s" />
                                </path>
                                <path d="M675 140 Q650 220 535 240 Q460 235 400 200" stroke="#E11D48" strokeWidth="0.4" fill="none" strokeDasharray="8 20" opacity="0.6">
                                    <animate attributeName="stroke-dashoffset" values="300;0" dur="12s" repeatCount="indefinite" begin="-1s" />
                                </path>
                            </g>

                            {/* Bright node flashes along streams */}
                            <g className="opacity-60">
                                <circle cx="200" cy="195" r="2" fill="rgba(59,130,246,0.8)">
                                    <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" />
                                    <animate attributeName="r" values="1;3;1" dur="4s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="280" cy="200" r="2" fill="rgba(59,130,246,0.8)">
                                    <animate attributeName="opacity" values="0;1;0" dur="4.5s" repeatCount="indefinite" begin="0.5s" />
                                    <animate attributeName="r" values="1;3;1" dur="4.5s" repeatCount="indefinite" begin="0.5s" />
                                </circle>
                                <circle cx="600" cy="195" r="2" fill="rgba(225,29,72,0.8)">
                                    <animate attributeName="opacity" values="0;1;0" dur="4s" repeatCount="indefinite" begin="0.3s" />
                                    <animate attributeName="r" values="1;3;1" dur="4s" repeatCount="indefinite" begin="0.3s" />
                                </circle>
                                <circle cx="520" cy="200" r="2" fill="rgba(225,29,72,0.8)">
                                    <animate attributeName="opacity" values="0;1;0" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
                                    <animate attributeName="r" values="1;3;1" dur="4.5s" repeatCount="indefinite" begin="0.8s" />
                                </circle>
                            </g>

                            {/* Paths and gradients */}
                            <defs>
                                {/* Left particle path - curved wave matching male streams */}
                                <path id="streamPathLeft" d="M127 184 Q152 168 265 160 Q342 163 400 200" />
                                {/* Right particle path - inverse wave matching female streams */}
                                <path id="streamPathRight" d="M673 191 Q648 227 535 232 Q457 228 400 200" />
                                {/* Heart stream paths - arching from chest to nebula with ribbon offsets */}
                                <path id="heartPathLeft" d="M125 140 Q260 110 400 200" />
                                <path id="heartPathLeftLower" d="M125 140 Q260 130 400 200" />
                                <path id="heartPathLeftUpper" d="M125 140 Q260 90 400 200" />

                                <path id="heartPathRight" d="M675 140 Q650 200 535 230 Q460 225 400 200" />
                                <path id="heartPathRightLower" d="M675 140 Q650 220 535 240 Q460 235 400 200" />
                                <path id="heartPathRightUpper" d="M675 140 Q650 180 535 220 Q460 215 400 200" />
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
                            </defs>

                            {/* Labels */}
                            <text x="120" y="350" textAnchor="middle" className="fill-slate-400 text-xs uppercase tracking-wider">Male System</text>
                            <text x="680" y="350" textAnchor="middle" className="fill-slate-400 text-xs uppercase tracking-wider">Female System</text>
                            <text x="400" y="300" textAnchor="middle" className="fill-slate-300 text-sm font-medium">Nexalis AI Engine</text>
                        </svg>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
                        <span className="text-xs uppercase tracking-wider text-slate-400">Scroll to explore</span>
                        <div className="w-px h-8 bg-gradient-to-b from-slate-500 to-transparent animate-pulse" />
                    </div>
                </section >

                {/* System Summary */}
                <section className="py-32 px-8 border-t border-white/5">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        <h2 className="text-4xl font-black tracking-tight">Nexalis System Overview</h2>
                        <div className="space-y-6 text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
                            <p>
                                Nexalis is a health monitoring system designed to track intimate wellness over time—not just during doctor visits, but throughout your daily life.
                            </p>
                            <p className="text-blue-400 font-medium">
                                Instead of snapshots, you get a complete picture.
                            </p>
                            <p className="text-base text-slate-400">
                                Small, comfortable sensors collect data over hours, days, and weeks. They learn what's normal for you, spot changes early, and reveal patterns that traditional checkups miss.
                            </p>
                        </div>
                    </div>
                </section>

                {/* System Architecture Overview */}
                <section className="py-24 px-8 border-t border-white/5">
                    <div className="max-w-5xl mx-auto space-y-32">

                        {/* 01. Integration Layer */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500/50" />
                                <h3 className="text-sm font-bold text-slate-400">01</h3>
                            </div>
                            <div className="space-y-6 max-w-3xl">
                                <h2 className="text-5xl font-black">Shared Intelligence</h2>
                                <p className="text-xl text-slate-300 leading-relaxed">
                                    All sensor data flows into an AI layer that turns raw signals into simple, useful insights about your health patterns and trends.
                                </p>
                            </div>
                        </div>

                        {/* 02. Sensing Nodes */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500/50" />
                                <h3 className="text-sm font-bold text-slate-400">02</h3>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-5xl font-black">Sensing Nodes</h2>
                                <p className="text-slate-400 text-lg">Each sensor is designed to be comfortable, discreet, and easy to use in everyday life.</p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                                {/* Mantrix */}
                                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4 hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-white">Mantrix™</h3>
                                        <span className="text-xs text-blue-500 font-bold uppercase tracking-wider">Active</span>
                                    </div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Structural & Stability Sensor (Male)</p>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        A soft, sealed wearable designed for passive, non-invasive monitoring. It quietly captures
                                        response timing, stability patterns, and subtle day-to-day variability, building a personal
                                        baseline that makes it easy to spot meaningful changes over time.
                                    </p>
                                </div>

                                {/* InnerSense */}
                                <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4 opacity-80 hover:opacity-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-200">InnerSense™</h3>
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Planned</span>
                                    </div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pelvic Health Sensor (Female)</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        A sealed, passive intravaginal wearable that captures real pelvic physiology during everyday
                                        life. It tracks internal temperature trends, tissue state, and circulatory signals over time,
                                        with zero daily effort required.
                                    </p>
                                </div>

                                {/* Lumiere */}
                                <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4 opacity-60 hover:opacity-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-300">Lumiere™</h3>
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Planned</span>
                                    </div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Size & Shape Mapping (Male)</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        A quick fit-profiling device that captures your structural footprint through a simple
                                        guided self-scan. No cameras, no photos, ever. Just a personalized size and shape
                                        reference that's actually useful.
                                    </p>
                                </div>

                                {/* Luminara */}
                                <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4 opacity-60 hover:opacity-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-300">Luminara™</h3>
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Planned</span>
                                    </div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Internal Comfort Mapping (Female)</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        An internal mapping wand that captures your unique pressure and geometry profile in a
                                        single session. Its soft, conforming design means real comfort data instead of assumptions.
                                    </p>
                                </div>

                                {/* Axis */}
                                <div className="p-8 border border-white/5 bg-white/[0.01] space-y-4 opacity-60 hover:opacity-100 transition-all">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-slate-300">Axis™</h3>
                                        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Planned</span>
                                    </div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Whole-Body Context Sensor</p>
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        The context anchor for the whole Nexalis system. It tracks your cardiovascular load,
                                        recovery state, autonomic balance, and daily rhythm so all your intimate health data
                                        can be understood in the context of your whole body.
                                    </p>
                                </div>

                                {/* Placeholder/Future */}
                                <div className="p-8 border border-dashed border-white/5 bg-transparent flex items-center justify-center">
                                    <span className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Future Expansion</span>
                                </div>
                            </div>
                        </div>

                        {/* Privacy-First Design Section */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-500/50" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Core Philosophy</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <h2 className="text-5xl font-black text-white">Privacy-First Design</h2>
                                        <p className="text-lg text-slate-300 leading-relaxed">
                                            Every piece of the Nexalis system is built with privacy as a starting point, not an
                                            afterthought. From encryption at the sensor level to abstracted outputs only, your data
                                            stays yours.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            <p className="text-sm text-slate-300 font-medium">Data encrypted at the sensor level, before it ever leaves the device</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            <p className="text-sm text-slate-300 font-medium">No explicit imagery, photos, or anatomical capture. Ever.</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            <p className="text-sm text-slate-300 font-medium">Abstract patterns only. Raw measurements are never exposed.</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            <p className="text-sm text-slate-300 font-medium">User-owned data with full control over sharing and deletion</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 border border-cyan-500/20 bg-cyan-500/[0.02] space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">Security Architecture</span>
                                    </div>
                                    <div className="space-y-4 text-sm text-slate-400">
                                        <p>All sensing nodes implement end-to-end encryption, ensuring data remains protected from capture through cloud storage.</p>
                                        <p className="text-xs text-slate-500 italic">Technical specifications are restricted to authorized engineering personnel.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 03. Nexalis Intelligence Layer */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-blue-500/50" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">03</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-16 items-center">
                                <div className="space-y-6">
                                    <h2 className="text-5xl font-black">Intelligence Layer</h2>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        Data from all nodes is synchronized, time-aligned, and turned into interpretable patterns
                                        rather than raw numbers.
                                    </p>
                                    <div className="space-y-4 py-6">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <p className="text-sm text-slate-300 font-medium">Prioritizes change over time over absolute values</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <p className="text-sm text-slate-300 font-medium">Supports early signal detection & recovery tracking</p>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <p className="text-sm text-slate-300 font-medium">Provides insight without explicit visualization</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-10 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                                    <div className="aspect-square flex flex-col justify-center space-y-6">
                                        <div className="h-0.5 w-full bg-white/10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-blue-500/50 -translate-x-full animate-[shimmer_2s_infinite]" />
                                        </div>
                                        <div className="h-0.5 w-2/3 bg-white/10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-blue-500/50 -translate-x-full animate-[shimmer_3s_infinite]" />
                                        </div>
                                        <div className="h-0.5 w-full bg-white/10 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-blue-500/50 -translate-x-full animate-[shimmer_2.5s_infinite]" />
                                        </div>
                                        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest pt-4">Pattern Abstraction Logic</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 04. The Nexalis Health Intelligence Engine */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-emerald-500/50" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">04</h3>
                            </div>
                            <div className="space-y-12 max-w-5xl">
                                <div className="space-y-6">
                                    <h2 className="text-5xl font-black text-white">Nexalis Health Intelligence Engine</h2>
                                    <p className="text-xl text-slate-300 leading-relaxed max-w-4xl">
                                        The Nexalis Health Intelligence Engine turns device data into longitudinal health markers. It tracks how your baseline changes, how you respond, and how you recover across real life (not just isolated snapshots). It runs two physiology tracks and outputs two views from the same underlying intelligence.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Male Track */}
                                    <div className="p-8 border border-white/5 bg-white/[0.02] space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-blue-400">Male Track</h3>
                                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Erectile Function & Penile Health</p>
                                        </div>
                                        <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                                            <p><strong className="text-white">What it tracks:</strong> Structural stability patterns, vascular response and recovery curves, thermal context trends, motion-artifact separation, plus long-term drift vs sudden deviations.</p>
                                            <p><strong className="text-white">Consumer output:</strong> Your baseline and trend direction, consistency and stability insights, recovery progress, and intervention summaries.</p>
                                            <p><strong className="text-white">Clinician output:</strong> Longitudinal marker panels, episode summaries with recovery trajectories, pattern classification cues, and export-ready visit summaries.</p>
                                        </div>
                                    </div>

                                    {/* Female Track */}
                                    <div className="p-8 border border-white/5 bg-white/[0.02] space-y-6">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-rose-400">Female Track</h3>
                                            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Menopause & Vaginal/Pelvic Health</p>
                                        </div>
                                        <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
                                            <p><strong className="text-white">What it tracks:</strong> Pelvic physiology trend signatures, internal thermal regulation patterns, hydration and tissue-state trends, comfort-context markers, and menopause-related baseline shifts.</p>
                                            <p><strong className="text-white">Consumer output:</strong> Baseline tracking, change detection, symptom-linked journaling, recovery and stability insights, and intervention summaries.</p>
                                            <p><strong className="text-white">Clinician output:</strong> Longitudinal panels aligned to symptom timelines, episode-level deviation summaries, menopause transition trend tracking, and follow-up documentation.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Intervention & Outcomes Layer */}
                                <div className="p-8 border-t border-white/10 space-y-6">
                                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Intervention & Outcomes Layer</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                                        The engine correlates outcomes against lifestyle changes (sleep, stress, nutrition), medications, clinical protocols, and drug interaction patterns.
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                                        {['Response Signatures', 'Pre/Post Deltas', 'Time-to-Recovery', 'Consistency Shifts'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-1 h-3 bg-emerald-500/50" />
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 05. The Nexalis Harmony Engine */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-gradient-to-r from-transparent to-purple-500/50" />
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">05</h3>
                            </div>
                            <div className="space-y-8 max-w-5xl">
                                <div className="space-y-4">
                                    <h2 className="text-5xl font-black text-white">The Nexalis Harmony Engine</h2>
                                    <h3 className="text-lg text-purple-400 uppercase tracking-[0.2em] font-bold">Cross-Physiology Correlation Layer</h3>
                                </div>

                                <p className="text-xl text-slate-300 leading-relaxed font-medium max-w-4xl">
                                    The Nexalis Harmony Engine is the system’s correlation layer, designed to securely analyze and align male and female health data across structure, response, and fitment metrics.
                                </p>

                                <div className="grid md:grid-cols-2 gap-12 pt-8">
                                    <div className="space-y-6 text-base text-slate-400 leading-relaxed">
                                        <p>
                                            Rather than evaluating individuals in isolation, the Harmony Engine compares abstracted, non-identifying patterns (stability, timing, pressure distribution, recovery dynamics) across complementary datasets. This enables insights into alignment, comfort balance, and physiological synchrony without exposing raw measurements or explicit anatomy.
                                        </p>
                                        <p>
                                            Each individual maintains a private, encrypted Harmony Profile generated from their longitudinal data. Profiles are owned by the user, stored securely, and never exposed as raw signals. Correlation occurs at the pattern level, ensuring privacy while allowing meaningful cross-analysis.
                                        </p>
                                    </div>
                                    <div className="p-10 border-l-2 border-purple-500/30 bg-purple-500/[0.02] flex items-center">
                                        <p className="text-lg text-slate-300 italic leading-relaxed">
                                            "The result is a system capable of understanding how two physiologies interact—clinically, structurally, and contextually—while preserving autonomy, discretion, and data integrity."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 06. The Harmony Profile System - Epic Finale */}
                        <div className="space-y-32 pb-40">
                            {/* Hero Header */}
                            <div className="space-y-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose-500/50" />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">06</h3>
                                </div>
                                <div className="space-y-8 max-w-5xl">
                                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-white">
                                        The Harmony <br />
                                        <span className="text-rose-500 underline decoration-rose-500/30 decoration-8 underline-offset-8">Profile.</span>
                                    </h2>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">Private · Pattern-Based · Intentional</p>

                                    <div className="grid md:grid-cols-2 gap-16 pt-12">
                                        <p className="text-2xl text-slate-300 leading-tight font-medium">
                                            A Harmony Profile is a private, encrypted representation of how an individual’s body tends
                                            to align, respond, and recover—expressed entirely through abstracted patterns.
                                        </p>
                                        <p className="text-lg text-slate-400 leading-relaxed">
                                            Instead of explicit imagery or raw measurements, Nexalis uses symbolic visuals to communicate
                                            compatibility through intuitive color fields, gradients, and motion cues. It is a safer,
                                            more intentional signal of physiological alignment.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Exchange Grid */}
                            <div className="space-y-12">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-rose-500/80">Profile Exchange (User-Controlled)</h4>
                                <div className="grid md:grid-cols-3 gap-6">
                                    {[
                                        {
                                            title: 'Alignment Previews',
                                            desc: 'Color-based visualizations showing harmony, overlap, or contrast zones between two profiles.',
                                            icon: '◈'
                                        },
                                        {
                                            title: 'Compatibility Fields',
                                            desc: 'Animated fields that respond dynamically when two profiles are brought into proximity.',
                                            icon: '◌'
                                        },
                                        {
                                            title: 'Abstract Signatures',
                                            desc: 'Unique fit signatures represented through shifting shapes and motion patterns.',
                                            icon: '⌇'
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="p-8 border border-white/10 bg-white/[0.02] space-y-4 group hover:bg-rose-500/[0.03] transition-colors">
                                            <div className="text-2xl text-rose-500/50 group-hover:text-rose-500 transition-colors font-mono">{item.icon}</div>
                                            <h5 className="font-bold text-white uppercase tracking-widest text-sm">{item.title}</h5>
                                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 pt-8">
                                    <div className="space-y-6">
                                        <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                            Harmony Profiles can be shared selectively, intentionally, and reversibly.
                                            Users decide when, with whom, and for how long a profile is visible.
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <span className="px-3 py-1 border border-white/10 text-[9px] uppercase tracking-widest text-slate-500 font-black">Mutual-Reveal Mode</span>
                                            <span className="px-3 py-1 border border-white/10 text-[9px] uppercase tracking-widest text-slate-500 font-black">Expiring Tokens</span>
                                            <span className="px-3 py-1 border border-white/10 text-[9px] uppercase tracking-widest text-slate-500 font-black">Universal Revocation</span>
                                        </div>
                                    </div>
                                    <div className="p-6 border border-dashed border-rose-500/20 bg-rose-500/[0.01]">
                                        <p className="text-[10px] text-rose-500/60 uppercase font-black tracking-widest mb-2">Zero-Linkage Integrity</p>
                                        <p className="text-xs text-slate-600 italic">
                                            At no point are photos, explicit metrics, or identifiable physical details exchanged or stored within the Harmony layer.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Match Typing & Insight */}
                            <div className="grid md:grid-cols-2 gap-24 items-center">
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <h4 className="text-3xl font-black text-white">Best-Fit Match Typing</h4>
                                        <p className="text-base text-slate-400 leading-relaxed">
                                            Over time, the system learns tendencies across structure, timing, pressure, and recovery to
                                            develop a high-level compatibility pattern.
                                        </p>
                                        <div className="p-6 bg-gradient-to-br from-rose-500/10 to-transparent border-l-2 border-rose-500">
                                            <p className="text-sm text-white font-medium italic">
                                                "This is not a score and not a ranking. It is a fit-based reference grounded in real
                                                physiological data, not assumptions or aesthetics."
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h4 className="text-3xl font-black text-white">Preference Discovery</h4>
                                        <p className="text-base text-slate-400 leading-relaxed">
                                            Beyond matching, Harmony Profiles help you understand yourself by highlighting natural
                                            comfort ranges, responsiveness, and how preferences shift across time and state.
                                        </p>
                                        <div className="grid grid-cols-1 gap-3">
                                            {['Natural Alignment Styles', 'Stability vs Variability Tendencies', 'Stress-State Dynamics'].map((tag, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-1 h-3 bg-rose-500/30" />
                                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">{tag}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Visual Representation Placeholder */}
                                <div className="relative aspect-square">
                                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-amber-500/10 to-transparent rounded-full blur-[120px] animate-pulse" />
                                    <div className="relative h-full w-full border border-white/5 bg-white/[0.01] backdrop-blur-3xl overflow-hidden flex flex-col items-center justify-center p-12 text-center space-y-8">
                                        <div className="w-32 h-32 rounded-full border border-rose-500/30 flex items-center justify-center relative">
                                            <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-[spin_20s_linear_infinite]" />
                                            <div className="absolute inset-4 border border-rose-500/40 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-mono text-rose-500 uppercase tracking-[0.4em] font-black">Harmony Signature</div>
                                            <div className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Type Ref: A-42 // Responsive Stability</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Final Privacy Manifesto */}
                            <div className="pt-32 border-t border-white/5 text-center space-y-12">
                                <div className="inline-flex items-center gap-4 px-6 py-2 border border-rose-500/20 bg-rose-500/[0.03] rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-500">Security by Design</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                                    {[
                                        'Fully Encrypted',
                                        'Abstract Patterns',
                                        'Non-Visual',
                                        'Zero Presumption',
                                        'User Owned'
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-1 text-center">
                                            <div className="text-white font-black text-xs uppercase tracking-tighter">{stat}</div>
                                            <div className="h-px w-8 bg-rose-500/20 mx-auto" />
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-slate-500 italic max-w-2xl mx-auto pt-8">
                                    "A system designed to reduce guesswork and trial-and-error, replacing uncomfortable
                                    uncertainty with physiological intelligence and intentional autonomy."
                                </p>
                            </div>
                        </div>

                        {/* 07. Nexalis Sigils Section */}
                        <div className="space-y-16 pt-32">
                            <div className="space-y-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-violet-500/50" />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">07</h3>
                                </div>
                                <div className="space-y-8 max-w-5xl">
                                    <div className="space-y-4">
                                        <h2 className="text-6xl md:text-7xl font-black tracking-tighter leading-[0.85] text-white">
                                            Nexalis <br />
                                            <span className="text-violet-500 underline decoration-violet-500/30 decoration-8 underline-offset-8">Sigils™</span>
                                        </h2>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">Your Physiology · Your Symbol · Your Story</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-16 pt-8">
                                        <p className="text-2xl text-slate-300 leading-tight font-medium">
                                            Think of Nexalis Sigils like an astrology sign—but for your intimate physical variability.
                                        </p>
                                        <p className="text-lg text-slate-400 leading-relaxed">
                                            Where astrology uses birth charts to describe personality and compatibility, Sigils use
                                            longitudinal physiological patterns to represent your unique body intelligence—how you
                                            respond, recover, and align over time.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Astrology Comparison */}
                            <div className="p-10 border-l-2 border-violet-500/30 bg-violet-500/[0.02] max-w-4xl">
                                <p className="text-lg text-slate-300 italic leading-relaxed">
                                    "Just as someone might introduce themselves as a 'Scorpio rising' or mention their
                                    'Mercury retrograde,' your Sigil becomes an abstract, privacy-preserving way to
                                    communicate intimate physiological traits without exposing explicit data or imagery."
                                </p>
                            </div>

                            {/* Sigil Properties Grid */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4 hover:border-violet-500/30 transition-colors">
                                    <div className="text-3xl text-violet-500/60 font-mono">☽</div>
                                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">Pattern Archetype</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Your Sigil represents a behavioral archetype derived from how your body patterns
                                        express themselves: timing, intensity, consistency, and recovery dynamics.
                                    </p>
                                </div>
                                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4 hover:border-violet-500/30 transition-colors">
                                    <div className="text-3xl text-violet-500/60 font-mono">◇</div>
                                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">Compatibility Language</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Sigils give you a shared language for discussing alignment between partners. They
                                        enable meaningful conversation without clinical exposure or awkward specificity.
                                    </p>
                                </div>
                                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4 hover:border-violet-500/30 transition-colors">
                                    <div className="text-3xl text-violet-500/60 font-mono">⬡</div>
                                    <h4 className="font-bold text-white uppercase tracking-widest text-sm">Evolving Identity</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Unlike static zodiac signs, Sigils evolve with you. They reflect changes in health,
                                        lifestyle, and physiology over time. Your Sigil is a living symbol.
                                    </p>
                                </div>
                            </div>

                            {/* What Sigils Capture */}
                            <div className="space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-violet-500/80">What Your Sigil Represents</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { label: 'Response Timing', desc: 'How quickly and consistently you respond' },
                                        { label: 'Recovery Pattern', desc: 'Your body\'s natural reset rhythm' },
                                        { label: 'Variability Signature', desc: 'How patterns fluctuate day-to-day' },
                                        { label: 'Alignment Tendency', desc: 'Your natural synchronization style' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 border border-white/5 bg-white/[0.01] space-y-2">
                                            <div className="text-sm font-bold text-white">{item.label}</div>
                                            <div className="text-[10px] text-slate-500">{item.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Privacy Note */}
                            <div className="flex items-start gap-4 p-6 border border-violet-500/20 bg-violet-500/[0.02] rounded-xl max-w-3xl">
                                <div className="text-xl text-violet-500">◈</div>
                                <div className="space-y-2">
                                    <p className="text-sm text-slate-300 font-medium">Privacy First, Always</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Sigils communicate meaning through abstract symbolism. No raw data, no explicit imagery,
                                        no anatomical details. Only you control when and with whom your Sigil is shared.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 08. Harmony Profile Portability */}
                        <div className="space-y-16 pt-32">
                            <div className="space-y-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-pink-500/50" />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">08</h3>
                                </div>
                                <div className="space-y-8 max-w-5xl">
                                    <div className="space-y-4">
                                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.85] text-white">
                                            Harmony Profile <br />
                                            <span className="text-pink-500 underline decoration-pink-500/30 decoration-8 underline-offset-8">Portability</span>
                                        </h2>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">Dating App Integration</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-16 pt-4">
                                        <p className="text-xl text-slate-300 leading-relaxed font-medium">
                                            Nexalis users will have a Harmony Profile—a private, user-owned profile that summarizes
                                            their relational physiology in a simple, readable format.
                                        </p>
                                        <p className="text-base text-slate-400 leading-relaxed">
                                            Each Harmony Profile includes a Nexalis Sigil, a visual identifier that represents the
                                            user's unique pattern set without revealing raw data.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* How It Connects */}
                            <div className="space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-pink-500/80">How It Connects to the Outside World</h4>
                                <p className="text-lg text-slate-300 max-w-3xl">
                                    We're building Harmony Profiles to be portable. That means you can share them anywhere you connect with other people.
                                </p>
                            </div>

                            {/* Integration Phases */}
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4 hover:border-pink-500/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-pink-500 bg-pink-500/10 px-2 py-1 rounded">Phase 1</span>
                                    </div>
                                    <h4 className="font-bold text-white text-lg">Share Anywhere</h4>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">No Partner Required</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Users can generate a Harmony Card (link + QR) that can be added to any dating profile bio
                                        or shared directly in chat. It displays only what the user chooses to reveal.
                                    </p>
                                </div>
                                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4 hover:border-pink-500/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-pink-500 bg-pink-500/10 px-2 py-1 rounded">Phase 2</span>
                                    </div>
                                    <h4 className="font-bold text-white text-lg">Verified Profile</h4>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Optional</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Users can enable a verification badge that confirms their Harmony Profile is real and
                                        current, without exposing any sensitive data.
                                    </p>
                                </div>
                                <div className="p-8 border border-white/10 bg-white/[0.02] space-y-4 hover:border-pink-500/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black text-pink-500 bg-pink-500/10 px-2 py-1 rounded">Phase 3</span>
                                    </div>
                                    <h4 className="font-bold text-white text-lg">Native Integrations</h4>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Partner APIs</p>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Where platforms allow it, we support deeper integrations so Harmony indicators can appear
                                        as a native profile module. Requires official partnership and strict consent controls.
                                    </p>
                                </div>
                            </div>

                            {/* Privacy by Design */}
                            <div className="space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-pink-500/80">Privacy by Design</h4>
                                <p className="text-base text-slate-400 max-w-3xl">
                                    Harmony Profiles are built on selective disclosure:
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        'Users choose what is visible and to whom',
                                        'No raw signals are shared',
                                        'The Sigil is a non-reversible representation',
                                        'Sharing can be revoked at any time'
                                    ].map((item, i) => (
                                        <div key={i} className="p-5 border border-pink-500/10 bg-pink-500/[0.02] space-y-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                            <div className="text-xs text-slate-300 font-medium leading-relaxed">{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* The Outcome */}
                            <div className="p-10 border-l-2 border-pink-500/30 bg-pink-500/[0.02] max-w-4xl space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-pink-500">The Outcome</h4>
                                <p className="text-xl text-slate-300 font-medium leading-relaxed">
                                    This creates a new category of trust and clarity in connection:
                                </p>
                                <div className="grid md:grid-cols-3 gap-6 pt-4">
                                    <div className="space-y-2">
                                        <div className="text-sm font-bold text-white">Lightweight Signal</div>
                                        <div className="text-xs text-slate-500">A shareable signal of alignment</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-bold text-white">Safer Comparison</div>
                                        <div className="text-xs text-slate-500">Compare "fit" without explicit content</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-bold text-white">Better Outcomes</div>
                                        <div className="text-xs text-slate-500">Higher confidence, better communication</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 09. Nexalis Connect */}
                        <div className="space-y-16 pt-32 pb-20">
                            <div className="space-y-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">09</h3>
                                </div>
                                <div className="space-y-8 max-w-5xl">
                                    <div className="space-y-4">
                                        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.85] text-white">
                                            Nexalis <br />
                                            <span className="text-amber-500 underline decoration-amber-500/30 decoration-8 underline-offset-8">Connect</span>
                                        </h2>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-black">Harmony-First Matching (Built In)</p>
                                    </div>

                                    <p className="text-xl text-slate-300 leading-relaxed font-medium max-w-4xl">
                                        Nexalis will include a simple, in-app matching experience designed around Harmony Profiles.
                                        Instead of relying only on photos and surface preferences, Nexalis introduces a new layer:
                                        <span className="text-amber-400"> alignment intelligence</span>, a private, consent-based signal of how two people may actually fit in real life.
                                    </p>
                                </div>
                            </div>

                            {/* What Users See */}
                            <div className="space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500/80">What Users See</h4>
                                <p className="text-base text-slate-400 max-w-3xl">
                                    Each profile looks familiar and modern:
                                </p>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="p-6 border border-white/10 bg-white/[0.02] space-y-3">
                                        <div className="text-lg text-amber-500/60">📷</div>
                                        <div className="text-sm font-bold text-white">Photos & Basics</div>
                                        <div className="text-xs text-slate-500">Personal details, intent, lifestyle, interests</div>
                                    </div>
                                    <div className="p-6 border border-white/10 bg-white/[0.02] space-y-3">
                                        <div className="text-lg text-amber-500/60">💬</div>
                                        <div className="text-sm font-bold text-white">Prompts & Answers</div>
                                        <div className="text-xs text-slate-500">The same kind of human context people expect</div>
                                    </div>
                                    <div className="p-6 border border-white/10 bg-white/[0.02] space-y-3">
                                        <div className="text-lg text-amber-500/60">◈</div>
                                        <div className="text-sm font-bold text-white">Sigil & Harmony Indicators</div>
                                        <div className="text-xs text-slate-500">A small set of alignment signals the user chooses to show</div>
                                    </div>
                                </div>
                            </div>

                            {/* How Matching Works */}
                            <div className="space-y-8">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500/80">How Matching Works</h4>
                                <p className="text-base text-slate-400 max-w-3xl">
                                    Nexalis Connect ranks and matches users using:
                                </p>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="p-6 border border-amber-500/20 bg-amber-500/[0.02] space-y-3">
                                        <div className="text-sm font-bold text-white">Standard Preferences</div>
                                        <div className="text-xs text-slate-500">Age, distance, intent, dealbreakers</div>
                                    </div>
                                    <div className="p-6 border border-amber-500/20 bg-amber-500/[0.02] space-y-3">
                                        <div className="text-sm font-bold text-white">Harmony Match Score</div>
                                        <div className="text-xs text-slate-500">Based on alignment variables</div>
                                    </div>
                                    <div className="p-6 border border-amber-500/20 bg-amber-500/[0.02] space-y-3">
                                        <div className="text-sm font-bold text-white">"Why We Match"</div>
                                        <div className="text-xs text-slate-500">Clear explanation that stays non-explicit and easy to understand</div>
                                    </div>
                                </div>
                            </div>

                            {/* Consent-First Handshake */}
                            <div className="p-10 border-l-2 border-amber-500/30 bg-amber-500/[0.02] max-w-4xl space-y-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500">Consent-First "Handshake" Reveal</h4>
                                <p className="text-base text-slate-300 leading-relaxed">
                                    Harmony is designed for privacy:
                                </p>
                                <div className="grid md:grid-cols-3 gap-4 pt-2">
                                    {[
                                        'You control visibility (public, matches-only, or private)',
                                        'Deeper comparison unlocks only when both people opt in through a mutual Handshake',
                                        'No raw data is shared. Just selected, high-level summaries.'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                            <div className="text-xs text-slate-400 leading-relaxed">{item}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Why It Matters */}
                            <div className="space-y-8 max-w-4xl">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-amber-500/80">Why It Matters</h4>
                                <p className="text-xl text-slate-300 font-medium leading-relaxed">
                                    Most dating is guesswork. Nexalis Connect adds confidence and clarity without taking
                                    away human choice.
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed">
                                    It gives people a safer way to compare alignment, communicate better, and make decisions
                                    with more signal and less noise.
                                </p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Footer */}
                <footer className="py-20 px-8 border-t border-white/5">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="text-2xl font-black tracking-tighter">NEXALIS</div>
                        <p className="text-xs text-slate-600 uppercase tracking-[0.3em]">
                            Distributed Physiological Intelligence Architecture
                        </p>
                    </div>
                </footer>
            </main>
        </div >
    )
}

