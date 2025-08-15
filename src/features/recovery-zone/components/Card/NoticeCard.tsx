import * as BasicElement from "../UI/BasicElement";

interface NoticeCardProps {
  title: string;
  message: string;
}

const NoticeCard = ({ title, message }: NoticeCardProps) => {
  return (
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
          {title}
        </span>
        <span style={{ fontSize: "12px", color: "#666" }}>
          {message}
        </span>
      </div>
    </BasicElement.Card>
  );
};

export default NoticeCard;