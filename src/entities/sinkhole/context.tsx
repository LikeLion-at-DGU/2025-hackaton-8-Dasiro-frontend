import { createContext, useContext, useState, type ReactNode } from "react";
import type { SelectGradeData } from "./selectgrade";
import type { SafezoneData } from "./safezones";

interface SelectGradeContextType {
  selectedGradeData: SelectGradeData | null;
  setSelectedGradeData: (data: SelectGradeData | null) => void;
  safezoneData: SafezoneData | null;
  setSafezoneData: (data: SafezoneData | null) => void;
  viewMode: "grade" | "safezone";
  setViewMode: (mode: "grade" | "safezone") => void;
}

const SelectGradeContext = createContext<SelectGradeContextType | undefined>(undefined);

interface SelectGradeProviderProps {
  children: ReactNode;
}

export const SelectGradeProvider = ({ children }: SelectGradeProviderProps) => {
  const [selectedGradeData, setSelectedGradeData] = useState<SelectGradeData | null>(null);
  const [safezoneData, setSafezoneData] = useState<SafezoneData | null>(null);
  const [viewMode, setViewMode] = useState<"grade" | "safezone">("grade");

  return (
    <SelectGradeContext.Provider value={{ 
      selectedGradeData, 
      setSelectedGradeData,
      safezoneData,
      setSafezoneData,
      viewMode,
      setViewMode
    }}>
      {children}
    </SelectGradeContext.Provider>
  );
};

export const useSelectGrade = () => {
  const context = useContext(SelectGradeContext);
  if (context === undefined) {
    throw new Error("useSelectGrade must be used within a SelectGradeProvider");
  }
  return context;
};