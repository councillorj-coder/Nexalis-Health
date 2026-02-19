import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marketingData } from '../data/marketing-data';
import NexalisLogo from './NexalisLogo';

interface MarketingPageProps {
    onBack: () => void;
    onViewEngineering: (id: string) => void;
}

export default function MarketingPage({ onBack, onViewEngineering }: MarketingPageProps) {
    const { id } = useParams<{ id: string }>();
    const product = id ? marketingData[id] : null;

    if (!product) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Product Not Found</h1>
                    <button onClick={onBack} className="text-blue-400 hover:underline">Return to Landing</button>
                </div>
            </div>
        );
    }

    const isFemale = product.id === 'meridia' || product.id === 'innersense';
    const isMale = product.id === 'caliber' || product.id === 'mantrix';
    const isNeutral = product.id === 'compass';

    // Theme Configuration
    const bgColor = isFemale ? 'bg-white' : 'bg-black';
    const textColor = isFemale ? 'text-slate-900' : 'text-white';
    const subTextColor = isFemale ? 'text-slate-600' : 'text-slate-400';
    const navTextColor = isFemale ? 'text-slate-900 font-black' : 'text-white font-bold';

    const accentColor = isFemale
        ? 'text-[#B76E79]'
        : isMale ? 'text-blue-500' : 'text-emerald-500';

    const glowColor = isFemale
        ? 'from-[#B76E79]/20'
        : isMale ? 'from-blue-500/20' : 'from-emerald-500/20';

    const bridgeTheme = isFemale
        ? 'text-[#B76E79] border-[#B76E79]/30 bg-[#B76E79]/5 hover:bg-[#B76E79]/10 hover:border-[#B76E79]/50'
        : isMale
            ? 'text-blue-400 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/50'
            : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50';

    const bridgeInvert = isFemale ? 'bg-slate-900 text-white' : 'bg-white text-black';

    return (
        <div className={`min-h-screen ${bgColor} ${textColor} selection:bg-[#B76E79]/20 overflow-x-hidden transition-colors duration-700`}>
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto left-1/2 -translate-x-1/2 backdrop-blur-sm">
                <div className="flex items-center gap-4 cursor-pointer" onClick={onBack}>
                    <NexalisLogo size={40} dark={isFemale} />
                    <span className={`text-lg tracking-tighter ${navTextColor}`}>NEXALIS</span>
                </div>
                <button
                    onClick={onBack}
                    className={`px-6 py-2 rounded-full border ${isFemale ? 'border-slate-900/10 text-slate-900' : 'border-white/10 text-white'} text-xs font-bold uppercase tracking-widest hover:bg-slate-900/5 transition-colors`}
                >
                    Back
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-64 pb-32 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                    <div className="space-y-4">
                        <div className={`text-xs font-black uppercase tracking-[0.4em] ${accentColor}`}>{product.tagline}</div>
                        <h1 className={`text-7xl md:text-9xl font-black tracking-tighter leading-none ${isFemale ? 'text-slate-900' : 'text-white'}`}>
                            {product.name.replace('™', '')}<span className={`${isFemale ? 'text-slate-900/20' : 'text-white/20'} uppercase tracking-widest align-top text-4xl`}>™</span>
                        </h1>
                    </div>

                    <p className={`text-2xl md:text-3xl ${subTextColor} font-light leading-tight tracking-tight max-w-xl italic`}>
                        "{product.hook}"
                    </p>
                </div>

                <div className="relative aspect-square flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-200">
                    <div className={`absolute inset-0 bg-gradient-to-br ${glowColor} to-transparent rounded-full blur-[120px] opacity-30`} />
                    <img
                        src={`${import.meta.env.BASE_URL}${product.heroImage}`}
                        alt={product.name}
                        className="relative z-10 w-[120%] h-[120%] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
                    />
                </div>
            </section>

            {/* Immersive Narrative */}
            <section className={`py-32 px-8 max-w-4xl mx-auto ${isFemale ? 'border-slate-100' : 'border-white/5'} border-t`}>
                <div className="space-y-24">
                    <div className="space-y-8">
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">The Experience</h2>
                        <div className={`text-2xl md:text-3xl ${subTextColor} leading-relaxed font-light first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left ${isFemale ? 'first-letter:text-slate-900' : 'first-letter:text-white'}`}>
                            {product.theExperience}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <h3 className={`text-sm font-bold uppercase tracking-widest ${accentColor}`}>Ecosystem Synergy</h3>
                            <p className={subTextColor}>
                                {product.synergy}
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h3 className={`text-sm font-bold uppercase tracking-widest ${accentColor}`}>Compatibility</h3>
                            <p className={subTextColor}>
                                {product.compatibility}
                            </p>
                        </div>
                    </div>

                    <div className={`p-12 rounded-3xl ${isFemale ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.02] border-white/[0.08]'} border relative overflow-hidden group`}>
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${glowColor} to-transparent blur-3xl opacity-20`} />
                        <h3 className={`text-sm font-bold uppercase tracking-widest ${isFemale ? 'text-slate-900' : 'text-white'} mb-6`}>Built on Trust</h3>
                        <p className={`text-xl ${isFemale ? 'text-slate-700' : 'text-slate-300'} leading-relaxed`}>
                            {product.trust}
                        </p>
                        <div className={`mt-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] ${isFemale ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>Clinical Grade</span>
                            <div className={`w-1 h-1 rounded-full ${isFemale ? 'bg-slate-200' : 'bg-slate-700'}`} />
                            <span>Privacy First</span>
                            <div className={`w-1 h-1 rounded-full ${isFemale ? 'bg-slate-200' : 'bg-slate-700'}`} />
                            <span>Encrypted at Edge</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Bridge */}
            <section className={`py-40 px-8 text-center ${isFemale ? 'bg-gradient-to-b from-transparent to-slate-50' : 'bg-gradient-to-b from-transparent to-white/5'}`}>
                <div className="max-w-2xl mx-auto space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black tracking-tighter">Ready for the Deep Disclosure?</h2>
                        <h3 className="text-slate-500">Explore the technical specifications, sensor architecture, and engineering breakthroughs behind {product.name}.</h3>
                    </div>

                    <button
                        onClick={() => onViewEngineering(product.id === 'mantrix' ? 'sentinel' : product.id)}
                        className={`group relative inline-flex items-center gap-4 p-1 pr-8 rounded-full border transition-all duration-500 ${bridgeTheme}`}
                    >
                        <span className={`w-12 h-12 rounded-full ${bridgeInvert} flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform`}>
                            →
                        </span>
                        <span className="text-sm font-bold uppercase tracking-widest">Enter Engineering Portal</span>
                    </button>
                </div>
            </section>

            {/* Dynamic Footer Branding */}
            <footer className={`py-20 px-8 border-t ${isFemale ? 'border-slate-100' : 'border-white/5'}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4 opacity-50">
                        <NexalisLogo size={32} dark={isFemale} />
                        <span className={`text-sm font-bold tracking-widest uppercase ${isFemale ? 'text-slate-900' : 'text-white'}`}>Nexalis Health</span>
                    </div>
                    <div className={`flex gap-12 text-[10px] font-bold uppercase tracking-widest ${isFemale ? 'text-slate-400' : 'text-slate-600'}`}>
                        <span className="hover:text-white transition-colors cursor-pointer">Security Protocol</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Clinical Papers</span>
                        <span className="hover:text-white transition-colors cursor-pointer">Terms of Privacy</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
