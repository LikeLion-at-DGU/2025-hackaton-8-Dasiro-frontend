import * as BasicElement from "../UI/BasicElement";
import type { CardProps } from "./types";

const Card = ({
  imageSrc,
  imageAlt,
  title,
  address,
  count,
  status,
}: CardProps) => {
  return (
    <BasicElement.Card $margin={{ ver: 8, hoz: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={imageSrc}
          alt={imageAlt}
          style={{ width: "60px", height: "60px", borderRadius: "8px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px", fontWeight: "600" }}>{title}</span>
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
              {count}
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>
            {address}
          </p>
        </div>
        <span style={{ fontSize: "12px", color: "#FF6B6B" }}>{status}</span>
      </div>
    </BasicElement.Card>
  );
};

export default Card;
