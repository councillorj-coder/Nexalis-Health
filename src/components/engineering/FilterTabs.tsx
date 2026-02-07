import React from 'react';

interface FilterTabsProps {
    options: string[];
    active: string;
    onChange: (val: string) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = ({ options, active, onChange }) => {
    return (
        <div className="flex gap-1 border-b border-white/10 mb-4">
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`px-3 py-1 text-sm transition-colors border-b-2 ${active === opt
                            ? 'border-blue-500 text-blue-400 font-bold'
                            : 'border-transparent text-slate-500 hover:text-slate-300'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
};
