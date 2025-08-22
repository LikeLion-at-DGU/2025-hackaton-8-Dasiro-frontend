import { PageHeader, NoticeBar } from "@shared/components";

export const RecoveryHeader = () => {
  return (
    <PageHeader
      showLocationSet
      locationSetText="위치 설정"
      noticeBar={<NoticeBar />}
    />
  );
};