import * as BasicElement from "../../components/UI/BasicElement";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import NoticeCard from "../../components/Card/NoticeCard";
import { NoticeCardData, ContentCardProps } from "../../components/Card/types";

const MainContent = () => {
  const navigate = useNavigate();
  const onFloatClick = () => navigate("/report");
  return (
    <div
      style={{
        width: "375px",
        height: "812px",
        backgroundColor: "#F5F5F5",
        position: "relative",
        margin: "0 auto",
      }}
    >
      
      <Header />

      {/* Notice Banner */}
      <NoticeCard {...NoticeCardData} />

      {/* Map Container */}
      <BasicElement.MapContainer $height={280}>
        <div
          style={{
            width: "200px",
            height: "180px",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 180'%3E%3Cpath d='M50 50h30v20h-30z' fill='%23FFB3BA'/%3E%3Cpath d='M80 45h25v30h-25z' fill='%23FFDFBA'/%3E%3Cpath d='M45 70h35v25h-35z' fill='%23FFFFBA'/%3E%3Cpath d='M100 60h40v35h-40z' fill='%23BAFFC9'/%3E%3Cpath d='M60 95h30v20h-30z' fill='%23BAE1FF'/%3E%3C/svg%3E")`,
            backgroundSize: "cover",
            position: "relative",
          }}
        >
          {/* Gray line across map */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "10%",
              right: "10%",
              height: "2px",
              backgroundColor: "#999",
              transform: "rotate(-10deg)",
            }}
          />
        </div>
      </BasicElement.MapContainer>

      {/* Map Legend */}
      <BasicElement.Legend>
        <BasicElement.LegendItem>
          <BasicElement.LegendDot $color="#FF6B6B" />
          <span>위험</span>
        </BasicElement.LegendItem>
        <BasicElement.LegendItem>
          <BasicElement.LegendDot $color="#FFB347" />
          <span>일시적</span>
        </BasicElement.LegendItem>
        <BasicElement.LegendItem>
          <BasicElement.LegendDot $color="#87CEEB" />
          <span>복구완료</span>
        </BasicElement.LegendItem>
      </BasicElement.Legend>

      {/* Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          padding: "16px 20px",
          justifyContent: "flex-start",
        }}
      >
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#F0F0F0",
            border: "none",
            borderRadius: "20px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          복구 현황
        </button>
        <button
          style={{
            padding: "8px 16px",
            backgroundColor: "#F0F0F0",
            border: "none",
            borderRadius: "20px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          업점
        </button>
      </div>

      {/* Content Cards */}
      <div style={{ padding: "0 20px", marginBottom: "100px" }}>
        <Card {...ContentCardProps.bunjiro} />
        <Card {...ContentCardProps.contentMatter} />
      </div>
      <BasicElement.FloatImg
        src="/images/icons/mapFloating.png"
        role="button"
        onClick={onFloatClick}
      />
    </div>
  );
};

export default MainContent;
