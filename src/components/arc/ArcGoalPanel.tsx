import React from 'react';
import type { ArcFoundationGoalState } from '../../data/foundationGoalState';
import ArcAtmosphere from './ArcAtmosphere';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

interface ArcGoalPanelProps {
  visible: boolean;
  goal: ArcFoundationGoalState;
}

export default function ArcGoalPanel({ visible, goal }: ArcGoalPanelProps) {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        right: 'calc(50% + 220px)',
        top: '80px',
        width: '292px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(10px) scale(0.98)',
        transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      <div
        className="relative rounded-2xl p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.035 }),
          border: `1px solid ${hexToRgba('#FFFFFF', 0.075)}`,
        }}
      >
        <ArcAtmosphere variant="modal" intensity={0.38} className="z-0 rounded-2xl" />
        <div className="relative z-10">
          <div className="mb-3 flex items-center gap-2">
            <div className="relative flex h-2.5 w-4 items-center">
              <div
                className="h-px w-4 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${hexToRgba(foundationTheme.accent.primary, 0.82)} 0%, ${hexToRgba(foundationTheme.accent.primary, 0.2)} 100%)`,
                }}
              />
              <div
                className="absolute right-0 h-1 w-1 rounded-full"
                style={{
                  background: hexToRgba(foundationTheme.accent.primary, 0.82),
                  boxShadow: `0 0 0 1px ${hexToRgba(foundationTheme.accent.primary, 0.14)}`,
                }}
              />
            </div>
            <h3 style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
              Current Goal
            </h3>
          </div>

          <div style={{ ...getArcTypographyStyle(foundationTheme, 'sectionTitle'), color: hexToRgba(foundationTheme.accent.primary, 0.84) }}>
            {goal.label}
          </div>

          <div className="mt-2 inline-flex items-center rounded-full border px-2 py-1" style={{
            ...getArcGlassPillStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.03 }),
            borderColor: hexToRgba('#FFFFFF', 0.07),
          }}>
            <span style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted, fontSize: '0.5rem', letterSpacing: '0.15em' }}>
              {goal.source === 'foundationChecklist'
                ? `Foundation progress • ${goal.completionSummary}`
                : goal.category === 'broad'
                  ? 'Profile direction'
                  : 'Specific focus'}
            </span>
          </div>

          <p className="mt-3" style={{ ...getArcTypographyStyle(foundationTheme, 'body'), color: foundationTheme.text.secondary }}>
            {goal.description}
          </p>

          <div
            className="mt-4 rounded-2xl border px-3 py-3"
            style={{
              ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.028 }),
              borderColor: hexToRgba('#FFFFFF', 0.07),
            }}
          >
            <div style={{ ...getArcTypographyStyle(foundationTheme, 'label'), color: foundationTheme.text.muted }}>
              Active focus
            </div>
            <div className="mt-1" style={{ ...getArcTypographyStyle(foundationTheme, 'cardTitle'), color: foundationTheme.text.primary }}>
              {goal.currentTaskTitle ?? goal.activeFocusLabel ?? goal.label}
            </div>
            <div className="mt-1.5" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.secondary }}>
              {goal.currentTaskTargetLabel ?? goal.progressHint}
            </div>
            <div className="mt-1.5" style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              {goal.currentTaskProgressLabel ?? goal.completionSummary}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t" style={{ borderColor: foundationTheme.border.soft }}>
            <p style={{ ...getArcTypographyStyle(foundationTheme, 'caption'), color: foundationTheme.text.muted }}>
              Shapes emphasis across {goal.relatedModules.join(', ')}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
