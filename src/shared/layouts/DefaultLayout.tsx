import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";
import Footer from "@widget/Footer/Footer";
import StatusBar from "@widget/StatusBar/StatusBar"

type LayoutContext = {
  setFooterHidden: (v: boolean) => void;
};

const DefaultLayout = () => {
  const [footerHidden, setFooterHidden] = useState(false);

  return (
    <OutletWrapper>
      <StatusBar />
      <Outlet context={{ setFooterHidden } satisfies LayoutContext} />
      {!footerHidden && <Footer />}
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
