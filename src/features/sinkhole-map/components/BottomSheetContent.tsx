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

export const BottomSheetContent = () => {
  const handleMinimizeSheet = () => {
    if ((window as any).setBottomSheetHeight) {
      (window as any).setBottomSheetHeight(36);
    }
  };

  return (
    <BasicElement.Container $gap={35} $columnDirection={true}>
      <Banner />
      <GradeInfo />
      <SafetyDescription />
      <SafezoneInfo />
      <StyledButton
        $width={"fit-content"}
        $gap={10}
        $padding={[6, 20]}
        $borderRadius={50}
        onClick={handleMinimizeSheet}
      >
        <img src={whitemarker} alt="하얀색 핀" />
        지도보기
      </StyledButton>
    </BasicElement.Container>
  );
};

export default BottomSheetContent;
