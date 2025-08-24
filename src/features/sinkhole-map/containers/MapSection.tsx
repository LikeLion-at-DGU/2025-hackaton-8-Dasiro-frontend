import { SinkholeMapSection } from "./SinkholeMapSection";

interface MapSectionProps {
  colorMode?: "risk" | "recovery";
  forceViewMode?: "grade" | "safezone";
  id?: string;
}

export const MapSection = ({ forceViewMode, id }: MapSectionProps) => {
  return <SinkholeMapSection forceViewMode={forceViewMode} id={id} />;
};