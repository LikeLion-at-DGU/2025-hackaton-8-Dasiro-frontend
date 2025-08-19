import { MainElement } from "@features/recovery-zone/ui";

interface NoticeBarProps {
  message?: string;
  className?: string;
}

export const NoticeBar = ({
  message = "복구완료된 주변 상권, 따뜻한 소비로 응원해보세요!",
  className = ""
}: NoticeBarProps) => {
  return (
    <MainElement.NoticeBar id="notice" className={className}>
      <span>NOTICE</span>
      <span>{message}</span>
    </MainElement.NoticeBar>
  );
};