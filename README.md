# 단축키모아 - Korean Shortcut Collection

한국어 단축키 수집 웹사이트입니다. 600개 이상의 검증된 단축키를 제공합니다.

## 🚀 기능

- **시각적 키캡 디자인**: 실제 키보드 키처럼 보이는 아름다운 키캡 스타일
- **OS별 배지**: Windows, macOS, Linux 전용 브랜드 색상 배지
- **다크 모드**: 기본 다크 모드로 향상된 시각적 경험
- **스마트 검색**: 한국어-영어 매칭으로 향상된 검색 기능
- **즐겨찾기**: 로컬 스토리지 기반 즐겨찾기 시스템
- **인기 단축키**: 사용량 기반 인기 단축키 표시

## 📱 지원 도구

- **운영체제**: Windows 11, macOS, Linux
- **개발도구**: Visual Studio Code, 터미널, Git
- **오피스**: Microsoft Excel, Word, PowerPoint
- **브라우저**: Chrome, Firefox, Safari
- **디자인**: Photoshop, Figma, Sketch
- **커뮤니케이션**: Slack, Discord, Zoom
- **생산성**: Notion, Spotify

## 🛠️ 기술 스택

- **프론트엔드**: React 18 + TypeScript
- **스타일링**: Tailwind CSS + shadcn/ui
- **빌드**: Vite
- **배포**: Netlify
- **데이터**: 600+ 공식 문서 검증 단축키

## 🌐 배포

이 프로젝트는 Netlify로 배포되며, 정적 사이트로 작동합니다. 단축키 데이터는 Netlify Functions를 통해 제공됩니다.

### 로컬 개발

```bash
# 클라이언트 개발 모드
cd client
npm install
npm run dev

# Netlify Functions 개발 모드
netlify dev
```

### API 엔드포인트

- `GET /api/shortcuts` - 모든 단축키 목록
- `GET /api/shortcuts/popular` - 인기 단축키 목록
- `GET /api/shortcuts/search?q=검색어` - 단축키 검색
- `GET /api/shortcuts/category/:category` - 카테고리별 단축키
- `GET /api/shortcuts/tool/:tool` - 도구별 단축키
- `GET /api/shortcuts/:id` - ID로 단축키 조회
- `GET /api/tools` - 지원하는 도구 목록
- `GET /api/categories` - 지원하는 카테고리 목록
- `GET /api/health` - API 상태 확인

### 빌드

```bash
npm run build
```

빌드된 파일은 `dist/public` 폴더에 생성됩니다.

## 📝 데이터 소스

모든 단축키는 공식 문서에서 검증되었습니다:
- Microsoft 공식 문서
- Adobe 공식 문서  
- Google 공식 문서
- Mozilla 공식 문서
- Apple 공식 문서

## 🤝 기여

새로운 단축키나 개선 사항은 언제든지 환영합니다!

---

© 2025 단축키모아 - 모든 단축키가 한 곳에