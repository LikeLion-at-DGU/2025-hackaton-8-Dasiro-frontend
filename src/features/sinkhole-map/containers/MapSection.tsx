import { MapSection as RecoveryMapSection } from "@features/recovery-zone";

interface SinkholeMapSectionProps {
  colorMode?: "risk" | "recovery";
}

export const MapSection = ({ colorMode = "risk" }: SinkholeMapSectionProps) => {
  return <RecoveryMapSection colorMode={colorMode} />;
};