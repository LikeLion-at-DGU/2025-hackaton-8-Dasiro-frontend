// risk/RiskData.ts

export interface DistrictRisk {
    // 고유키: 행정구 코드(권장) 또는 이름 중 하나를 제공
    admCd?: string;                 // 예: '11680'
    name?: string;                  // 예: '강남구'
    riskScore?: number;             // 0 ~ 1
    riskLevel?: 'low' | 'mid' | 'high';
    updatedAt?: string;
}

// 예시 시드 (실무에선 API fetch로 교체)
export const sampleRiskData: DistrictRisk[] = [
    { name: '강남구', riskScore: 0.72 },
    { name: '서초구', riskScore: 0.58 },
    { name: '송파구', riskScore: 0.31 },
];

export function makeRiskIndex(list: DistrictRisk[]) {
    const byName = new Map<string, DistrictRisk>();
    const byCode = new Map<string, DistrictRisk>();
    list.forEach(d => {
        if (d.name) byName.set(d.name, d);
        if (d.admCd) byCode.set(d.admCd, d);
    });
    return { byName, byCode };
}

/** 원격 위험도 JSON을 받는 경우용 헬퍼 */
export async function fetchDistrictRisk(url: string, init?: RequestInit): Promise<DistrictRisk[]> {
    const res = await fetch(url, init);
    if (!res.ok) throw new Error('Risk 데이터 응답 에러: ' + res.status);
    return (await res.json()) as DistrictRisk[];
}