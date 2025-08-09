import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as S from "./Footer.styled";
import sinkholeIcon from "@images/Footer/map.png";
import sinkholeActiveIcon from "@images/Footer/map-active.png";
import recoveryIcon from "@images/Footer/recovery.png";
import recoveryActiveIcon from "@images/Footer/recovery-active.png";
import routeIcon from "@images/Footer/safe.png";
import routeActiveIcon from "@images/Footer/safe-active.png";

type TabKey = "map" | "store" | "route";

const routeMap: Record<TabKey, string> = {
  map: "/sinkhole",
  store: "/",
  route: "/safeRoute",
};

const pathToTabKey: Partial<Record<string, TabKey>> = {
  "/sinkhole": "map",
  "/": "store",
  "/safeRoute": "route",
};

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<TabKey>("store");

  useEffect(() => {
    const matchedTab = pathToTabKey[location.pathname];
    if (matchedTab) setActiveTab(matchedTab);
  }, [location.pathname]);

  const tabs = [
    {
      key: "map",
      label: "싱크홀맵",
      icon: sinkholeIcon,
      activeIcon: sinkholeActiveIcon,
    },
    {
      key: "store",
      label: "회복상권",
      icon: recoveryIcon,
      activeIcon: recoveryActiveIcon,
    },
    {
      key: "route",
      label: "안전루트",
      icon: routeIcon,
      activeIcon: routeActiveIcon,
    },
  ];

  return (
    <S.Wrapper>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <S.NavItem
            key={tab.key}
            $active={isActive}
            onClick={() => {
              setActiveTab(tab.key as TabKey);
              navigate(routeMap[tab.key as TabKey]);
            }}
          >
            <img src={isActive ? tab.activeIcon : tab.icon} alt={tab.label} />
            <span>{tab.label}</span>
          </S.NavItem>
        );
      })}
    </S.Wrapper>
  );
};

export default Footer;
