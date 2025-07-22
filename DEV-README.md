# ShortcutHub 로컬 개발 가이드

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
# 루트 디렉토리에서 서버 의존성 설치
npm install

# 클라이언트 의존성 설치
cd client
npm install
cd ..
```

### 2. 개발 서버 실행

#### 방법 1: 자동 스크립트 실행 (권장)
```bash
# Windows PowerShell
.\start-dev.ps1

# 또는 Command Prompt
start-dev.bat
```

#### 방법 2: 수동으로 각각 실행
```bash
# 터미널 1: API 서버 (포트 3000)
npm run dev:local

# 터미널 2: 클라이언트 개발 서버 (포트 5173)
npm run client:dev
```

## 📱 접속 주소

- **클라이언트 (개발)**: http://localhost:5174
- **API 서버**: http://localhost:3000
- **프로덕션 빌드**: http://localhost:3000 (빌드 후)

## 🛠️ 주요 명령어

### 개발
```bash
npm run dev:local           # 로컬 API 서버 실행 (SQLite 사용)
npm run client:dev          # 클라이언트 개발 서버 실행
```

### 빌드
```bash
npm run client:build        # 클라이언트만 빌드
npm run build:local         # 전체 로컬 빌드
```

### 실행
```bash
npm run start:local         # 빌드된 로컬 서버 실행
```

### 데이터베이스
```bash
npm run db:push:local       # SQLite 스키마 푸시
```

## 📁 로컬 개발 파일 구조

```
c:\web\ShortcutHub\
├── server/
│   ├── index-local.ts      # 로컬 개발용 서버
│   └── db-local.ts         # SQLite 연결 설정
├── shared/
│   └── schema-sqlite.ts    # SQLite용 스키마
├── client/                 # 프론트엔드
├── local.db               # SQLite 데이터베이스 파일
├── .env                   # 환경 변수
├── start-dev.ps1          # PowerShell 개발 스크립트
└── start-dev.bat          # Batch 개발 스크립트
```

## 🗄️ 데이터베이스

로컬 개발에서는 SQLite를 사용합니다:
- 데이터베이스 파일: `local.db`
- 자동으로 테이블이 생성됩니다
- 메모리 기반 스토리지로 초기 데이터가 포함됩니다

## 🔧 개발 환경 설정

### 환경 변수 (.env)
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=./local.db
SESSION_SECRET=your-session-secret-key-here
```

### VS Code 설정 (권장)
```json
{
  "eslint.workingDirectories": ["client"],
  "typescript.preferences.includePackageJsonAutoImports": "auto"
}
```

## 🚀 배포 준비

### Netlify 배포 전 체크리스트
1. ✅ 로컬에서 정상 작동 확인
2. ✅ 클라이언트 빌드 테스트: `npm run client:build`
3. ✅ API 엔드포인트 테스트
4. ✅ 환경 변수 설정 확인

### 배포용 빌드
```bash
# 클라이언트 빌드 (Netlify용)
npm run client:build

# 전체 빌드 (서버 포함)
npm run build:local
```

## 🐛 문제 해결

### 포트 충돌
- API 서버: `PORT=3000` 환경 변수로 변경
- 클라이언트: `client/vite.config.ts`에서 포트 변경

### 권한 오류 (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### SQLite 오류
1. `local.db` 파일 삭제
2. 서버 재시작으로 자동 재생성

## 📝 개발 팁

1. **핫 리로드**: 클라이언트는 자동 리로드, 서버는 tsx로 자동 재시작
2. **API 테스트**: http://localhost:3000/api/shortcuts
3. **브라우저 개발자 도구**: Network 탭에서 API 요청 확인
4. **로그 확인**: 서버 터미널에서 API 요청 로그 확인

## 🎯 다음 단계

로컬에서 테스트가 완료되면:
1. GitHub에 푸시
2. Netlify 연동
3. 환경 변수 설정 (프로덕션 데이터베이스)
4. 배포 테스트
