import React from 'react';

export const NexalisAppVisual: React.FC = () => {
    return (
        <g>
            {/* Text centered at top */}
            <text x="400" y="28" textAnchor="middle"
                className="fill-white text-[10px] font-semibold tracking-wider"
                style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            >
                NEXALIS APP
            </text>

            {/* Static Nexalis Logo - Centered below text */}
            <g transform="translate(379, 34) scale(0.42)">
                <defs>
                    <linearGradient id="logoGradA" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0F172A" />
                        <stop offset="50%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#E0F2FE" />
                    </linearGradient>
                    <linearGradient id="logoGradB" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#450A0A" />
                        <stop offset="50%" stopColor="#E11D48" />
                        <stop offset="100%" stopColor="#FBBF24" />
                    </linearGradient>
                </defs>
                {/* Shard A (Blue) - Resting state: translateX(8px) */}
                <g transform="translate(8, 0)">
                    <path d="M48 5 L68 50 L48 95 L28 50 Z" fill="url(#logoGradA)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                </g>
                {/* Shard B (Red) - Resting state: translateX(-8px) */}
                <g transform="translate(-8, 0)">
                    <path d="M52 5 L72 50 L52 95 L32 50 Z" fill="url(#logoGradB)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" style={{ mixBlendMode: 'screen' }} />
                </g>
                {/* Union Star - Resting state: scale(1.6) centered */}
                <g transform="translate(50, 50) scale(1.6) translate(-50, -50)">
                    <path d="M50 42 L54 50 L50 58 L46 50 Z" fill="white" />
                </g>
            </g>
        </g>
    );
};
