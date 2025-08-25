import { MainElement } from "@features/recovery-zone/ui";
import { useRecovery } from "@features/recovery-zone/context/RecoveryContext";

interface NoticeBarProps {
  className?: string;
}

const DEFAULT_MESSAGE = "복구완료된 주변 상권, 따뜻한 소비로 응원해보세요!";

const RECOVERY_MESSAGES: Record<string, string> = {
  복구완료: "복구완료되어 안심하고 방문하실 수 있는 상권이에요!",
  임시복구: "현재 통행은 가능하지만, 추후 공사가 재개될 수 있어요!",
  복구중: "복구 작업 중인 지역으로 안전에 유의해주세요!",
};

export const NoticeBar = ({ className = "" }: NoticeBarProps) => {
  let selectedStatus = "전체";
  try {
    selectedStatus = useRecovery().selectedRecoveryStatus ?? "전체";
  } catch {
    // RecoveryProvider가 없는 경우 기본 메시지 사용
  }

  const message = RECOVERY_MESSAGES[selectedStatus] ?? DEFAULT_MESSAGE;

  return (
    <MainElement.NoticeBar id="notice" className={className}>
      <span>NOTICE</span>
      <span>{message}</span>
    </MainElement.NoticeBar>
  );
};

