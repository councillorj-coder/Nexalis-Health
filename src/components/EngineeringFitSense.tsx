
import React, { useState } from 'react';

type TabKey = 'overview' | 'sensing' | 'specs' | 'reference';

const EngineeringFitSense: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabKey>('overview');

    return (
        <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex-none border-b border-white/10 p-6 flex items-center justify-between bg-[#080808]">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
                        <span className="text-emerald-500">Node 05:</span> FitSense™
                    </h2>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1 pl-1">Structural Footprint Profiling Architecture</p>
                </div>

                <div className="flex gap-1 bg-white/5 p-1 rounded-lg overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('sensing')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'sensing' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Core Sensing
                    </button>
                    <button
                        onClick={() => setActiveTab('specs')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'specs' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                        Technical Specs
                    </button>
                    <button
                        onClick={() => setActiveTab('reference')}
                        className={`px-4 py-2 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${activeTab === 'reference' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
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
                                        Fast fit-profile scanning for length, circumference, and shape.
                                    </h3>
                                    <p className="text-lg text-slate-400 leading-relaxed">
                                        Designed to capture a repeatable penile footprint profile using guided self-scan motion, optical flow displacement, and ToF diameter sensing—without cameras, photos, or explicit visual anatomy capture.
                                    </p>
                                    <div className="pt-4 flex flex-wrap gap-4 text-xs text-slate-500 uppercase tracking-widest font-mono">
                                        <span className="px-3 py-1 border border-white/10 rounded">Non-Imaging</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Guided</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Structural</span>
                                        <span className="px-3 py-1 border border-white/10 rounded">Privacy-First</span>
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
                                            src={`${import.meta.env.BASE_URL}fitsense-photo.png`}
                                            alt="FitSense Product"
                                            className="max-w-full h-[300px] object-contain opacity-100"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* 01. Why This Exists */}
                            <section className="space-y-6 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">01. Why This Exists</h3>
                                <p className="text-base text-slate-400 leading-relaxed max-w-4xl">
                                    Fit is currently guesswork. Most sizing relies on self-measurement, inconsistent methods, or static approximations that fail to capture real geometry. FitSense exists to generate a clean, abstract Fit Profile Curve—a repeatable geometry signature that can be used for sizing, fit-class mapping, product compatibility, and longitudinal tracking—while remaining privacy-first and mass-producible.
                                </p>
                            </section>

                            {/* 02. Fit Profile Output */}
                            <section className="space-y-8 pt-12 border-t border-white/5">
                                <h3 className="text-2xl font-black text-white">02. Fit Profile Output</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { title: 'Length (base → tip)', desc: 'Continuous displacement tracking via optical flow.' },
                                        { title: 'Diameter Profile', desc: 'Circumference profile captured across the entire scan path.' },
                                        { title: 'Taper Classification', desc: 'Categorization into base-heavy, linear, uniform, or head-weighted.' },
                                        { title: 'Zone Curve Extraction', desc: 'Segmented data for base, mid, upper, and near-tip regions.' },
                                        { title: 'Scan Confidence Score', desc: 'Validation of speed, stability, and data quality.' },
                                        { title: 'Geometry Signature', desc: 'Non-explicit, abstract output for engineering use and modeling.' }
                                    ].map((item, i) => (
                                        <div key={i} className="p-6 bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-colors">
                                            <h4 className="font-bold text-white mb-2">{item.title}</h4>
                                            <p className="text-sm text-slate-400">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    ) : activeTab === 'sensing' ? (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Core Sensing Architecture */}
                            <section className="space-y-12">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Core Sensing Architecture</h3>
                                    <div className="text-xs text-red-400 font-mono border-l-2 border-red-500 pl-3">
                                        Multi-modal displacement and diameter profiling
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="text-[10px] text-red-500 uppercase font-bold tracking-[0.2em]">Displacement Tracking</div>
                                        <h4 className="text-xl font-bold text-white">Length Axis (Optical)</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Optical speckle / flow (IR) displacement sensing tracks surface motion during glide to compute distance traveled.
                                        </p>
                                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 marker:text-red-600">
                                            <li>Generates a position axis for mapping diameter</li>
                                            <li>Confidence gating for speed, contrast, and stability</li>
                                            <li>Designed for short burst scans (seconds)</li>
                                        </ul>
                                    </div>

                                    <div className="p-8 bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="text-[10px] text-red-500 uppercase font-bold tracking-[0.2em]">Diameter Profiling</div>
                                        <h4 className="text-xl font-bold text-white">Girth Axis (ToF)</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Dual-point time-of-flight (ToF) diameter sensing in an opposed geometry measures distance-to-surface continuously.
                                        </p>
                                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 marker:text-red-600">
                                            <li>Diameter derived continuously during glide</li>
                                            <li>Stabilized by rigid frame + comfort rails</li>
                                            <li>Output: smooth diameter curve + zone extraction</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="text-[10px] text-red-500 uppercase font-bold tracking-[0.2em]">Start Verification</div>
                                        <h4 className="text-xl font-bold text-white">Anti-Spoof (Optical)</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Reflective PPG start gate ensures scan begins only after valid tissue contact signature is detected.
                                        </p>
                                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 marker:text-red-600">
                                            <li>Blocks inanimate object scans</li>
                                            <li>Stabilizes scan start at a consistent base reference</li>
                                            <li>Optional: contact stability window (hold ~1s)</li>
                                        </ul>
                                    </div>

                                    <div className="p-8 bg-white/[0.02] border border-white/5 space-y-4">
                                        <div className="text-[10px] text-red-500 uppercase font-bold tracking-[0.2em]">Stability & Guidance</div>
                                        <h4 className="text-xl font-bold text-white">Embedded Control</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">
                                            Haptic feedback and speed gating provide closed-loop guidance for consistent data quality.
                                        </p>
                                        <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4 marker:text-red-600">
                                            <li>Haptic confirmation for start, pacing, and completion</li>
                                            <li>Speed gating to maintain signal quality (slow-down alert)</li>
                                            <li>Confidence scoring + invalid scan handling</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : activeTab === 'specs' ? (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="space-y-12">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Technical Specifications</h3>
                                    <div className="text-xs text-red-400 font-mono border-l-2 border-red-500 pl-3">
                                        Hardware and system parameters
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                                    {/* Power & Energy */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                                            Power & Energy
                                        </h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Battery', value: 'Li-Po micro pouch' },
                                                { label: 'Capacity', value: '120–250mAh (target)' },
                                                { label: 'Charging', value: 'USB-C or pogo (cost-down)' },
                                                { label: 'Target Life', value: 'Multiple scans per charge (burst-mode)' }
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">{spec.label}</span>
                                                    <span className="text-xs text-slate-300 font-mono">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Compute & Comms */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                                            Compute & Comms
                                        </h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'SoC', value: 'BLE-capable MCU (Nordic class)' },
                                                { label: 'Radio', value: 'Bluetooth 5.x LE' },
                                                { label: 'Processing', value: 'Basic filtering + gating + encryption' },
                                                { label: 'Security', value: 'AES-class on-device encryption' }
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">{spec.label}</span>
                                                    <span className="text-xs text-slate-300 font-mono">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Physical Build */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                                            Physical Build
                                        </h4>
                                        <div className="space-y-4">
                                            {[
                                                { label: 'Frame', value: 'Rigid plastic C-ring (PC-ABS / GF nylon)' },
                                                { label: 'Comfort', value: 'Silicone/TPU rails + base seat pad' },
                                                { label: 'Geometry', value: 'Fixed measurement throat region' },
                                                { label: 'Durability', value: 'Splash-proof target (IP rating TBD)' },
                                                { label: 'Production', value: 'Injection moldable, low part count' }
                                            ].map((spec, i) => (
                                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                                                    <span className="text-xs text-slate-500 uppercase tracking-wider">{spec.label}</span>
                                                    <span className="text-xs text-slate-300 font-mono">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <section className="space-y-12">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tight">Extended Architecture Options</h3>
                                    <div className="text-xs text-red-400 font-mono border-l-2 border-red-500 pl-3">
                                        Engineering Reference & Future Iterations
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-8">
                                        <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-colors">
                                            <h4 className="font-bold text-red-500 mb-4 text-sm uppercase tracking-widest">Displacement Options</h4>
                                            <ul className="text-xs text-slate-400 space-y-3">
                                                <li>• <span className="text-slate-200">Dual Optical Flow:</span> Redundancy + slip detection.</li>
                                                <li>• <span className="text-slate-200">Visual Odometry:</span> Against controlled inner texture strip.</li>
                                                <li>• <span className="text-slate-200">Magnet + Encoder:</span> Instrument-grade sliding mechanics.</li>
                                                <li>• <span className="text-slate-200">IMU-Assisted:</span> Motion gating (not primary distance).</li>
                                            </ul>
                                        </div>

                                        <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-colors">
                                            <h4 className="font-bold text-red-500 mb-4 text-sm uppercase tracking-widest">Diameter / Shape Options</h4>
                                            <ul className="text-xs text-slate-400 space-y-3">
                                                <li>• <span className="text-slate-200">Tri-point ToF:</span> Better tilt tolerance + ovality.</li>
                                                <li>• <span className="text-slate-200">Throat Array:</span> Multi-point ToF for higher fidelity.</li>
                                                <li>• <span className="text-slate-200">Capacitive Proximity:</span> Mapping via near-field sensing.</li>
                                                <li>• <span className="text-slate-200">Stretch Band:</span> Low-cost BOM alternative.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-colors">
                                            <h4 className="font-bold text-red-500 mb-4 text-sm uppercase tracking-widest">Contact / Liveness Options</h4>
                                            <ul className="text-xs text-slate-400 space-y-3">
                                                <li>• <span className="text-slate-200">Multi-wavelength PPG:</span> RGB/IR for stronger validation.</li>
                                                <li>• <span className="text-slate-200">Skin Temperature:</span> Cheap, strong spoof blocker.</li>
                                                <li>• <span className="text-slate-200">Force/Contact Pad:</span> Repeatability + seating pressure.</li>
                                                <li>• <span className="text-slate-200">Contact Impedance:</span> Advanced tissue validation.</li>
                                            </ul>
                                        </div>

                                        <div className="p-6 bg-white/[0.02] border border-white/5 hover:border-red-500/20 transition-colors">
                                            <h4 className="font-bold text-red-500 mb-4 text-sm uppercase tracking-widest">Stability & Hardening</h4>
                                            <ul className="text-xs text-slate-400 space-y-3">
                                                <li>• <span className="text-slate-200">6-axis IMU:</span> Speed gating and jitter detection.</li>
                                                <li>• <span className="text-slate-200">Optical Hardening:</span> Ambient light rejection (IR mod).</li>
                                                <li>• <span className="text-slate-200">Hydrophobic Coating:</span> Window contamination handling.</li>
                                                <li>• <span className="text-slate-200">Base Indexing Pad:</span> Repeatable starting reference.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EngineeringFitSense;
