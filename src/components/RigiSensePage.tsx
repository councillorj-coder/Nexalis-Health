import { useState } from 'react';
import TechnicalBriefModal from './TechnicalBriefModal';

export default function RigiSensePage(props: { onBack: () => void }) {
    const [showTechnicalBrief, setShowTechnicalBrief] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans leading-relaxed overflow-x-hidden">
            {/* Simple Nav */}
            <nav className="p-8 border-b border-white/10">
                <button
                    onClick={props.onBack}
                    className="text-xs font-bold uppercase tracking-widest hover:text-slate-400 transition-colors"
                >
                    ← Back to Nexalis
                </button>
            </nav>

            <main className="py-16 px-8 max-w-3xl mx-auto space-y-16 text-center">
                {/* Title */}
                <h1 className="text-7xl font-black">RigiSense™</h1>

                {/* Nexalis · First Sensing Node */}
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Nexalis · First Sensing Node</p>

                {/* Product Image with fade effect on all edges */}
                <div className="relative py-12">
                    <div
                        className="flex justify-center"
                        style={{
                            maskImage: 'radial-gradient(ellipse 55% 50% at 50% 40%, black 20%, transparent 80%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 55% 50% at 50% 40%, black 20%, transparent 80%)'
                        }}
                    >
                        <img
                            src="/rigisense-product.png"
                            alt="RigiSense Product"
                            className="max-w-full h-auto"
                        />
                    </div>
                </div>

                {/* Main Description */}
                <div className="space-y-4">
                    <h2 className="text-4xl font-black">RigiSense™</h2>
                    <p className="text-xl">Clinical-grade rigidity and physiological signal acquisition system</p>
                    <p className="text-base text-slate-400">
                        Designed to capture continuous, real-world erectile physiology using passive, non-invasive sensing and principled data abstraction.
                    </p>
                </div>

                {/* Why This Exists */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <h2 className="text-4xl font-black">Why This Exists</h2>

                    <p className="text-base text-slate-400 leading-relaxed">
                        Erectile dysfunction develops gradually, through changes in rigidity, stability, and response over time, yet it is typically evaluated using brief clinical tests, questionnaires, or artificial stimulation that capture only isolated moments. This makes early changes difficult to detect and long-term patterns hard to understand. Because erectile function is continuous and sensitive to real-world conditions, meaningful measurement requires passive, non-invasive sensing that operates without user input or visual anatomical capture. RigiSense was designed to meet clinical measurement standards first, while also enabling individuals to track erectile health, performance, and recovery over time as part of broader wellness monitoring.
                    </p>
                </div>

                {/* What It Measures */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <h2 className="text-4xl font-black">What It Measures</h2>

                    <div className="space-y-6">
                        <p className="text-base text-slate-400 leading-relaxed">
                            RigiSense does not measure anatomy or performance outcomes.<br />
                            It measures abstracted physical signals that describe erectile behavior over time.
                        </p>

                        <p className="text-base text-white font-semibold">Specifically, the system captures:</p>

                        <div className="space-y-4 text-left">
                            <div>
                                <h4 className="font-bold text-white">Rigidity Dynamics</h4>
                                <p className="text-sm text-slate-400">Changes in circumferential firmness during natural erectile response.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Stability Over Time</h4>
                                <p className="text-sm text-slate-400">The ability to maintain rigidity without rapid fluctuation or collapse.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Response Timing</h4>
                                <p className="text-sm text-slate-400">Onset, progression, and recovery characteristics across episodes.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Variability Patterns</h4>
                                <p className="text-sm text-slate-400">Night-to-night and context-dependent changes in rigidity behavior.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">Baseline Drift</h4>
                                <p className="text-sm text-slate-400">Long-term shifts in erectile response that may indicate improvement, degradation, or recovery.</p>
                            </div>
                        </div>

                        <div className="pt-4">
                            <p className="text-base text-white font-semibold mb-3">All measurements are:</p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
                                <span>Non-visual</span>
                                <span>•</span>
                                <span>Passive</span>
                                <span>•</span>
                                <span>Context-preserving</span>
                                <span>•</span>
                                <span>Abstracted into indices</span>
                            </div>
                        </div>

                        <p className="text-base text-slate-400 leading-relaxed pt-4">
                            RigiSense provides signal-level insight, not diagnosis, enabling clinical interpretation and long-term personal monitoring within a broader health and wellness framework.
                        </p>
                    </div>
                </div>

                {/* Hardware Architecture */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <h2 className="text-4xl font-black">Hardware Architecture</h2>

                    <p className="text-base text-slate-400 leading-relaxed">
                        RigiSense is designed as a single-purpose, clinical-grade sensing node, optimized for passive wear, signal stability, and long-term durability.
                    </p>

                    {/* Form Factor */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Form Factor</h3>
                        <div className="space-y-3 text-left">
                            <div>
                                <h4 className="font-semibold text-white">C-shaped silicone ring</h4>
                                <p className="text-sm text-slate-400">Allows easy application without full enclosure, supporting natural circulation while maintaining consistent contact during wear.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Minimalist, non-anatomical design</h4>
                                <p className="text-sm text-slate-400">Clean, neutral geometry suitable for clinical use and discreet personal health monitoring.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Medical-grade silicone construction</h4>
                                <p className="text-sm text-slate-400">Soft-touch exterior with controlled elasticity to balance comfort, durability, and reliable signal acquisition.</p>
                            </div>
                        </div>
                    </div>

                    {/* Fit Strategy */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Fit Strategy</h3>
                        <p className="text-sm text-slate-400">RigiSense is offered in two size profiles to accommodate the general population while preserving measurement integrity:</p>
                        <div className="space-y-3 text-left">
                            <div>
                                <h4 className="font-semibold text-white">Precision Fit (smaller size)</h4>
                                <p className="text-sm text-slate-400">Provides closer contact for higher baseline measurement accuracy and long-duration passive monitoring.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Power Fit (larger size)</h4>
                                <p className="text-sm text-slate-400">Accommodates larger anatomy while maintaining stable engagement during higher-dynamic rigidity phases.</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 italic">This fixed-size approach avoids adjustable mechanisms, preserving simplicity, comfort, and signal consistency.</p>
                    </div>

                    {/* Sensing & Contact Model */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Sensing & Contact Model</h3>
                        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside text-left">
                            <li>Circumferential contact regions are fully integrated within the silicone body</li>
                            <li>No exposed sensors, electrodes, or optical components</li>
                            <li>Contact geometry maintains engagement without constriction or discomfort</li>
                        </ul>
                        <p className="text-xs text-slate-500 italic">All sensing is performed through abstracted physical interaction, not anatomical imaging.</p>
                    </div>

                    {/* Power, Charging & Connectivity */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Power, Charging & Connectivity</h3>
                        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside text-left">
                            <li>Targeted battery life exceeding 24 hours under typical use conditions</li>
                            <li>Wireless inductive charging with no exposed ports or contacts</li>
                            <li>Sealed, waterproof construction suitable for daily wear</li>
                            <li>Bluetooth connectivity enables secure, low-energy data transmission to a companion application for visualization and longitudinal analysis</li>
                        </ul>
                        <p className="text-xs text-slate-500 italic">This architecture supports continuous monitoring while minimizing user interaction and maintenance.</p>
                    </div>

                    {/* Operation & User Interaction */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Operation & User Interaction</h3>
                        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside text-left">
                            <li>No buttons, lights, or on-device controls</li>
                            <li>Fully passive operation once worn</li>
                            <li>No required calibration routines or behavioral prompts</li>
                        </ul>
                        <p className="text-xs text-slate-500 italic">The device functions unobtrusively in the background, preserving natural physiology and signal integrity.</p>
                    </div>

                    {/* Design Philosophy */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Design Philosophy</h3>
                        <p className="text-sm text-slate-400">RigiSense hardware is designed to be:</p>
                        <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside text-left">
                            <li>Lightweight and comfortable for extended, continuous wear</li>
                            <li>Visually appealing and non-stigmatizing, suitable for both clinical and personal health contexts</li>
                            <li>Durable and functional, supporting long-term daily use in real-world conditions</li>
                            <li>Unobtrusive, requiring minimal user attention or interaction</li>
                        </ul>
                        <p className="text-xs text-slate-500 italic">These principles ensure the device remains wearable, trustworthy, and practical, while preserving the integrity of the physiological signals it captures.</p>
                    </div>
                </div>

                {/* Data Flow */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <h2 className="text-4xl font-black">Data Flow</h2>

                    <p className="text-base text-slate-400 leading-relaxed">
                        RigiSense moves data through a simple, controlled pipeline, from physical signal capture to longitudinal insight. Privacy is maintained through data minimization, non-visual sensing, and protected user profiles.
                    </p>

                    <div className="space-y-6">
                        {/* Step 1 */}
                        <div className="space-y-3 text-left">
                            <h3 className="text-lg font-bold text-white">1. Signal Acquisition (On-Device)</h3>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>The device passively captures circumferential signal changes during natural wear</li>
                                <li>Sampling occurs without requiring user input</li>
                                <li>No visual, audio, or anatomical imaging data is collected</li>
                            </ul>
                        </div>

                        {/* Step 2 */}
                        <div className="space-y-3 text-left">
                            <h3 className="text-lg font-bold text-white">2. Raw Sensor Output (Device → App)</h3>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>RigiSense transmits raw sensor inputs via Bluetooth Low Energy to the companion application</li>
                                <li>Transfer occurs at controlled intervals to support 24+ hour battery life</li>
                                <li>The system does not require continuous streaming for normal operation</li>
                            </ul>
                        </div>

                        {/* Step 3 */}
                        <div className="space-y-3 text-left">
                            <h3 className="text-lg font-bold text-white">3. Index Conversion (On-App)</h3>
                            <p className="text-sm text-slate-400">The companion app converts raw sensor inputs into:</p>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Normalized signal features</li>
                                <li>Time-series representations</li>
                                <li>Abstracted indices used for tracking and comparison</li>
                            </ul>
                            <p className="text-xs text-slate-500 italic">This allows the device to remain lightweight, while the app performs higher-level processing and presentation.</p>
                        </div>

                        {/* Step 4 */}
                        <div className="space-y-3 text-left">
                            <h3 className="text-lg font-bold text-white">4. App Identity & Profile Protection</h3>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>The app maintains a separate user profile layer (identity, pairing, preferences, organization)</li>
                                <li>This profile layer is encrypted/protected on-device</li>
                                <li>This design separates who the user is from the incoming sensor stream, reducing linkage risk</li>
                            </ul>
                        </div>

                        {/* Step 5 */}
                        <div className="space-y-3 text-left">
                            <h3 className="text-lg font-bold text-white">5. Interpretation & Longitudinal Monitoring</h3>
                            <p className="text-sm text-slate-400">The app organizes indices into:</p>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Trends</li>
                                <li>Stability patterns</li>
                                <li>Baseline shifts over time</li>
                            </ul>
                            <p className="text-sm text-slate-400 mt-2">Output views can support:</p>
                            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                                <li>Clinician review (early deployments)</li>
                                <li>Long-term personal monitoring (later consumer use)</li>
                                <li>Wellness and performance context</li>
                            </ul>
                            <p className="text-xs text-slate-500 italic mt-2">No automatic diagnosis is produced.</p>
                        </div>
                    </div>
                </div>

                {/* Why This Is Hard */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <h2 className="text-4xl font-black">Why This Is Hard</h2>

                    <p className="text-base text-slate-400 leading-relaxed">
                        Erectile physiology is difficult to measure accurately because it is continuous, highly variable, and sensitive to context. Small changes in environment, stress, sleep, or circulation can significantly alter rigidity patterns, making isolated measurements unreliable. At the same time, any device that requires user input, visual capture, or artificial stimulation risks changing the very signal it attempts to observe. Designing a system that remains comfortable, unobtrusive, and wearable over long periods—while still capturing stable, meaningful data—requires balancing signal fidelity, user comfort, power efficiency, and privacy without compromising any one constraint.
                    </p>
                </div>

                {/* Role in the Nexalis Ecosystem */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <h2 className="text-4xl font-black">Role In The Nexalis Ecosystem</h2>

                    <div className="space-y-6">
                        <p className="text-base text-slate-400 leading-relaxed">
                            RigiSense serves as the foundational sensing node within the Nexalis ecosystem.
                        </p>

                        <p className="text-base text-slate-400 leading-relaxed">
                            It is designed to provide high-quality, longitudinal rigidity data that can be used across multiple layers of the platform, rather than as a standalone outcome device.
                        </p>

                        <div className="space-y-3 text-left">
                            <p className="text-base text-white font-semibold">Within the Nexalis system, RigiSense:</p>
                            <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                                <li>Establishes a personal baseline for erectile rigidity and stability</li>
                                <li>Feeds abstracted signal data into Nexalis software for longitudinal analysis</li>
                                <li>Supports clinical evaluation workflows during early deployment</li>
                                <li>Enables future health, wellness, and performance insights as the ecosystem expands</li>
                            </ul>
                        </div>

                        <p className="text-base text-slate-400 leading-relaxed">
                            RigiSense is intentionally focused on signal acquisition, not diagnosis or interpretation. This separation allows higher-level Nexalis software layers to evolve independently, incorporating additional physiological inputs, clinical frameworks, and personalized models over time.
                        </p>

                        <p className="text-base text-slate-400 leading-relaxed">
                            As the first sensing node, RigiSense sets the standard for how data is collected, abstracted, and integrated across the Nexalis platform—forming the basis for future devices, insights, and system-level intelligence.
                        </p>
                    </div>
                </div>

                {/* Current Development Status */}
                <div className="space-y-8 pt-8 border-t border-white/10">
                    <h2 className="text-4xl font-black">Current Development Status</h2>

                    <div className="space-y-6">
                        <p className="text-base text-white font-semibold">
                            RigiSense is currently in the pre-development phase.
                        </p>

                        <p className="text-base text-slate-400 leading-relaxed">
                            Hardware design, firmware implementation, and application development have not yet begun. The system is being introduced at this stage to establish clear design constraints, clinical intent, and architectural direction before execution.
                        </p>

                        <div className="space-y-3 text-left">
                            <p className="text-base text-white font-semibold">This approach allows Nexalis to:</p>
                            <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
                                <li>Validate the measurement problem with clinicians</li>
                                <li>Align engineers around well-defined requirements</li>
                                <li>Avoid premature design decisions that compromise signal integrity, comfort, or scalability</li>
                            </ul>
                        </div>

                        <p className="text-base text-slate-400 leading-relaxed">
                            Development will proceed in clearly defined phases, beginning with hardware prototyping and signal validation, followed by firmware, application integration, and clinical evaluation.
                        </p>

                        <p className="text-base text-slate-400 leading-relaxed italic">
                            RigiSense is being presented now to invite early technical and clinical collaboration, not as a finished or partially implemented product.
                        </p>
                    </div>
                </div>

                {/* Next Actions */}
                <div className="space-y-8 pt-16 border-t border-white/10">
                    <h2 className="text-4xl font-black">Next Actions</h2>

                    <div className="space-y-8">
                        <div>
                            <h3 className="font-bold text-slate-400 uppercase text-sm tracking-widest mb-4">Primary</h3>
                            <button
                                onClick={() => setShowTechnicalBrief(true)}
                                className="px-8 py-3 bg-white text-black font-bold text-sm hover:bg-slate-200 transition-colors"
                            >
                                View Technical Brief
                            </button>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-400 uppercase text-sm tracking-widest mb-4">Secondary</h3>
                            <div className="flex flex-col gap-2 text-sm text-slate-500">
                                <button className="text-left hover:text-white transition-colors">→ Explore Signal Model</button>
                                <button className="text-left hover:text-white transition-colors">→ Collaborate with Nexalis</button>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 pt-4">
                            Nexalis is building a focused team around difficult physiological intelligence problems.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="py-12 px-8 border-t border-white/10 text-center text-xs text-slate-700">
                © 2026 Nexalis Health. RigiSense is a wellness device.
            </footer>

            <TechnicalBriefModal
                isOpen={showTechnicalBrief}
                onClose={() => setShowTechnicalBrief(false)}
            />
        </div>
    )
}
