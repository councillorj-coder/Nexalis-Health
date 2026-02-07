import React from 'react';
import { SpecItem } from '../../data/engineering-data';

interface SpecTableProps {
    specs: SpecItem[];
}

export const SpecTable: React.FC<SpecTableProps> = ({ specs }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
                <thead>
                    <tr className="border-b border-white/10 text-slate-500">
                        <th className="py-2 px-1 font-normal w-1/4">Category</th>
                        <th className="py-2 px-1 font-normal w-1/4">Parameter</th>
                        <th className="py-2 px-1 font-normal w-1/4">Value</th>
                        <th className="py-2 px-1 font-normal w-1/4">Notes</th>
                    </tr>
                </thead>
                <tbody className="text-slate-300 font-mono">
                    {specs.map((spec, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-2 px-1 text-slate-500">{spec.category}</td>
                            <td className="py-2 px-1 font-semibold">{spec.parameter}</td>
                            <td className="py-2 px-1 text-emerald-400">{spec.value}</td>
                            <td className="py-2 px-1 text-slate-500 italic">{spec.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
