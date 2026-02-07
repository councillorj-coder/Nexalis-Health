import React from 'react';
import { architectureNodes } from '../../data/engineering-data';

export const ArchitectureMetadata: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="bg-slate-900/20 border border-white/5 h-64 flex items-center justify-center relative overflow-hidden rounded-sm">
                {/* Placeholder for Diagram */}
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:16px_16px]" />
                <div className="text-center">
                    <div className="text-4xl mb-2 opacity-50 font-thin">⌬</div>
                    <span className="text-xs uppercase tracking-widest text-slate-500">System Diagram Placeholder</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Signal Flow</h4>
                    <div className="flex flex-wrap gap-2">
                        {architectureNodes.map((node, i) => (
                            <div key={i} className="flex items-center text-xs text-slate-400">
                                <span className="bg-slate-800 px-2 py-1 rounded border border-white/5">{node}</span>
                                {i < architectureNodes.length - 1 && <span className="mx-1 text-slate-600">→</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Sampling Model</h4>
                        <p className="text-xs text-slate-400">Fixed-rate 100Hz interrupt-driven buffering with DMA transfer to BLE stack. 20ms connection interval.</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white mb-1">Outputs</h4>
                        <p className="text-xs text-slate-400">Real-time raw packets + 1s aggregate stats (Media/Variance/Peak). Asynchronous event flagging.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
