import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from 'url';
import { MemStorage } from "./storage";
import { registerRoutes } from "./routes";
import { createTables } from "./db-local";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 로깅 미들웨어
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

async function startServer() {
  try {
    // SQLite 테이블 생성
    await createTables();
    
    // 라우트 등록 (메모리 스토리지 사용)
    const storage = new MemStorage();
    await registerRoutes(app);

    // 정적 파일 서빙 (빌드된 클라이언트 파일)
    const clientDistPath = path.join(__dirname, '../client/dist');
    app.use(express.static(clientDistPath));

    // SPA 라우팅을 위한 폴백
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDistPath, 'index.html'));
      } else {
        res.status(404).json({ message: 'API route not found' });
      }
    });

    // 에러 핸들링
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error('Server Error:', err);
      res.status(status).json({ message });
    });

    app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행중입니다.`);
      console.log(`📱 클라이언트: http://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ 서버 시작 중 오류:', error);
    process.exit(1);
  }
}

startServer();
