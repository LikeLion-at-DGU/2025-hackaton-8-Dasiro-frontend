import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const FloatAction = () => {
  const navigate = useNavigate();
  const onFloatClick = () => navigate("/citizenIntro");

  return (
    <FloatImg
      src="/images/icons/mapFloating.png"
      role="button"
      onClick={onFloatClick}
    />
  );
};

export default FloatAction;

const FloatImg = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  position: absolute;
  bottom: 80px;
  right: 0;
  cursor: pointer;
  z-index: 40;
  pointer-events: auto;
`;
