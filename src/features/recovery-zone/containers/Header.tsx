import { MainElement } from "../ui";
import logo from "@shared/assets/logo.png";
import downarrow from "@shared/assets/icons/downarrow.png";

export const Header = () => {
  return (
    <MainElement.TopWrapper>
      <MainElement.TopBar>
        <img
          src={logo}
          alt="로고"
          style={{ width: "60px", height: "27.961px" }}
        />
        <MainElement.LocationSet>
          위치 설정{" "}
          <img
            src={downarrow}
            alt="화살표"
            style={{ width: "17px", height: "17px" }}
          />
        </MainElement.LocationSet>
      </MainElement.TopBar>
      <MainElement.NoticeBar id="notice">
        <span>NOTICE</span>
        <span>복구완료된 주변 상권, 따뜻한 소비로 응원해보세요!</span>
      </MainElement.NoticeBar>
    </MainElement.TopWrapper>
  );
};