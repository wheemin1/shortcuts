import { shortcuts, favoriteShortcuts, shortcutUsage, type Shortcut, type InsertShortcut, type FavoriteShortcut, type InsertFavoriteShortcut, type ShortcutUsage, type InsertShortcutUsage } from "@shared/schema";

export interface IStorage {
  // Shortcuts
  getShortcuts(): Promise<Shortcut[]>;
  getShortcutsByCategory(category: string): Promise<Shortcut[]>;
  getShortcutsByTool(tool: string): Promise<Shortcut[]>;
  getShortcut(id: number): Promise<Shortcut | undefined>;
  createShortcut(shortcut: InsertShortcut): Promise<Shortcut>;
  updateShortcut(id: number, shortcut: Partial<InsertShortcut>): Promise<Shortcut | undefined>;
  deleteShortcut(id: number): Promise<boolean>;
  searchShortcuts(query: string): Promise<Shortcut[]>;
  getPopularShortcuts(limit: number): Promise<Shortcut[]>;
  
  // Favorites
  getFavoriteShortcuts(userId: string): Promise<FavoriteShortcut[]>;
  addFavoriteShortcut(favorite: InsertFavoriteShortcut): Promise<FavoriteShortcut>;
  removeFavoriteShortcut(shortcutId: number, userId: string): Promise<boolean>;
  
  // Usage tracking
  incrementShortcutUsage(shortcutId: number): Promise<void>;
  getShortcutUsage(shortcutId: number): Promise<ShortcutUsage | undefined>;
}

export class MemStorage implements IStorage {
  private shortcuts: Map<number, Shortcut>;
  private favoriteShortcuts: Map<string, FavoriteShortcut[]>;
  private shortcutUsage: Map<number, ShortcutUsage>;
  private currentShortcutId: number;
  private currentFavoriteId: number;
  private currentUsageId: number;

  constructor() {
    this.shortcuts = new Map();
    this.favoriteShortcuts = new Map();
    this.shortcutUsage = new Map();
    this.currentShortcutId = 1;
    this.currentFavoriteId = 1;
    this.currentUsageId = 1;
    this.initializeShortcuts();
  }

  private initializeShortcuts() {
    // Initialize with comprehensive shortcuts data
    const initialShortcuts: Omit<Shortcut, 'id'>[] = [
      // Windows OS
      {
        tool: "Windows",
        category: "os",
        title: "복사",
        description: "선택한 항목을 클립보드에 복사",
        windowsShortcut: "Ctrl+C",
        macosShortcut: "Cmd+C",
        linuxShortcut: "Ctrl+C",
        popularity: 100,
        verified: true,
        aliases: ["copy", "복사하기"],
        tags: ["clipboard", "basic"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "붙여넣기",
        description: "클립보드의 내용을 붙여넣기",
        windowsShortcut: "Ctrl+V",
        macosShortcut: "Cmd+V",
        linuxShortcut: "Ctrl+V",
        popularity: 95,
        verified: true,
        aliases: ["paste", "붙여넣기"],
        tags: ["clipboard", "basic"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "작업 관리자",
        description: "작업 관리자 열기",
        windowsShortcut: "Ctrl+Shift+Esc",
        macosShortcut: "Cmd+Option+Esc",
        linuxShortcut: "Ctrl+Alt+Del",
        popularity: 85,
        verified: true,
        aliases: ["task manager", "작업관리자"],
        tags: ["system", "management"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "스크린샷",
        description: "부분 스크린샷 캡처",
        windowsShortcut: "Win+Shift+S",
        macosShortcut: "Cmd+Shift+4",
        linuxShortcut: "Shift+PrtSc",
        popularity: 80,
        verified: true,
        aliases: ["screenshot", "캡처"],
        tags: ["capture", "screen"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "잠금 화면",
        description: "컴퓨터 잠금",
        windowsShortcut: "Win+L",
        macosShortcut: "Cmd+Ctrl+Q",
        linuxShortcut: "Ctrl+Alt+L",
        popularity: 75,
        verified: true,
        aliases: ["lock", "잠금"],
        tags: ["security", "lock"]
      },
      
      // VSCode
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "명령 팔레트",
        description: "모든 명령에 빠르게 액세스",
        windowsShortcut: "Ctrl+Shift+P",
        macosShortcut: "Cmd+Shift+P",
        linuxShortcut: "Ctrl+Shift+P",
        popularity: 90,
        verified: true,
        aliases: ["command palette", "명령어"],
        tags: ["navigation", "command"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "빠른 열기",
        description: "파일 또는 기호로 이동",
        windowsShortcut: "Ctrl+P",
        macosShortcut: "Cmd+P",
        linuxShortcut: "Ctrl+P",
        popularity: 85,
        verified: true,
        aliases: ["quick open", "파일열기"],
        tags: ["navigation", "file"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "다중 커서",
        description: "다음 일치 항목 선택",
        windowsShortcut: "Ctrl+D",
        macosShortcut: "Cmd+D",
        linuxShortcut: "Ctrl+D",
        popularity: 80,
        verified: true,
        aliases: ["multi cursor", "다중선택"],
        tags: ["editing", "selection"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "터미널 토글",
        description: "통합 터미널 보기/숨기기",
        windowsShortcut: "Ctrl+`",
        macosShortcut: "Cmd+`",
        linuxShortcut: "Ctrl+`",
        popularity: 75,
        verified: true,
        aliases: ["terminal", "터미널"],
        tags: ["terminal", "toggle"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "사이드바 토글",
        description: "사이드바 보기/숨기기",
        windowsShortcut: "Ctrl+B",
        macosShortcut: "Cmd+B",
        linuxShortcut: "Ctrl+B",
        popularity: 70,
        verified: true,
        aliases: ["sidebar", "사이드바"],
        tags: ["view", "sidebar"]
      },
      
      // Excel
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "자동 합계",
        description: "선택한 셀의 합계 자동 계산",
        windowsShortcut: "Alt+=",
        macosShortcut: "Cmd+=",
        linuxShortcut: "Alt+=",
        popularity: 90,
        verified: true,
        aliases: ["autosum", "합계"],
        tags: ["formula", "calculation"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "셀 서식",
        description: "셀 서식 대화상자 열기",
        windowsShortcut: "Ctrl+1",
        macosShortcut: "Cmd+1",
        linuxShortcut: "Ctrl+1",
        popularity: 85,
        verified: true,
        aliases: ["format cells", "서식"],
        tags: ["formatting", "cells"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "필터",
        description: "자동 필터 토글",
        windowsShortcut: "Ctrl+Shift+L",
        macosShortcut: "Cmd+Shift+L",
        linuxShortcut: "Ctrl+Shift+L",
        popularity: 80,
        verified: true,
        aliases: ["filter", "필터링"],
        tags: ["data", "filter"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "행 삽입",
        description: "새 행 삽입",
        windowsShortcut: "Ctrl+Shift++",
        macosShortcut: "Cmd+Shift++",
        linuxShortcut: "Ctrl+Shift++",
        popularity: 75,
        verified: true,
        aliases: ["insert row", "행추가"],
        tags: ["editing", "row"]
      },
      
      // Photoshop
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "브러시 도구",
        description: "브러시 도구 선택",
        windowsShortcut: "B",
        macosShortcut: "B",
        linuxShortcut: "B",
        popularity: 85,
        verified: true,
        aliases: ["brush tool", "브러시"],
        tags: ["tool", "brush"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "변형",
        description: "자유 변형 모드",
        windowsShortcut: "Ctrl+T",
        macosShortcut: "Cmd+T",
        linuxShortcut: "Ctrl+T",
        popularity: 80,
        verified: true,
        aliases: ["transform", "변형"],
        tags: ["transform", "editing"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "새 레이어",
        description: "새 레이어 만들기",
        windowsShortcut: "Ctrl+Shift+N",
        macosShortcut: "Cmd+Shift+N",
        linuxShortcut: "Ctrl+Shift+N",
        popularity: 75,
        verified: true,
        aliases: ["new layer", "레이어"],
        tags: ["layer", "new"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "레이어 복제",
        description: "현재 레이어 복제",
        windowsShortcut: "Ctrl+J",
        macosShortcut: "Cmd+J",
        linuxShortcut: "Ctrl+J",
        popularity: 70,
        verified: true,
        aliases: ["duplicate layer", "복제"],
        tags: ["layer", "duplicate"]
      },
      
      // Chrome
      {
        tool: "Google Chrome",
        category: "browser",
        title: "새 탭",
        description: "새 탭 열기",
        windowsShortcut: "Ctrl+T",
        macosShortcut: "Cmd+T",
        linuxShortcut: "Ctrl+T",
        popularity: 95,
        verified: true,
        aliases: ["new tab", "새탭"],
        tags: ["navigation", "tab"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "탭 닫기",
        description: "현재 탭 닫기",
        windowsShortcut: "Ctrl+W",
        macosShortcut: "Cmd+W",
        linuxShortcut: "Ctrl+W",
        popularity: 90,
        verified: true,
        aliases: ["close tab", "탭닫기"],
        tags: ["navigation", "tab"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "새로고침",
        description: "페이지 새로고침",
        windowsShortcut: "Ctrl+R",
        macosShortcut: "Cmd+R",
        linuxShortcut: "Ctrl+R",
        popularity: 85,
        verified: true,
        aliases: ["refresh", "새로고침"],
        tags: ["navigation", "refresh"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "개발자 도구",
        description: "개발자 도구 열기",
        windowsShortcut: "F12",
        macosShortcut: "Cmd+Option+I",
        linuxShortcut: "F12",
        popularity: 80,
        verified: true,
        aliases: ["developer tools", "개발자도구"],
        tags: ["development", "tools"]
      },
      
      // PyCharm
      {
        tool: "PyCharm",
        category: "ide",
        title: "코드 실행",
        description: "현재 파일 실행",
        windowsShortcut: "Shift+F10",
        macosShortcut: "Ctrl+R",
        linuxShortcut: "Shift+F10",
        popularity: 90,
        verified: true,
        aliases: ["run code", "실행"],
        tags: ["execution", "run"]
      },
      {
        tool: "PyCharm",
        category: "ide",
        title: "디버그",
        description: "디버그 모드로 실행",
        windowsShortcut: "Shift+F9",
        macosShortcut: "Ctrl+D",
        linuxShortcut: "Shift+F9",
        popularity: 85,
        verified: true,
        aliases: ["debug", "디버깅"],
        tags: ["debugging", "debug"]
      },
      {
        tool: "PyCharm",
        category: "ide",
        title: "리팩토링",
        description: "리팩토링 메뉴 열기",
        windowsShortcut: "Ctrl+Alt+Shift+T",
        macosShortcut: "Ctrl+T",
        linuxShortcut: "Ctrl+Alt+Shift+T",
        popularity: 75,
        verified: true,
        aliases: ["refactor", "리팩토링"],
        tags: ["refactoring", "code"]
      },
      
      // Jupyter
      {
        tool: "Jupyter Notebook",
        category: "ide",
        title: "셀 실행",
        description: "셀 실행 후 다음 셀로 이동",
        windowsShortcut: "Shift+Enter",
        macosShortcut: "Shift+Enter",
        linuxShortcut: "Shift+Enter",
        popularity: 95,
        verified: true,
        aliases: ["run cell", "셀실행"],
        tags: ["execution", "cell"]
      },
      {
        tool: "Jupyter Notebook",
        category: "ide",
        title: "새 셀 삽입",
        description: "아래에 새 셀 삽입",
        windowsShortcut: "B",
        macosShortcut: "B",
        linuxShortcut: "B",
        popularity: 80,
        verified: true,
        aliases: ["insert cell", "셀삽입"],
        tags: ["cell", "insert"]
      },
      {
        tool: "Jupyter Notebook",
        category: "ide",
        title: "셀 삭제",
        description: "현재 셀 삭제",
        windowsShortcut: "DD",
        macosShortcut: "DD",
        linuxShortcut: "DD",
        popularity: 70,
        verified: true,
        aliases: ["delete cell", "셀삭제"],
        tags: ["cell", "delete"]
      },
      
      // Slack
      {
        tool: "Slack",
        category: "communication",
        title: "빠른 스위처",
        description: "채널/DM 빠른 검색",
        windowsShortcut: "Ctrl+K",
        macosShortcut: "Cmd+K",
        linuxShortcut: "Ctrl+K",
        popularity: 85,
        verified: true,
        aliases: ["quick switcher", "빠른검색"],
        tags: ["navigation", "search"]
      },
      {
        tool: "Slack",
        category: "communication",
        title: "모든 읽지 않은 메시지",
        description: "읽지 않은 메시지 표시",
        windowsShortcut: "Ctrl+Shift+A",
        macosShortcut: "Cmd+Shift+A",
        linuxShortcut: "Ctrl+Shift+A",
        popularity: 75,
        verified: true,
        aliases: ["unread messages", "읽지않은메시지"],
        tags: ["messages", "unread"]
      },
      
      // Discord
      {
        tool: "Discord",
        category: "communication",
        title: "서버 검색",
        description: "서버 및 채널 검색",
        windowsShortcut: "Ctrl+K",
        macosShortcut: "Cmd+K",
        linuxShortcut: "Ctrl+K",
        popularity: 80,
        verified: true,
        aliases: ["search", "서버검색"],
        tags: ["navigation", "search"]
      },
      {
        tool: "Discord",
        category: "communication",
        title: "음소거 토글",
        description: "마이크 음소거 토글",
        windowsShortcut: "Ctrl+Shift+M",
        macosShortcut: "Cmd+Shift+M",
        linuxShortcut: "Ctrl+Shift+M",
        popularity: 75,
        verified: true,
        aliases: ["mute", "음소거"],
        tags: ["audio", "mute"]
      },
      
      // Figma
      {
        tool: "Figma",
        category: "design",
        title: "선택 도구",
        description: "선택 도구로 변경",
        windowsShortcut: "V",
        macosShortcut: "V",
        linuxShortcut: "V",
        popularity: 90,
        verified: true,
        aliases: ["select tool", "선택도구"],
        tags: ["tool", "select"]
      },
      {
        tool: "Figma",
        category: "design",
        title: "프레임 도구",
        description: "프레임 도구로 변경",
        windowsShortcut: "F",
        macosShortcut: "F",
        linuxShortcut: "F",
        popularity: 85,
        verified: true,
        aliases: ["frame tool", "프레임도구"],
        tags: ["tool", "frame"]
      },
      
      // Notion
      {
        tool: "Notion",
        category: "productivity",
        title: "빠른 찾기",
        description: "페이지 빠른 검색",
        windowsShortcut: "Ctrl+P",
        macosShortcut: "Cmd+P",
        linuxShortcut: "Ctrl+P",
        popularity: 85,
        verified: true,
        aliases: ["quick find", "빠른찾기"],
        tags: ["navigation", "search"]
      },
      {
        tool: "Notion",
        category: "productivity",
        title: "새 페이지",
        description: "새 페이지 만들기",
        windowsShortcut: "Ctrl+N",
        macosShortcut: "Cmd+N",
        linuxShortcut: "Ctrl+N",
        popularity: 80,
        verified: true,
        aliases: ["new page", "새페이지"],
        tags: ["page", "new"]
      },
      
      // Terminal
      {
        tool: "Terminal",
        category: "os",
        title: "화면 지우기",
        description: "터미널 화면 지우기",
        windowsShortcut: "Ctrl+L",
        macosShortcut: "Cmd+K",
        linuxShortcut: "Ctrl+L",
        popularity: 85,
        verified: true,
        aliases: ["clear screen", "화면지우기"],
        tags: ["terminal", "clear"]
      },
      {
        tool: "Terminal",
        category: "os",
        title: "프로세스 중단",
        description: "실행 중인 프로세스 중단",
        windowsShortcut: "Ctrl+C",
        macosShortcut: "Cmd+C",
        linuxShortcut: "Ctrl+C",
        popularity: 80,
        verified: true,
        aliases: ["interrupt", "중단"],
        tags: ["terminal", "interrupt"]
      }
    ];

    initialShortcuts.forEach(shortcut => {
      const id = this.currentShortcutId++;
      this.shortcuts.set(id, { id, ...shortcut });
    });
  }

  async getShortcuts(): Promise<Shortcut[]> {
    return Array.from(this.shortcuts.values());
  }

  async getShortcutsByCategory(category: string): Promise<Shortcut[]> {
    return Array.from(this.shortcuts.values()).filter(s => s.category === category);
  }

  async getShortcutsByTool(tool: string): Promise<Shortcut[]> {
    return Array.from(this.shortcuts.values()).filter(s => s.tool === tool);
  }

  async getShortcut(id: number): Promise<Shortcut | undefined> {
    return this.shortcuts.get(id);
  }

  async createShortcut(shortcut: InsertShortcut): Promise<Shortcut> {
    const id = this.currentShortcutId++;
    const newShortcut: Shortcut = {
      id,
      ...shortcut,
      popularity: shortcut.popularity || 0,
      verified: shortcut.verified || false,
      aliases: shortcut.aliases || [],
      tags: shortcut.tags || []
    };
    this.shortcuts.set(id, newShortcut);
    return newShortcut;
  }

  async updateShortcut(id: number, shortcut: Partial<InsertShortcut>): Promise<Shortcut | undefined> {
    const existing = this.shortcuts.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...shortcut };
    this.shortcuts.set(id, updated);
    return updated;
  }

  async deleteShortcut(id: number): Promise<boolean> {
    return this.shortcuts.delete(id);
  }

  async searchShortcuts(query: string): Promise<Shortcut[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.shortcuts.values()).filter(shortcut => 
      shortcut.title.toLowerCase().includes(searchTerm) ||
      shortcut.description.toLowerCase().includes(searchTerm) ||
      shortcut.tool.toLowerCase().includes(searchTerm) ||
      shortcut.windowsShortcut?.toLowerCase().includes(searchTerm) ||
      shortcut.macosShortcut?.toLowerCase().includes(searchTerm) ||
      shortcut.linuxShortcut?.toLowerCase().includes(searchTerm) ||
      shortcut.aliases?.some(alias => alias.toLowerCase().includes(searchTerm)) ||
      shortcut.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async getPopularShortcuts(limit: number): Promise<Shortcut[]> {
    return Array.from(this.shortcuts.values())
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
  }

  async getFavoriteShortcuts(userId: string): Promise<FavoriteShortcut[]> {
    return this.favoriteShortcuts.get(userId) || [];
  }

  async addFavoriteShortcut(favorite: InsertFavoriteShortcut): Promise<FavoriteShortcut> {
    const id = this.currentFavoriteId++;
    const newFavorite: FavoriteShortcut = {
      id,
      ...favorite,
      createdAt: new Date().toISOString()
    };

    const userFavorites = this.favoriteShortcuts.get(favorite.userId) || [];
    userFavorites.push(newFavorite);
    this.favoriteShortcuts.set(favorite.userId, userFavorites);

    return newFavorite;
  }

  async removeFavoriteShortcut(shortcutId: number, userId: string): Promise<boolean> {
    const userFavorites = this.favoriteShortcuts.get(userId) || [];
    const index = userFavorites.findIndex(f => f.shortcutId === shortcutId);
    
    if (index === -1) return false;

    userFavorites.splice(index, 1);
    this.favoriteShortcuts.set(userId, userFavorites);
    return true;
  }

  async incrementShortcutUsage(shortcutId: number): Promise<void> {
    const existing = this.shortcutUsage.get(shortcutId);
    
    if (existing) {
      existing.usageCount = (existing.usageCount || 0) + 1;
      existing.lastUsed = new Date().toISOString();
    } else {
      const id = this.currentUsageId++;
      this.shortcutUsage.set(shortcutId, {
        id,
        shortcutId,
        usageCount: 1,
        lastUsed: new Date().toISOString()
      });
    }

    // Update shortcut popularity
    const shortcut = this.shortcuts.get(shortcutId);
    if (shortcut) {
      shortcut.popularity = (shortcut.popularity || 0) + 1;
      this.shortcuts.set(shortcutId, shortcut);
    }
  }

  async getShortcutUsage(shortcutId: number): Promise<ShortcutUsage | undefined> {
    return this.shortcutUsage.get(shortcutId);
  }
}

export const storage = new MemStorage();
