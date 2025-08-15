export interface CardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  address: string;
  count: number;
  status: string;
}

// Notice Card Props (different structure for notice banner)
export interface NoticeCardProps {
  title: string;
  message: string;
}

export const NoticeCardData: NoticeCardProps = {
  title: "NOTICE",
  message: "복구완료된 주변 상권, 따뜻한 소비로 응원해보세요!"
};

// Content Card Props Objects
export const ContentCardProps = {
  bunjiro: {
    imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23DDD'/%3E%3C/svg%3E",
    imageAlt: "bunjiro",
    title: "분지로 성수점",
    address: "서울 성동구 광나루로4길 13 B1",
    count: 3,
    status: "구문"
  } as CardProps,
  
  contentMatter: {
    imageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23DDD'/%3E%3C/svg%3E",
    imageAlt: "content mater",
    title: "콘텐마터",
    address: "서울 중구 수표로 30 OK빌딩 3층",
    count: 3,
    status: "구문"
  } as CardProps
};