/**
 * 바코드 생성 유틸리티
 * SVG를 사용하여 간단한 바코드 패턴을 생성합니다.
 */

export interface BarcodeOptions {
  width?: number;
  height?: number;
  backgroundColor?: string;
  barColor?: string;
  text?: string;
  showText?: boolean;
}

/**
 * 주어진 텍스트를 바탕으로 바코드 패턴을 생성합니다.
 * @param data - 바코드로 변환할 텍스트 (숫자 또는 문자열)
 * @param options - 바코드 스타일 옵션
 * @returns SVG 형태의 바코드 문자열
 */
export function generateBarcode(data: string, options: BarcodeOptions = {}): string {
  const {
    width = 200,
    height = 60,
    backgroundColor = 'white',
    barColor = 'black',
    text = data,
    showText = true
  } = options;

  // 간단한 바코드 패턴 생성 (실제 바코드 표준은 아니지만 시각적으로 유사)
  const pattern = generateBarcodePattern(data);
  const barWidth = width / pattern.length;
  const textHeight = showText ? 15 : 0;
  const barcodeHeight = height - textHeight;

  let svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
  `;

  // 바코드 바 생성
  pattern.forEach((bar, index) => {
    if (bar === 1) {
      svgContent += `
        <rect x="${index * barWidth}" y="0" width="${barWidth}" height="${barcodeHeight}" fill="${barColor}"/>
      `;
    }
  });

  // 텍스트 추가
  if (showText) {
    svgContent += `
      <text x="${width / 2}" y="${height - 3}" 
            font-family="monospace" 
            font-size="10" 
            text-anchor="middle" 
            fill="${barColor}">
        ${text}
      </text>
    `;
  }

  svgContent += '</svg>';
  
  return svgContent;
}

/**
 * 텍스트를 바탕으로 바코드 패턴(0과 1의 배열)을 생성합니다.
 * @param data - 입력 텍스트
 * @returns 0(흰색)과 1(검은색)로 구성된 패턴 배열
 */
function generateBarcodePattern(data: string): number[] {
  // 간단한 해시 기반 패턴 생성
  let pattern: number[] = [1, 0, 1]; // 시작 패턴
  
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i);
    const binaryString = (charCode % 256).toString(2).padStart(8, '0');
    
    // 각 비트를 바코드 패턴으로 변환
    for (let bit of binaryString) {
      if (bit === '1') {
        pattern.push(1, 1, 0); // 두꺼운 검은 바
      } else {
        pattern.push(1, 0, 0); // 얇은 검은 바
      }
    }
    
    pattern.push(0); // 문자 간 구분
  }
  
  pattern.push(1, 0, 1); // 종료 패턴
  
  return pattern;
}

/**
 * 바코드 SVG를 Data URL로 변환합니다.
 * @param svgString - SVG 문자열
 * @returns Data URL 형태의 바코드 이미지
 */
export function barcodeToDataUrl(svgString: string): string {
  const encodedSvg = encodeURIComponent(svgString);
  return `data:image/svg+xml,${encodedSvg}`;
}

/**
 * React 컴포넌트에서 사용하기 쉽도록 바코드를 생성하고 Data URL을 반환합니다.
 * @param data - 바코드 데이터
 * @param options - 바코드 옵션
 * @returns Data URL 형태의 바코드
 */
export function createBarcodeDataUrl(data: string, options?: BarcodeOptions): string {
  const svg = generateBarcode(data, options);
  return barcodeToDataUrl(svg);
}