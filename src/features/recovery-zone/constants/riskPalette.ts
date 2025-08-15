// risk/RiskPalette.ts
export type RiskLevelId = 'low' | 'mid' | 'high';

export interface RiskLevelDef {
    id: RiskLevelId;
    label: string;
    // 점수 기반이면 min/max 사용 (min 포함, max 미포함)
    min?: number;
    max?: number;
    color: string;
}

export interface RiskPalette {
    name: string;
    levels: RiskLevelDef[];
    fallbackColor: string;
}

export const riskPaletteV1: RiskPalette = {
    name: 'risk_palette_v1',
    levels: [
        { id: 'low', label: '낮음', min: 0, max: 0.33, color: '#FFD8C0' },
        { id: 'mid', label: '보통', min: 0.33, max: 0.66, color: '#FFA18A' },
        { id: 'high', label: '높음', min: 0.66, max: 1.01, color: '#FF7765' }
    ],
    fallbackColor: '#E0E0E0'
};

export function scoreToLevel(score: number, pal: RiskPalette = riskPaletteV1): RiskLevelId | null {
    const lv = pal.levels.find(l => (l.min ?? -Infinity) <= score && score < (l.max ?? Infinity));
    return (lv?.id ?? null);
}

export function levelToColor(level: RiskLevelId | null, pal: RiskPalette = riskPaletteV1): string {
    const lv = pal.levels.find(l => l.id === level);
    return lv?.color ?? pal.fallbackColor;
}

export function colorForScore(score: number | undefined, pal: RiskPalette = riskPaletteV1): string {
    if (typeof score !== 'number') return pal.fallbackColor;
    const level = scoreToLevel(score, pal);
    return levelToColor(level, pal);
}