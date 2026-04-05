import { useState } from 'react';
import { appThemes } from '../../data/arc-mock-data';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcTypographyStyle, hexToRgba } from './arc-theme';

export default function ArcThemeScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState('foundation');
  const activeTheme = appThemes.find(theme => theme.id === selected) ?? appThemes[0];

  return (
    <div className="space-y-4">
      <ArcScreenHeader title="Customize" onBack={onBack} />

      <div
        className="rounded-[28px] border px-5 py-5"
        style={{
          background: foundationTheme.surface.card,
          borderColor: foundationTheme.border.soft,
          boxShadow: foundationTheme.shadow.card,
        }}
      >
        <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.accent.primary }}>
          Starter Theme
        </div>
        <div className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'screenTitle'), color: foundationTheme.text.primary }}>
          {activeTheme?.name ?? foundationTheme.name}
        </div>
        <p className="mt-2" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
          {activeTheme?.description ?? foundationTheme.description}
        </p>
      </div>

      <div>
        <div className="mb-3" style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.muted }}>Themes</div>
        <div className="grid grid-cols-2 gap-3">
          {appThemes.map(theme => (
            <button
              key={theme.id}
              onClick={() => theme.unlocked && setSelected(theme.id)}
              className="relative rounded-2xl border p-4 text-left transition-all duration-300"
              style={{
                borderColor:
                  selected === theme.id
                    ? hexToRgba(theme.accent, 0.34)
                    : theme.unlocked
                      ? foundationTheme.border.soft
                      : foundationTheme.border.inset,
                background:
                  selected === theme.id
                    ? foundationTheme.surface.card
                    : theme.unlocked
                      ? foundationTheme.surface.card
                      : foundationTheme.surface.elevated,
                opacity: theme.unlocked ? 1 : 0.48,
                boxShadow: selected === theme.id ? `0 14px 26px ${hexToRgba(theme.accent, 0.08)}` : 'none',
              }}
            >
              {!theme.unlocked && (
                <div className="absolute top-2 right-2" style={{ ...getArcTypographyStyle(foundationTheme, 'label'), fontSize: '0.4375rem', color: foundationTheme.text.muted }}>LOCK</div>
              )}
              <div className="mb-2 h-8 w-8 rounded-full border" style={{ background: theme.accent, borderColor: foundationTheme.border.strong }} />
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>{theme.name}</div>
              {theme.description && (
                <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
                  {theme.description}
                </div>
              )}
              {selected === theme.id && (
                <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full" style={{ background: theme.accent }}>
                  <svg className="h-2.5 w-2.5" style={{ color: foundationTheme.text.inverse }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <div className="mb-3" style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: foundationTheme.text.muted }}>Preferences</div>
        <div className="space-y-2">
          {[
            { label: 'Card Density', value: 'Comfortable' },
            { label: 'Graph Detail', value: 'Standard' },
            { label: 'Accent Language', value: 'Warm Titanium' },
            { label: 'Quick Dashboard', value: 'Default' },
            { label: 'Privacy Mode', value: 'Off' },
          ].map((pref, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-2xl border p-3.5"
              style={{
                background: foundationTheme.surface.card,
                borderColor: foundationTheme.border.soft,
              }}
            >
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary, fontSize: '0.75rem' }}>{pref.label}</div>
              <div style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>{pref.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
