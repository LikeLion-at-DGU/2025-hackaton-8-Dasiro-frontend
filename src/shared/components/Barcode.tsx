import { useMemo } from "react";
import { createBarcodeDataUrl, type BarcodeOptions } from "@shared/utils/barcodeGenerator";

interface BarcodeProps extends BarcodeOptions {
  data: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * 바코드 컴포넌트
 * 주어진 데이터를 바탕으로 바코드 이미지를 생성하고 표시합니다.
 */
export const Barcode = ({ 
  data, 
  alt = "Barcode", 
  style = {},
  className = "",
  ...barcodeOptions 
}: BarcodeProps) => {
  const barcodeDataUrl = useMemo(() => {
    return createBarcodeDataUrl(data, barcodeOptions);
  }, [data, barcodeOptions]);

  return (
    <img 
      src={barcodeDataUrl} 
      alt={alt}
      style={style}
      className={className}
    />
  );
};