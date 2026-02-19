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
            {/* Top-Level Node Switcher Removed per user request */}

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
