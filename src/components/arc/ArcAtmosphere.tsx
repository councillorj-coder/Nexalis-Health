import type { ArcAtmosphereVariantName, ArcThemeTokens } from './arc-theme';

type ArcAtmosphereProps = {
  variant: ArcAtmosphereVariantName;
  theme?: ArcThemeTokens;
  intensity?: number;
  className?: string;
};
export default function ArcAtmosphere(_: ArcAtmosphereProps) {
  return null;
}
