import { useEffect, useMemo, useState } from 'react';
import type { ArcAppDataSnapshot } from '../../data/arc-app-data';
import { getInsigniaFamilies, isEmberSigilTier, type ArcInsigniaFamilyItem } from '../../data/arc-insignia';
import type { AvatarTier } from '../../data/arc-types';
import ArcInsignia from './ArcInsignia';
import ArcScreenHeader from './ArcScreenHeader';
import { foundationTheme, getArcGlassPillStyle, getArcGlassSurfaceStyle, getArcTypographyStyle, hexToRgba } from './arc-theme';

function StatusField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1.5">
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'label'),
          color: hexToRgba(foundationTheme.text.secondary, 0.46),
          fontSize: '0.46rem',
          letterSpacing: '0.11em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
          color: hexToRgba(foundationTheme.text.primary, 0.88),
          fontSize: '0.8rem',
          lineHeight: 1.1,
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CollectionRow({
  item,
  selected,
  onSelect,
}: {
  item: ArcInsigniaFamilyItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const isEmberFamily = isEmberSigilTier(item.tier);
  const stateLabel = item.isActive ? 'Active' : selected ? 'Selected' : 'View';

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-[22px] border px-4 py-3 text-left transition-all duration-300 hover:border-white/[0.08] active:scale-[0.995]"
      style={{
        ...getArcGlassSurfaceStyle(
          foundationTheme,
          'light',
          selected ? { tint: foundationTheme.accent.primary, tintStrength: 0.02 } : undefined,
        ),
        borderColor: selected ? hexToRgba(foundationTheme.accent.primary, 0.15) : hexToRgba('#FFFFFF', 0.055),
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center ${isEmberFamily ? '' : 'rounded-[18px] border'}`}
          style={
            isEmberFamily
              ? undefined
              : {
                  ...getArcGlassSurfaceStyle(foundationTheme, 'light', { tint: foundationTheme.accent.primary, tintStrength: 0.014 }),
                  borderColor: hexToRgba('#FFFFFF', 0.055),
                }
          }
        >
          <ArcInsignia tier={item.tier} size={isEmberFamily ? 46 : 38} />
        </div>
        <div>
          <div
            style={{
              ...getArcTypographyStyle(foundationTheme, 'cardTitle'),
              color: foundationTheme.text.primary,
            }}
          >
            {item.currentTitle}
          </div>
          <div
            className="mt-1"
            style={{
              ...getArcTypographyStyle(foundationTheme, 'caption'),
              color: hexToRgba(foundationTheme.text.secondary, 0.76),
            }}
          >
            {item.summary}
          </div>
        </div>
      </div>

      <div
        className="rounded-full border px-3 py-1"
        style={{
          ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
          ...getArcGlassPillStyle(foundationTheme, 'light', {
            tint: selected ? foundationTheme.accent.primary : foundationTheme.text.secondary,
            tintStrength: selected ? 0.024 : 0.01,
          }),
          color: item.isActive
            ? foundationTheme.accent.primary
            : selected
              ? foundationTheme.text.primary
              : hexToRgba(foundationTheme.text.secondary, 0.66),
          borderColor: item.isActive
            ? hexToRgba(foundationTheme.accent.primary, 0.15)
            : hexToRgba('#FFFFFF', 0.045),
        }}
      >
        {stateLabel}
      </div>
    </button>
  );
}

export default function ArcInsigniaInventoryScreen({
  onBack,
  data,
  onEquipInsignia,
}: {
  onBack: () => void;
  data: ArcAppDataSnapshot;
  onEquipInsignia: (tier: AvatarTier) => void;
}) {
  const ownedFamilies = useMemo(
    () => getInsigniaFamilies(data.wearStreakDays, data.userProfile.tier).filter(item => item.isOwned),
    [data.userProfile.tier, data.wearStreakDays],
  );
  const activeFamily =
    ownedFamilies.find(item => item.isActive) ??
    ownedFamilies[0];
  const [selectedTier, setSelectedTier] = useState<AvatarTier>(
    activeFamily?.availableTiers.find(item => item.isActive)?.tier ??
    activeFamily?.availableTiers[activeFamily.availableTiers.length - 1]?.tier ??
    activeFamily?.tier ??
    'threshold',
  );

  useEffect(() => {
    if (!ownedFamilies.some(item => item.availableTiers.some(option => option.tier === selectedTier))) {
      setSelectedTier(
        activeFamily?.availableTiers.find(item => item.isActive)?.tier ??
        activeFamily?.availableTiers[activeFamily.availableTiers.length - 1]?.tier ??
        activeFamily?.tier ??
        'threshold',
      );
    }
  }, [activeFamily, ownedFamilies, selectedTier]);

  const selectedFamily =
    ownedFamilies.find(item => item.availableTiers.some(option => option.tier === selectedTier)) ??
    activeFamily;
  const selectedOption =
    selectedFamily?.availableTiers.find(item => item.tier === selectedTier) ??
    selectedFamily?.availableTiers.find(item => item.isActive) ??
    selectedFamily?.availableTiers[selectedFamily.availableTiers.length - 1];

  if (!selectedFamily || !selectedOption) {
    return (
      <div className="space-y-4 pb-8">
        <ArcScreenHeader title="Insignia Inventory" onBack={onBack} />
      </div>
    );
  }

  const isSelectedEmber = isEmberSigilTier(selectedOption.tier);
  const isSelectedActive = selectedOption.isActive;
  const selectedInsigniaSize = isSelectedEmber ? 196 : 82;
  const stateValue = isSelectedActive ? 'Equipped' : 'Available';
  const knownMarks = selectedFamily.availableTiers.map(item => item.tierLabel);

  const handleSelectFamily = (item: ArcInsigniaFamilyItem) => {
    setSelectedTier(
      item.availableTiers.find(option => option.isActive)?.tier ??
      item.availableTiers[item.availableTiers.length - 1]?.tier ??
      item.tier,
    );
  };

  return (
    <div className="space-y-4 pb-8">
      <ArcScreenHeader title="Insignia Inventory" onBack={onBack} />

      <div
        className="rounded-[30px] border p-5"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'hero', { tint: foundationTheme.accent.primary, tintStrength: 0.022 }),
          borderColor: hexToRgba('#FFFFFF', 0.065),
        }}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_136px] items-start gap-4">
          <div className="min-w-0">
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
                color: hexToRgba(foundationTheme.text.secondary, 0.7),
                letterSpacing: '0.11em',
              }}
            >
              {isSelectedActive ? 'ACTIVE INSIGNIA' : 'SELECTED INSIGNIA'}
            </div>
            <div
              className="mt-3"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'heroValue'),
                color: foundationTheme.text.highlight,
                fontSize: '1.5rem',
                lineHeight: 1.02,
              }}
            >
              {selectedOption.title}
            </div>
            <div
              className="mt-2.5 max-w-[180px]"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'body'),
                color: hexToRgba(foundationTheme.text.secondary, 0.78),
                fontSize: '0.8rem',
                lineHeight: 1.25,
                fontStyle: 'italic',
              }}
            >
              {selectedOption.quote}
            </div>
          </div>

          <div className="relative flex h-[148px] w-[136px] items-start justify-center overflow-visible">
            <div
              className="pointer-events-none absolute left-1/2 top-[42%]"
              style={{ transform: isSelectedEmber ? 'translate(-36%, -50%)' : 'translate(-50%, -50%)' }}
            >
              <ArcInsignia tier={selectedOption.tier} size={selectedInsigniaSize} />
            </div>
          </div>
        </div>

        <div
          className="mt-2 border-t pt-4"
          style={{ borderColor: hexToRgba('#FFFFFF', 0.048) }}
        >
          <div className="grid grid-cols-3 gap-4">
            <StatusField label="STATE" value={stateValue} />
            <StatusField label="TIER" value={selectedOption.tierLabel} />
            <StatusField label="RESONANCE" value={selectedOption.resonance} />
          </div>

          <div className="mt-4 border-t pt-4" style={{ borderColor: hexToRgba('#FFFFFF', 0.04) }}>
            <div
              style={{
                ...getArcTypographyStyle(foundationTheme, 'label'),
                color: hexToRgba(foundationTheme.text.secondary, 0.46),
                fontSize: '0.46rem',
                letterSpacing: '0.11em',
              }}
            >
              KNOWN MARKS
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {knownMarks.map(mark => {
                const option = selectedFamily.availableTiers.find(item => item.tierLabel === mark);
                const isCurrentMark = option?.tier === selectedOption.tier;
                return (
                  <button
                    key={mark}
                    type="button"
                    onClick={() => option && setSelectedTier(option.tier)}
                    className="rounded-full border px-3 py-1.5 transition-all duration-300 hover:border-white/[0.08] active:scale-[0.985]"
                    style={{
                      ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                      ...getArcGlassPillStyle(foundationTheme, 'light', {
                        tint: isCurrentMark ? foundationTheme.accent.primary : foundationTheme.text.secondary,
                        tintStrength: isCurrentMark ? 0.026 : 0.01,
                      }),
                      color: isCurrentMark
                        ? foundationTheme.text.primary
                        : hexToRgba(foundationTheme.text.secondary, 0.8),
                      borderColor: isCurrentMark
                        ? hexToRgba(foundationTheme.accent.primary, 0.16)
                        : hexToRgba('#FFFFFF', 0.045),
                    }}
                  >
                    {mark}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="mt-4 flex items-end justify-between gap-4 border-t pt-4"
            style={{ borderColor: hexToRgba('#FFFFFF', 0.04) }}
          >
            <div
              className="max-w-[190px]"
              style={{
                ...getArcTypographyStyle(foundationTheme, 'caption'),
                color: hexToRgba(foundationTheme.text.secondary, 0.66),
                fontSize: '0.68rem',
                lineHeight: 1.28,
              }}
            >
              {selectedOption.mysteryLine}
            </div>

            {isSelectedActive ? (
              <div
                className="rounded-full border px-3.5 py-2"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  ...getArcGlassPillStyle(foundationTheme, 'light', {
                    tint: foundationTheme.accent.primary,
                    tintStrength: 0.02,
                  }),
                  color: foundationTheme.accent.primary,
                  borderColor: hexToRgba(foundationTheme.accent.primary, 0.14),
                }}
              >
                Equipped
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onEquipInsignia(selectedOption.tier)}
                className="rounded-full border px-4 py-2 transition-all duration-300 hover:border-white/[0.08] active:scale-[0.99]"
                style={{
                  ...getArcTypographyStyle(foundationTheme, 'pillLabel'),
                  ...getArcGlassPillStyle(foundationTheme, 'light', {
                    tint: foundationTheme.accent.primary,
                    tintStrength: 0.02,
                  }),
                  color: foundationTheme.text.primary,
                  borderColor: hexToRgba('#FFFFFF', 0.07),
                }}
              >
                Set Active
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="rounded-[30px] border p-4"
        style={{
          ...getArcGlassSurfaceStyle(foundationTheme, 'medium', { tint: foundationTheme.accent.primary, tintStrength: 0.016 }),
          borderColor: hexToRgba('#FFFFFF', 0.06),
        }}
      >
        <div
          className="mb-4"
          style={{
            ...getArcTypographyStyle(foundationTheme, 'sectionTitle'),
            color: hexToRgba(foundationTheme.text.secondary, 0.66),
          }}
        >
          Collection
        </div>

        <div className="space-y-2.5">
          {ownedFamilies.map(item => (
            <CollectionRow
              key={item.familyId}
              item={item}
              selected={selectedFamily.familyId === item.familyId}
              onSelect={() => handleSelectFamily(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
