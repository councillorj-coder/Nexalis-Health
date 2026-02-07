import React from 'react';
import { Issue } from '../../data/engineering-data';
import { Pill } from './Pill';

interface IssueCardProps {
    issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
    let statusColor = 'border-l-slate-600';
    if (issue.status === 'Done') statusColor = 'border-l-emerald-500';
    if (issue.status === 'In Progress') statusColor = 'border-l-blue-500';
    if (issue.status === 'Review') statusColor = 'border-l-amber-500';

    return (
        <div className={`bg-slate-900/30 border border-white/5 p-3 rounded-sm border-l-4 ${statusColor} text-sm flex flex-col gap-2`}>
            <div className="flex justify-between items-start">
                <span className="font-mono text-xs text-slate-500">{issue.id}</span>
                <div className="flex gap-2">
                    <span className="textxs font-bold text-slate-600">Es: {issue.effort}</span>
                    <Pill label={issue.status} className="text-[10px] uppercase" />
                </div>
            </div>
            <h4 className="font-semibold text-slate-200">{issue.title}</h4>
            <div className="text-xs text-slate-500">
                <span className="block mb-1 font-mono text-[10px] uppercase tracking-wider">Definition of Done:</span>
                <ul className="list-disc list-inside">
                    {issue.dod.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}
                </ul>
            </div>
            <div className="mt-auto pt-2 border-t border-white/5">
                <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{issue.discipline}</span>
            </div>
        </div>
    );
};
