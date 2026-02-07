import React from 'react';

type PillVariant = 'default' | 'success' | 'warning' | 'error' | 'neutral';

interface PillProps {
    label: string;
    variant?: PillVariant;
    className?: string; // Allow extra classes
}

export const Pill: React.FC<PillProps> = ({ label, variant = 'default', className = '' }) => {
    let colorClass = 'bg-slate-800 text-slate-300 border-slate-700';
    if (variant === 'success') colorClass = 'bg-emerald-950/50 text-emerald-400 border-emerald-900/50';
    if (variant === 'warning') colorClass = 'bg-amber-950/50 text-amber-400 border-amber-900/50';
    if (variant === 'error') colorClass = 'bg-rose-950/50 text-rose-400 border-rose-900/50';
    if (variant === 'neutral') colorClass = 'bg-slate-900/50 text-slate-500 border-slate-800';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded textxs font-mono border ${colorClass} ${className}`}>
            {label}
        </span>
    );
};
