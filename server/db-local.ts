import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../shared/schema-sqlite";

// SQLite 데이터베이스 파일 생성
const sqlite = new Database("local.db");

// Drizzle ORM 인스턴스 생성
export const db = drizzle(sqlite, { schema });

// 테이블 생성 함수
export async function createTables() {
  try {
    // 테이블 생성 SQL
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS shortcuts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tool TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        windows_shortcut TEXT,
        macos_shortcut TEXT,
        linux_shortcut TEXT,
        popularity INTEGER DEFAULT 0,
        verified INTEGER DEFAULT 0,
        aliases TEXT,
        tags TEXT
      );

      CREATE TABLE IF NOT EXISTS favorite_shortcuts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcut_id INTEGER REFERENCES shortcuts(id),
        user_id TEXT NOT NULL,
        created_at TEXT DEFAULT 'now()'
      );

      CREATE TABLE IF NOT EXISTS shortcut_usage (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shortcut_id INTEGER REFERENCES shortcuts(id),
        usage_count INTEGER DEFAULT 0,
        last_used TEXT DEFAULT 'now()'
      );
    `);
    
    console.log("✅ SQLite 테이블이 성공적으로 생성되었습니다.");
  } catch (error) {
    console.error("❌ 테이블 생성 중 오류:", error);
  }
}
