import React, { useState } from 'react';

interface TechnicalBriefModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabKey = 'specs' | 'reference';

const TechnicalBriefModal: React.FC<TechnicalBriefModalProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('specs');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-950 border border-white/10 overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">

                {/* Header with Navigation */}
                <div className="border-b border-white/5 bg-slate-900/50">
                    <div className="flex items-start justify-between p-6">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                                <span className="text-blue-500">Node 01:</span> RigiSense™
                            </h2>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Classification: Clinical Grade Sensing Architecture</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex px-6 gap-8 border-t border-white/5">
                        <button
                            onClick={() => setActiveTab('specs')}
                            className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'specs' ? 'text-blue-500 border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                        >
                            System Specifications
                        </button>
                        <button
                            onClick={() => setActiveTab('reference')}
                            className={`py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === 'reference' ? 'text-blue-500 border-blue-500' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                        >
                            Engineer Reference
                        </button>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-slate-950/50">

                    {activeTab === 'specs' ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* System Overview */}
                            <section className="space-y-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">01. System Overview</h3>
                                <p className="text-lg text-slate-300 leading-relaxed font-light">
                                    RigiSense™ is a sealed, non-explicit wearable sensing ring designed for continuous structural, circulatory, and stability measurement with minimal power draw and high signal reliability. The system prioritizes passive sensing, low-noise signal capture, and comfort-preserving geometry.
                                </p>
                            </section>

                            {/* Sensing Architecture */}
                            <section className="space-y-8">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">02. Core Sensing Architecture</h3>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pressure & Load</h4>
                                            <span className="text-[10px] text-blue-500 font-mono">Capacitive</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400">
                                            <p>Multi-zone capacitive pressure sensors (3–4 radial zones)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Low power consumption</li>
                                                <li>• High repeatability, minimal drift</li>
                                                <li>• Adaptive sampling burst cycles</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Circumferential Change</h4>
                                            <span className="text-[10px] text-blue-500 font-mono">Strain</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400">
                                            <p>Printed stretch conductors (serpentine geometry) on flexible substrate</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• No mechanical resistance to expansion</li>
                                                <li>• Stable over repeated strain cycles</li>
                                                <li>• Result: Abstracted expansion index</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Circulatory Sensing</h4>
                                            <span className="text-[10px] text-blue-500 font-mono">Optical</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400">
                                            <p>Single-wavelength reflective PPG (green)</p>
                                            <ul className="space-y-1 opacity-60">
                                                <li>• Low-power reflective implementation</li>
                                                <li>• Measures amplitude and flow response trends</li>
                                                <li>• Recovery dynamics tracking</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-4 bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thermal Sensing</h4>
                                            <span className="text-[10px] text-blue-500 font-mono">Digital</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-slate-400">
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

                            {/* Power & Electronics */}
                            <div className="grid md:grid-cols-2 gap-12 border-t border-white/5 pt-12">
                                <section className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">03. Power System</h3>
                                    <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                                        <p><span className="text-white font-bold">Battery:</span> High-density Li-Po micro pouch cell, optimized for 24–48 hour mixed-mode use.</p>
                                        <p><span className="text-white font-bold">Charging:</span> Inductive wireless charging (sealed system) with 3-hour full recharge cycle.</p>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2">04. Electronics</h3>
                                    <div className="space-y-4 text-xs text-slate-400 leading-relaxed">
                                        <p><span className="text-white font-bold">SoC:</span> Nordic nRF52-class BLE SoC with Hardware AES encryption and ultra-low-power sleep states.</p>
                                        <p><span className="text-white font-bold">Firmware:</span> Sensor fusion for pressure, strain, and motion with local data buffering.</p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-2 mb-6 text-center">Extended Sensing & Architecture Options (Engineer Reference)</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Pressure / Force */}
                                <div className="space-y-4 p-4 bg-blue-500/[0.02] border border-blue-500/10">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 border-b border-blue-900/40 pb-2">Pressure / Force Measurement</h4>
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
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Confidential Build Phase: Architectural Definition / Reference Only</p>
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors"
                    >
                        Close Brief
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            ` }} />
        </div>
    );
};

export default TechnicalBriefModal;
