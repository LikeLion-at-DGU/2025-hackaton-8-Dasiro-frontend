import { Outlet } from "react-router-dom";
import Footer from "src/widget/Footer/Footer";

import styled from "styled-components";

const DefaultLayout = () => {
  return (
    <OutletWrapper>
      <Outlet />
      <Footer />
    </OutletWrapper>
  );
};

export default DefaultLayout;

const OutletWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;
