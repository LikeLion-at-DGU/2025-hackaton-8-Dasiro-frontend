import * as BasicElement from "@features/recovery-zone/types/BasicElement";
import { useNavigate } from "react-router-dom";

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
      
      {/* Header */}
      <BasicElement.Header>
        <BasicElement.HeaderTitle>다시路</BasicElement.HeaderTitle>
        <BasicElement.LocationDropdown>
          위치 설정 ▼
        </BasicElement.LocationDropdown>
      </BasicElement.Header>

      {/* Notice Banner */}
      <BasicElement.Card
        $backgroundColor="#FFE5B4"
        $padding={12}
        $margin={{ ver: 8, hoz: 20 }}
        $borderRadius={8}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{ fontSize: "12px", fontWeight: "600", color: "#FF6B6B" }}
          >
            NOTICE
          </span>
          <span style={{ fontSize: "12px", color: "#666" }}>
            북구맨홀 주변 상하, 마무 위치 소비자용 유형헤태나!
          </span>
        </div>
      </BasicElement.Card>

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
        {/* Bunjiro Card */}
        <BasicElement.Card $margin={{ ver: 8, hoz: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23DDD'/%3E%3C/svg%3E"
              alt="bunjiro"
              style={{ width: "60px", height: "60px", borderRadius: "8px" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "16px", fontWeight: "600" }}>
                  분지로 성수점
                </span>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#FF6B6B",
                    borderRadius: "50%",
                    color: "white",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  3
                </div>
              </div>
              <p
                style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}
              >
                서울 성동구 광나루로4길 13 B1
              </p>
            </div>
            <span style={{ fontSize: "12px", color: "#FF6B6B" }}>구문</span>
          </div>
        </BasicElement.Card>

        {/* Content Mater Card */}
        <BasicElement.Card $margin={{ ver: 8, hoz: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23DDD'/%3E%3C/svg%3E"
              alt="content mater"
              style={{ width: "60px", height: "60px", borderRadius: "8px" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ fontSize: "16px", fontWeight: "600" }}>
                  콘텐마터
                </span>
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "#FF6B6B",
                    borderRadius: "50%",
                    color: "white",
                    fontSize: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  3
                </div>
              </div>
              <p
                style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}
              >
                서울 중구 수표로 30 OK빌딩 3층
              </p>
            </div>
            <span style={{ fontSize: "12px", color: "#FF6B6B" }}>구문</span>
          </div>
        </BasicElement.Card>
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
