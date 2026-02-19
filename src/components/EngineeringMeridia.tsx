import React from 'react';
import meridiaSchematic from '../assets/meridia-internal-schematic.png';

interface MaterialLink {
    label: string;
    url: string;
}

interface MaterialSection {
    subCategory: string;
    items: MaterialLink[];
}

interface MaterialItem {
    label: string;
    subCategory?: string;
    value?: (string | MaterialLink)[];
    sections?: MaterialSection[];
}

const EngineeringMeridia: React.FC = () => {
    const [showTechSheet, setShowTechSheet] = React.useState(false);

    // Hardcoded specs for now based on the patent/data to ensure it works standalone
    const specs = [
        { label: "Sensing Endpoint", value: "Ultrasound A-Mode / IR ToF" },
        { label: "Actuation", value: "Pneumatic Annular Cuff (Microbladder)" },
        { label: "Pressure Range", value: "0 - 15 kPa (Controlled)" },
        { label: "Feedback Loop", value: "Real-time Compliance Indexing" },
        { label: "Material", value: "Medical Grade Silicone (Shore 00-30)" },
        { label: "Connection", value: "BLE 5.2 (Encrypted)" }
    ];

    const materialsData: MaterialItem[] = [
        {
            label: "Distance Sensing Tip",
            subCategory: "Ultrasound",
            value: ["TBD"]
        },
        {
            label: "Inflation System",
            sections: [
                {
                    subCategory: "Pump",
                    items: [
                        { label: "cheap digikey option", url: "https://www.digikey.com/en/products/detail/dfrobot/FIT0801/14824994" },
                        { label: "CurieJet High End", url: "https://www.curiejet.com/en/product/micro-pump/air-pump-and-micro-blower" },
                        { label: "LeeCo smart pump module", url: "https://www.theleeco.com/product/smart-pump-module/#part-numbers-specifications" }
                    ]
                },
                {
                    subCategory: "mems psi sensor",
                    items: [
                        { label: "TE 2PSI", url: "https://www.digikey.com/en/products/detail/te-connectivity-measurement-specialties/4525DO-DS3BS002GPF/28735279?s=N4IgTCBcDaICoFEAEBhA9gOwwUwMYBcBLAN0PwE8kBZbAQwGcBXAJ2wFtsN8kBlABzyFaAGyLZ6SACwBWMNIAiAeQC08ngGYAQjwAMOsAHEACgDEQAXQC%2BQA" }
                    ]
                }
            ]
        },
        {
            label: "Sensing Suite",
            value: ["FSR Array / IR ToF"]
        },
        {
            label: "Electronics",
            value: ["BLE 5.2 / NTC / IMU"]
        }
    ];

    return (
        <div className="flex flex-col h-full w-full bg-white text-slate-900 overflow-hidden relative">
            {/* Header */}
            <div className="flex-none border-b border-slate-200 p-6 flex items-center justify-between bg-white z-10">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                        <span className="text-[#B76E79]">Node 04:</span> Meridia™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1 pl-1">Private Comfort Calibration System</p>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
                {/* Internal Gradient Background */}
                <div className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(183, 110, 121, 0.15) 0%, transparent 40%)'
                    }}
                />

                <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Hero Image & Title */}
                    <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="relative w-full max-w-2xl aspect-video flex items-center justify-center"
                            style={{
                                maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 80%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 80%, transparent 100%), linear-gradient(to bottom, black 85%, transparent 100%)',
                                maskComposite: 'intersect',
                                WebkitMaskComposite: 'source-in'
                            }}
                        >
                            <img
                                src={`${import.meta.env.BASE_URL}meridia-modern-2.png`}
                                alt="Meridia™ Modern"
                                className="relative z-10 w-full h-full object-contain mix-blend-multiply"
                            />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase">
                            Meridia™
                        </h1>
                    </div>

                    {/* Content Grid */}
                    <div className="flex flex-col gap-16 pb-24">

                        {/* 1. Why Meridia Exists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#B76E79]">Why Meridia Exists</h3>
                                <p className="text-xl font-medium text-slate-900 leading-relaxed">
                                    Meridia exists so a woman can understand her body with clarity—privately, safely, and without needing symptoms or a clinic visit to get answers.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Most women are left with vague language (“normal,” “tight,” “dry,” “sensitive,” “painful”) and inconsistent experiences that are hard to describe or track. Meridia is designed to turn those experiences into a repeatable personal baseline that a woman can learn from over time.
                                </p>
                                <p className="text-slate-600 leading-relaxed border-l-2 border-[#B76E79] pl-4 italic">
                                    It’s not about anatomy visuals. It’s about body literacy: “What’s normal for me, what changes, and what improves.”
                                </p>
                            </div>

                            {/* 2. What It Gives The User */}
                            <div className="space-y-6 bg-slate-50 p-8 rounded-xl border border-slate-100">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-[#B76E79]">What It Gives The User</h3>
                                <p className="text-slate-600 mb-4">Meridia produces simple, non-graphic outputs a woman can actually use:</p>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900">Comfort Range</span>
                                            <p className="text-sm text-slate-600">Where she tends to feel most stable.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900">Stability Score</span>
                                            <p className="text-sm text-slate-600">How consistent the session feels across movement/position.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900">Response Curve</span>
                                            <p className="text-sm text-slate-600">How comfort shifts across the session (abstract trendline).</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-[#B76E79] mt-2.5 flex-none" />
                                        <div>
                                            <span className="font-bold text-slate-900">Baseline Confidence</span>
                                            <p className="text-sm text-slate-600">How reliable today’s session is vs. prior sessions. The goal is confidence and communication.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Relation to Caliber */}
                        <div className="space-y-6 border-t border-slate-200 pt-12">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#B76E79]">Relation to Caliber™</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-2xl font-bold text-slate-900">Male Baseline → Female Baseline</h4>
                                    <p className="text-slate-600 leading-relaxed">
                                        Caliber and Meridia are two separate devices built for two bodies—but designed to speak the same language inside the Nexalis system.
                                    </p>
                                    <ul className="space-y-3 pt-2">
                                        <li className="text-slate-700"><span className="font-bold text-slate-900">Caliber™ (Male):</span> Establishes an external geometry baseline and fit profile.</li>
                                        <li className="text-slate-700"><span className="font-bold text-slate-900">Meridia™ (Female):</span> Establishes an internal comfort baseline and response profile.</li>
                                    </ul>
                                    <p className="text-slate-600 leading-relaxed pt-2">
                                        Individually, each device helps the user understand themselves. Together (only if users choose), they enable a higher-level pairing layer that can estimate fit harmony using abstract metrics—without explicit visuals.
                                    </p>
                                </div>
                                <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
                                    <h5 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Example Paired Outcomes</h5>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-400">Outcome 01</span>
                                            <p className="font-semibold text-slate-900">Fit Harmony Index</p>
                                            <p className="text-sm text-slate-500">Alignment likelihood</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-400">Outcome 02</span>
                                            <p className="font-semibold text-slate-900">Comfort Alignment Band</p>
                                            <p className="text-sm text-slate-500">Most stable overlap range</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold uppercase text-slate-400">Outcome 03</span>
                                            <p className="font-semibold text-slate-900">Stability Match</p>
                                            <p className="text-sm text-slate-500">Consistency under variation</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-6 italic">
                                        *Keeps each device solo-use valuable, while enabling optional system-level compatibility.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 4. How It Works */}
                        <div className="space-y-8 pt-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[#B76E79]">How It Works (High Level)</h3>
                            <p className="text-slate-600 max-w-3xl">Meridia runs short guided sessions designed for repeatability and user understanding.</p>

                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {[
                                    { title: "Guided Session Protocol", desc: "Consistent timing and instructions make sessions comparable." },
                                    { title: "Baseline Capture", desc: "Detects controlled comfort-response signals and stability trends." },
                                    { title: "Quality Checks", desc: "Flags motion artifacts or session inconsistency to protect accuracy." },
                                    { title: "Abstract Readout", desc: "Scores, bands, and curves—non-graphic and easy to interpret." },
                                    { title: "Baseline Over Time", desc: "See what’s stable, what’s changing, and what’s improving." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-50 p-5 rounded-lg border border-slate-100 hover:border-[#B76E79]/30 transition-colors">
                                        <div className="text-[#B76E79] font-bold text-lg mb-2">0{i + 1}</div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-2 leading-tight">{item.title}</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
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
                className="fixed bottom-8 right-8 z-50 bg-[#B76E79] hover:bg-[#a05a65] text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 group"
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
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500"
                        onClick={() => setShowTechSheet(false)}
                    />
                    <div className="bg-white w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl relative flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-500">
                        {/* Modal Header */}
                        <div className="flex-none bg-slate-50 border-b border-slate-100 p-8 flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-2 w-2 bg-[#B76E79] rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#B76E79]">Restricted Access // Tier 1</span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Technical Specifications</h3>
                                <p className="text-xs text-slate-400 font-mono mt-2">NODE 04 // MERIDIA™ // REF-SHEET-2026 // IP-CONFIDENTIAL</p>
                            </div>
                            <button
                                onClick={() => setShowTechSheet(false)}
                                className="group p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
                            >
                                <svg className="w-8 h-8 text-slate-400 group-hover:text-[#B76E79] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                {/* Left Column: Core Specs (5 cols) */}
                                <div className="lg:col-span-5 space-y-12">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Hardware Definition</h4>
                                        <div className="space-y-6">
                                            {specs.map((spec, i) => (
                                                <div key={i} className="flex flex-col">
                                                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{spec.label}</span>
                                                    <span className="font-mono text-sm text-slate-900 font-medium border-l-2 border-[#B76E79]/20 pl-3">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <svg className="w-4 h-4 text-[#B76E79]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Patent Status</h4>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed">
                                            This device and its associated methods for "Intravaginal Intraluminal Distance/Compliance and Contact Device with Controlled Radial Stimulus" are currently Patent Pending (Feb 2026).
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Innovations & Mechanics (7 cols) */}
                                <div className="lg:col-span-7 space-y-12">

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Core Innovations</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                                                <div className="text-[#B76E79] font-mono text-xs mb-2">INV-01</div>
                                                <h5 className="font-bold text-slate-900 mb-2">Controlled Radial Stimulus</h5>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Integrated microbladder/annular cuff expansion allows for precise, repeatable pressure application against vaginal walls to measure response.
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                                                <div className="text-[#B76E79] font-mono text-xs mb-2">INV-02</div>
                                                <h5 className="font-bold text-slate-900 mb-2">Ultrasound Endpointing</h5>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Longitudinal distance sensing across moisture/tissue states using advanced A-Mode ultrasound or IR Time-of-Flight.
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                                                <div className="text-[#B76E79] font-mono text-xs mb-2">INV-03</div>
                                                <h5 className="font-bold text-slate-900 mb-2">Compliance Relationship Index</h5>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Correlates expansion pressure with tissue response to create a unique elasticity profile for every user.
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                                                <div className="text-[#B76E79] font-mono text-xs mb-2">INV-04</div>
                                                <h5 className="font-bold text-slate-900 mb-2">Anatomically Agnostic</h5>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Scalable geometry measurement allows the system to adapt to diverse users without pre-conceived sizing assumptions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2">Output Vectors</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {['Pressure Distribution Map', 'Internal Geometry Profile', 'Elasticity Index', 'Comfort Zone Boundaries', 'Session Stability Score'].map((tag, i) => (
                                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Internal Schematic Reference */}
                            <div className="mt-16 pt-8 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 pb-2">Internal Schematic Reference</h4>
                                <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group p-6">
                                    <img
                                        src={meridiaSchematic}
                                        className="w-full h-auto max-h-[800px] object-contain mx-auto"
                                        alt="Meridia Internal Schematic"
                                    />
                                </div>

                                <div className="mt-12">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 text-center">Materials List (v1) // Secure Baseline</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                        {materialsData.map((item, i) => (
                                            <div key={i} className="flex flex-col items-center text-center">
                                                <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">{item.label}</span>

                                                {item.sections ? (
                                                    <div className="w-full space-y-4">
                                                        {item.sections.map((section, idx) => (
                                                            <div key={idx} className="flex flex-col items-center">
                                                                <span className="text-[8px] uppercase tracking-[0.2em] text-[#B76E79] font-black mb-1">
                                                                    {section.subCategory}
                                                                </span>
                                                                <div className="font-mono text-sm text-slate-900 font-black border-t-2 border-[#B76E79] pt-2 w-full flex flex-col gap-1">
                                                                    {section.items.map((v, j) => (
                                                                        <a
                                                                            key={j}
                                                                            href={v.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-[#B76E79] hover:underline transition-all"
                                                                        >
                                                                            {v.label}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <>
                                                        {item.subCategory && (
                                                            <span className="text-[8px] uppercase tracking-[0.2em] text-[#B76E79] font-black mb-1">
                                                                {item.subCategory}
                                                            </span>
                                                        )}
                                                        <div className="font-mono text-sm text-slate-900 font-black border-t-2 border-[#B76E79] pt-2 w-full flex flex-col gap-1">
                                                            {item.value?.map((v, j) => (
                                                                typeof v === 'string' ? (
                                                                    <span key={j}>{v}</span>
                                                                ) : (
                                                                    <a
                                                                        key={j}
                                                                        href={v.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[#B76E79] hover:underline transition-all"
                                                                    >
                                                                        {v.label}
                                                                    </a>
                                                                )
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer Actions */}
                        <div className="flex-none p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
                                <span>CONFIDENTIAL</span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span>DO NOT DISTRIBUTE</span>
                            </div>
                            <button
                                onClick={() => setShowTechSheet(false)}
                                className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 duration-300"
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
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(183, 110, 121, 0.5);
                }
            ` }} />
        </div >
    );
};

export default EngineeringMeridia;
