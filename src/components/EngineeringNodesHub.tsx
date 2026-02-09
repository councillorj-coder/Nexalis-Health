import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EngineeringCompass from './EngineeringCompass';
import EngineeringSentinel from './EngineeringSentinel';
import EngineeringElaria from './EngineeringElaria';
import EngineeringMeridia from './EngineeringMeridia';
import EngineeringCaliber from './EngineeringCaliber';

type NodeKey = 'compass' | 'mantrix' | 'innersense' | 'meridia' | 'caliber';

const EngineeringNodesHub: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Determine active node from URL or default to compass
    const getActiveNodeFromPath = () => {
        if (location.pathname.includes('/mantrix')) return 'mantrix';
        if (location.pathname.includes('/innersense')) return 'innersense';
        if (location.pathname.includes('/meridia')) return 'meridia';
        if (location.pathname.includes('/caliber')) return 'caliber';
        return 'compass';
    };

    const activeNode = getActiveNodeFromPath();

    const nodes = [
        { key: 'compass', label: 'Compass', color: 'border-emerald-500/50' },
        { key: 'mantrix', label: 'Sentinel™', color: 'border-emerald-500/50' },
        { key: 'innersense', label: 'Elaria', color: 'border-emerald-500/50' },
        { key: 'meridia', label: 'Meridia™', color: 'border-emerald-500/50' },
        { key: 'caliber', label: 'Caliber™', color: 'border-emerald-500/50' },
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
                {activeNode === 'compass' && <EngineeringCompass />}
                {activeNode === 'mantrix' && <EngineeringSentinel />}
                {activeNode === 'innersense' && <EngineeringElaria />}
                {activeNode === 'meridia' && <EngineeringMeridia />}
                {activeNode === 'caliber' && <EngineeringCaliber />}
            </div>
        </div>
    );
};

export default EngineeringNodesHub;
