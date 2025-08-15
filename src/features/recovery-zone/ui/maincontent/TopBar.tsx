import * as BasicElement from "@features/recovery-zone/types/BasicElement";
import Dasiro from "@shared/assets/Dasiro.svg";
import downarrow from "@shared/assets/icons/downarrow.svg";

const NoticeBar = () => {
  return (
    <BasicElement.Wrapper
      $padding={{ ver: 20, hoz: 15 }}
    ></BasicElement.Wrapper>
  );
};

const TopBar = () => {
  return (
    <BasicElement.Wrapper $ColumnDirection={true} $gap={20}>
      <BasicElement.DivFlex style={{ justifyContent: "space-between" }}>
        <img src={Dasiro} alt="logo" />
        <span>
          위치 설정 <img src={downarrow} alt="downarrow" />
        </span>
      </BasicElement.DivFlex>
    </BasicElement.Wrapper>
  );
};

export default TopBar;
