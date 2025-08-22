import { createContext, useContext, useState, type ReactNode } from "react";
import type { SelectGradeData } from "./selectgrade";

interface SelectGradeContextType {
  selectedGradeData: SelectGradeData | null;
  setSelectedGradeData: (data: SelectGradeData | null) => void;
}

const SelectGradeContext = createContext<SelectGradeContextType | undefined>(undefined);

interface SelectGradeProviderProps {
  children: ReactNode;
}

export const SelectGradeProvider = ({ children }: SelectGradeProviderProps) => {
  const [selectedGradeData, setSelectedGradeData] = useState<SelectGradeData | null>(null);

  return (
    <SelectGradeContext.Provider value={{ selectedGradeData, setSelectedGradeData }}>
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