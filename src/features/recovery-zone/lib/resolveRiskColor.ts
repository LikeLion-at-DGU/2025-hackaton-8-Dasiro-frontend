import { makeRiskIndex, type DistrictRisk } from '../RiskData';
import { type RiskPalette, levelToColor, colorForScore } from '../RiskPalette';

export function createRiskColorResolver(
  riskData: DistrictRisk[],
  palette: RiskPalette
) {
  const index = makeRiskIndex(riskData);
  return ({ name, code }: { name?: string; code?: string }) => {
    const risk =
      (code && index.byCode.get(code)) || (name && index.byName.get(name));
    if (risk?.riskLevel) return levelToColor(risk.riskLevel, palette);
    if (typeof risk?.riskScore === 'number')
      return colorForScore(risk.riskScore, palette);
    return palette.fallbackColor;
  };
}
