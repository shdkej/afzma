# 아프지마 (afzma) - AI 의료 안내 서비스

이 서비스는 사용자의 증상을 입력받아 적절한 진료 과목을 안내하고, 근처의 추천 병원 목록을 제공하는 AI 기반 웹 어플리케이션입니다.

## 주요 기능

- **AI 증상 분석**: OpenAI 또는 Gemini를 사용하여 증상을 분석하고 진료 과목을 추천합니다.
- **히스토리 관리**: 이전 상담 내역을 저장하고 다시 확인할 수 있습니다.
- **병원 추천**: 증상에 따른 맞춤형 병원 정보를 제공합니다.
- **모바일 우선 디자인**: 다양한 기기에서 최적화된 UX를 제공하며, 부드러운 애니메이션과 스켈레톤 UI를 포함합니다.

## 기술 스택

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Vanilla CSS, Framer Motion
- **AI Integration**: OpenAI SDK, Google Generative AI SDK
- **Backend Architecture**: Layered Architecture (Controller -> Service -> DTO -> Repository -> Entity)

## 시작하기

1. **의존성 설치**:
   ```bash
   npm install
   ```

2. **환경 변수 설정**:
   `.env.local` 파일을 생성하고 아래 키를 입력하세요:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

## 백엔드 구조

- `backend/entity.ts`: 도메인 모델 정의
- `backend/dto.ts`: 데이터 전송 객체
- `backend/repository.ts`: 데이터 저장소 레이어 (현재 인메모리 방식)
- `backend/service.ts`: 비즈니스 로직 및 AI 추상화 레이어
- `backend/controller.ts`: API 요청 처리 레이어
