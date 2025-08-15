import style from "styled-components";

export interface StatusBarProps {
  $backgroundColor?: string;
  $textColor?: string;
}

const Status = style.div<StatusBarProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: ${({ $backgroundColor }) => $backgroundColor || "#000"};
  color: ${({ $textColor }) => $textColor || "#fff"};
  font-size: 14px;
  font-weight: 600;
`;

const StatusBar = () => {
  return (
    <Status>
      <span>09:41</span>
      <div style={{ display: "flex", gap: "4px" }}>
        <span>📶</span>
        <span>🔋</span>
      </div>
    </Status>
  );
};

export default StatusBar;