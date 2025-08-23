import style from "styled-components";
import * as BasicElement from "@shared/ui/BasicElement";
import whitemarker from "/images/icons/whitemarker.png";
import { Banner } from "@features/sinkhole-map/containers/Banner";
import { GradeInfo } from "./GradeInfo";
import { SafetyDescription } from "./SafetyDescription";
import { SafezoneInfo } from "./SafezoneInfo";

const StyledButton = style(BasicElement.Button)`
  ${({ theme }) => theme.fonts.bodySemiB14}
  color: ${({ theme }) => theme.colors.orange06};
  background-color: ${({ theme }) => theme.colors.orange01};
  img{
    width: 12.8px;
    height: 16px;
  }
`;

interface BottomSheetContentProps {
  selectedGrade?: number;
}

export const BottomSheetContent = ({ selectedGrade = 1 }: BottomSheetContentProps) => {
  return (
    <BasicElement.Container $gap={35} $columnDirection={true}>
      <Banner />
      <GradeInfo selectedGrade={selectedGrade} />
      <SafetyDescription selectedGrade={selectedGrade} />
      <SafezoneInfo />
      <StyledButton
        $width={"fit-content"}
        $gap={10}
        $padding={[6, 20]}
        $borderRadius={50}
      >
        <img src={whitemarker} alt="하얀색 핀" />
        지도보기
      </StyledButton>
    </BasicElement.Container>
  );
};

export default BottomSheetContent;
