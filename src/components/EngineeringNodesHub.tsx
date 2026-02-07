import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EngineeringAxis from './EngineeringAxis';
import EngineeringRigiSense from './EngineeringRigiSense';
import EngineeringInnerSense from './EngineeringInnerSense';
import EngineeringComfortSense from './EngineeringComfortSense';
import EngineeringFitSense from './EngineeringFitSense';

type NodeKey = 'axis' | 'rigisense' | 'innersense' | 'comfortsense' | 'fitsense';

const EngineeringNodesHub: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active node from URL or default to axis
    const getActiveNodeFromPath = () => {
        if (location.pathname.includes('/rigisense')) return 'rigisense';
        if (location.pathname.includes('/innersense')) return 'innersense';
        if (location.pathname.includes('/comfortsense')) return 'comfortsense';
        if (location.pathname.includes('/fitsense')) return 'fitsense';
        return 'axis';
    };

    const activeNode = getActiveNodeFromPath();

    const nodes = [
        { key: 'axis', label: 'Axis', color: 'border-emerald-500/50' },
        { key: 'rigisense', label: 'RigiSense', color: 'border-emerald-500/50' },
        { key: 'innersense', label: 'InnerSense', color: 'border-emerald-500/50' },
        { key: 'comfortsense', label: 'ComfortSense', color: 'border-emerald-500/50' },
        { key: 'fitsense', label: 'FitSense', color: 'border-emerald-500/50' },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-black text-white overflow-hidden">
            {/* Top-Level Node Switcher Tabs */}
            <div className="flex-none bg-[#050505] border-b border-white/10 px-6 py-3 flex items-center justify-between">
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl overflow-x-auto">
                    {nodes.map((node) => (
                        <button
                            key={node.key}
                            onClick={() => navigate(`/engineering/${node.key}`)}
                            className={`px-6 py-2 rounded-lg text-[10px] uppercase tracking-[0.2em] font-black transition-all whitespace-nowrap border ${activeNode === node.key
                                    ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            {node.label}
                        </button>
                    ))}
                </div>
                <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                    <span>Node Ecosystem</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                </div>
            </div>

            {/* Render the Active Node Module */}
            <div className="flex-1 overflow-hidden relative">
                {activeNode === 'axis' && <EngineeringAxis />}
                {activeNode === 'rigisense' && <EngineeringRigiSense />}
                {activeNode === 'innersense' && <EngineeringInnerSense />}
                {activeNode === 'comfortsense' && <EngineeringComfortSense />}
                {activeNode === 'fitsense' && <EngineeringFitSense />}
            </div>
        </div>
    );
};

export default EngineeringNodesHub;
