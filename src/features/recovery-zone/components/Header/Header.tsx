import * as BasicElement from "../UI/BasicElement";

const Header = () => {
  return (
    <BasicElement.Header>
      <BasicElement.HeaderTitle>다시路</BasicElement.HeaderTitle>
      <BasicElement.LocationDropdown>
        위치 설정 ▼
      </BasicElement.LocationDropdown>
    </BasicElement.Header>
  );
};

export default Header;