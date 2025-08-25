# 다시로 (Dasiro) 🗺️

> **서울 싱크홀 안전 지도 서비스**  
> 싱크홀 위험 지역 정보와 안전 경로를 제공하는 시민 안전 플랫폼

## 📋 서비스 개요

다시로는 서울시의 싱크홀 위험도 정보를 시각화하여 시민들에게 안전한 이동 경로를 제공하는 웹 서비스입니다. 

**주요 목표:**
- 싱크홀 위험 지역 실시간 정보 제공
- 안전 경로 안내 및 대피소 위치 안내
- 시민 제보 시스템을 통한 상황 공유
- 복구 상권 현황 안내로 지역 경제 활성화 지원

## 🛠️ 주요 기술 스택

### Frontend
- **React** - 사용자 인터페이스 구축
- **TypeScript** - 타입 안전성 보장
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **React Router DOM** - 클라이언트 사이드 라우팅
- **Styled Components** - CSS-in-JS 스타일링

### 지도 & 시각화
- **Kakao Maps SDK** - 지도 기반 서비스
- **D3.js** - 데이터 시각화 및 서울 구역 렌더링

### 기타
- **Axios** - HTTP 클라이언트
- **ESLint** - 코드 품질 관리

## 🚀 주요 기능

### 1. 싱크홀 위험도 지도 📍
- 서울시 구별 싱크홀 위험도 시각화
- 5단계 등급별 색상 표시
- 동 단위 상세 검색 기능
- 안전지역 필터링

### 2. 안전 경로 안내 🛤️
- 출발지-목적지 간 안전 경로 제공
- 대중교통/도보 경로 옵션
- 실시간 거리 및 소요시간 계산

### 3. 복구 상권 현황 🏪
- 싱크홀 피해 지역 상권 복구 현황
- 업종별 필터링 (음식점, 카페, 편의점 등)
- 쿠폰 및 혜택 정보 제공

### 4. 시민 제보 시스템 📢
- 실시간 위험 상황 제보
- 사진 첨부 및 위치 정보 공유
- AI 기반 상황 분석

## 🏗️ 구현 방법

### 아키텍처 설계
```
src/
├── app/                    # 라우터 설정
├── entities/               # 도메인 모델 및 API
│   ├── sinkhole/          # 싱크홀 관련 데이터
│   ├── recovery/          # 복구 상권 데이터
│   └── report/            # 시민 제보 데이터
├── features/              # 기능별 컴포넌트
│   ├── sinkhole-map/      # 싱크홀 지도 기능
│   ├── safe-route/        # 안전 경로 기능
│   ├── recovery-zone/     # 복구 상권 기능
│   └── citizen-report/    # 시민 제보 기능
├── shared/                # 공통 컴포넌트 및 유틸
├── pages/                 # 페이지 컴포넌트
└── widget/                # 독립적인 위젯
```

### 주요 구현 특징
- **Feature-Sliced Design** 아키텍처 적용
- **Context API**를 통한 상태 관리
- **카카오 지도 API** 통합
- **D3.js**를 활용한 서울시 구역 시각화
- **반응형 디자인** 및 모바일 최적화

## 💻 로컬 실행 방법

### 1. 저장소 클론
```bash
git clone https://github.com/LikeLion-at-DGU/DasiroFront.git
cd DasiroFront
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
# .env.local 파일 생성 후 다음 값들 설정
VITE_KAKAO_MAP_API_KEY=your_kakao_map_api_key
VITE_API_BASE_URL=your_api_base_url
```

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 접속

### 5. 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 코드 검사
npm run lint
```

## 🌟 페이지 구성

- `/` - 복구 상권 현황 (메인 페이지)
- `/sinkhole` - 싱크홀 위험도 지도
- `/safeRoute` - 안전 경로 안내
- `/citizenIntro` - 시민 제보 소개
- `/citizenInfo` - 시민 제보 정보 입력
- `/citizenReport` - 시민 제보 작성
- `/onboarding` - 서비스 온보딩