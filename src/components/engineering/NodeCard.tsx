import React from 'react';
import { NodeStatus } from '../../data/engineering-data';
import { Pill } from './Pill';

interface NodeCardProps {
    node: NodeStatus;
}

export const NodeCard: React.FC<NodeCardProps> = ({ node }) => {
    let statusVariant: 'success' | 'warning' | 'default' | 'neutral' = 'default';
    if (node.status === 'Stable') statusVariant = 'success';
    if (node.status === 'Beta') statusVariant = 'warning';
    if (node.status === 'Concept') statusVariant = 'neutral';

    return (
        <div className="bg-slate-900/40 border border-white/5 p-4 rounded-sm flex flex-col gap-2 hover:bg-slate-900/60 transition-colors">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-200">{node.name}</h3>
                <Pill label={node.status} variant={statusVariant} />
            </div>
            <p className="text-xs text-slate-500 line-clamp-2">{node.description}</p>
            <div className="mt-auto flex flex-wrap gap-1 pt-2">
                {node.domains.map((d) => (
                    <span key={d} className="text-[10px] text-slate-400 bg-white/5 px-1 rounded">
                        {d}
                    </span>
                ))}
            </div>
        </div>
    );
};
