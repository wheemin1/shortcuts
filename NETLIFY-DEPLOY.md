# Netlify 배포 가이드

## 🚀 Netlify 배포 설정

### 1. GitHub 연동
1. [Netlify](https://netlify.com)에 로그인
2. "New site from Git" 클릭
3. GitHub 선택 후 `wheemin1/shortcuts` 저장소 선택

### 2. 빌드 설정
```
Build command: npm run client:build
Publish directory: client/dist
```

### 3. 환경 변수 설정
Netlify 대시보드 > Site settings > Environment variables에서 다음 변수들을 추가:

```env
# 데이터베이스 (NeonDB 또는 다른 PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# 세션 시크릿
SESSION_SECRET=your-super-secret-session-key-here

# Node 환경
NODE_ENV=production
```

### 4. Functions 설정 (자동 처리됨)
- `netlify/functions/index.js`가 API 서버 역할
- `/api/*` 경로는 자동으로 Functions로 라우팅됨

### 5. 데이터베이스 설정 (NeonDB 권장)

#### NeonDB 설정:
1. [NeonDB](https://neon.tech) 가입
2. 새 프로젝트 생성
3. 연결 문자열 복사
4. Netlify 환경 변수에 `DATABASE_URL` 추가

예시:
```
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 6. 배포 후 확인사항
- [ ] 클라이언트 정상 로딩
- [ ] API 엔드포인트 작동 (`/api/shortcuts`)
- [ ] 단축키 데이터 정상 표시
- [ ] 검색 기능 작동
- [ ] 즐겨찾기 기능 작동

### 7. 도메인 설정 (선택사항)
- Netlify 제공 도메인: `your-site-name.netlify.app`
- 커스텀 도메인 연결 가능

## 🔧 트러블슈팅

### 빌드 에러 시:
1. 로컬에서 `npm run client:build` 테스트
2. `package.json` 의존성 확인
3. Node.js 버전 확인 (18.x 권장)

### API 에러 시:
1. 환경 변수 `DATABASE_URL` 확인
2. Functions 로그 확인
3. CORS 설정 확인

### 스타일 깨짐 시:
1. Tailwind CSS 빌드 확인
2. PostCSS 설정 확인
3. 브라우저 캐시 삭제

## 📱 배포 완료 후
배포가 완료되면 다음 주소에서 확인 가능:
- `https://your-site-name.netlify.app`

성공적인 배포를 위해 위 단계들을 순서대로 진행하세요!
