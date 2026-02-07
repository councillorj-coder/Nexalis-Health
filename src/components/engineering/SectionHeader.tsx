import React from 'react';

interface SectionHeaderProps {
    id?: string;
    title: string;
    rightElement?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ id, title, rightElement }) => {
    return (
        <div id={id} className="flex items-center justify-between border-b border-white/10 pb-2 mb-4 mt-8 first:mt-0">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">{title}</h2>
            {rightElement}
        </div>
    );
};
