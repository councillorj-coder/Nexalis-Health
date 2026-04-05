import type { ReactNode } from 'react';
import { foundationTheme, getArcGlassPillStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

export default function ArcScreenHeader({
  title,
  onBack,
  trailing,
}: {
  title: string;
  onBack: () => void;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <button
        onClick={onBack}
        className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
        style={{
          ...getArcGlassPillStyle(foundationTheme, 'light'),
          borderColor: hexToRgba('#FFFFFF', 0.075),
          color: foundationTheme.text.primary,
        }}
        aria-label={`Back from ${title}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="flex-1" style={{ ...getArcTypographyStyle(foundationTheme, 'screenTitle'), color: foundationTheme.text.primary }}>{title}</div>
      {trailing ?? null}
    </div>
  );
}
