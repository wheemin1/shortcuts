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
      },
      
      // More Windows shortcuts
      {
        tool: "Windows",
        category: "os",
        title: "실행 대화상자",
        description: "실행 대화상자 열기",
        windowsShortcut: "Win+R",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 90,
        verified: true,
        aliases: ["run dialog", "실행"],
        tags: ["system", "run"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "파일 탐색기",
        description: "파일 탐색기 열기",
        windowsShortcut: "Win+E",
        macosShortcut: "Cmd+Space",
        linuxShortcut: "Ctrl+Alt+F",
        popularity: 85,
        verified: true,
        aliases: ["file explorer", "탐색기"],
        tags: ["file", "explorer"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "설정",
        description: "Windows 설정 열기",
        windowsShortcut: "Win+I",
        macosShortcut: "Cmd+,",
        linuxShortcut: null,
        popularity: 80,
        verified: true,
        aliases: ["settings", "설정"],
        tags: ["system", "settings"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "데스크톱 보기",
        description: "모든 창 최소화하여 데스크톱 보기",
        windowsShortcut: "Win+D",
        macosShortcut: "F11",
        linuxShortcut: "Ctrl+Alt+D",
        popularity: 75,
        verified: true,
        aliases: ["show desktop", "데스크톱"],
        tags: ["desktop", "minimize"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "창 전환",
        description: "열린 창 사이 전환",
        windowsShortcut: "Alt+Tab",
        macosShortcut: "Cmd+Tab",
        linuxShortcut: "Alt+Tab",
        popularity: 95,
        verified: true,
        aliases: ["switch window", "창전환"],
        tags: ["window", "switch"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "전체 화면 스크린샷",
        description: "전체 화면 스크린샷 찍기",
        windowsShortcut: "PrtSc",
        macosShortcut: "Cmd+Shift+3",
        linuxShortcut: "PrtSc",
        popularity: 85,
        verified: true,
        aliases: ["screenshot", "화면캡처"],
        tags: ["capture", "screen"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "창 닫기",
        description: "현재 창 닫기",
        windowsShortcut: "Alt+F4",
        macosShortcut: "Cmd+W",
        linuxShortcut: "Alt+F4",
        popularity: 90,
        verified: true,
        aliases: ["close window", "창닫기"],
        tags: ["window", "close"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "검색",
        description: "Windows 검색 열기",
        windowsShortcut: "Win+S",
        macosShortcut: "Cmd+Space",
        linuxShortcut: "Alt+F1",
        popularity: 80,
        verified: true,
        aliases: ["search", "검색"],
        tags: ["search", "find"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "가상 데스크톱",
        description: "새 가상 데스크톱 만들기",
        windowsShortcut: "Win+Ctrl+D",
        macosShortcut: "Ctrl+Up",
        linuxShortcut: "Ctrl+Alt+T",
        popularity: 65,
        verified: true,
        aliases: ["virtual desktop", "가상데스크톱"],
        tags: ["desktop", "virtual"]
      },

      // More VSCode shortcuts
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "전체 줄 선택",
        description: "현재 줄 전체 선택",
        windowsShortcut: "Ctrl+L",
        macosShortcut: "Cmd+L",
        linuxShortcut: "Ctrl+L",
        popularity: 85,
        verified: true,
        aliases: ["select line", "줄선택"],
        tags: ["selection", "line"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "줄 복사",
        description: "현재 줄 복사",
        windowsShortcut: "Shift+Alt+Down",
        macosShortcut: "Shift+Option+Down",
        linuxShortcut: "Shift+Alt+Down",
        popularity: 80,
        verified: true,
        aliases: ["copy line", "줄복사"],
        tags: ["copy", "line"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "줄 이동",
        description: "현재 줄을 위/아래로 이동",
        windowsShortcut: "Alt+Up/Down",
        macosShortcut: "Option+Up/Down",
        linuxShortcut: "Alt+Up/Down",
        popularity: 75,
        verified: true,
        aliases: ["move line", "줄이동"],
        tags: ["move", "line"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "줄 삭제",
        description: "현재 줄 삭제",
        windowsShortcut: "Ctrl+Shift+K",
        macosShortcut: "Cmd+Shift+K",
        linuxShortcut: "Ctrl+Shift+K",
        popularity: 70,
        verified: true,
        aliases: ["delete line", "줄삭제"],
        tags: ["delete", "line"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "주석 토글",
        description: "선택한 줄 주석 토글",
        windowsShortcut: "Ctrl+/",
        macosShortcut: "Cmd+/",
        linuxShortcut: "Ctrl+/",
        popularity: 90,
        verified: true,
        aliases: ["toggle comment", "주석"],
        tags: ["comment", "toggle"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "블록 주석",
        description: "블록 주석 토글",
        windowsShortcut: "Shift+Alt+A",
        macosShortcut: "Shift+Option+A",
        linuxShortcut: "Shift+Alt+A",
        popularity: 75,
        verified: true,
        aliases: ["block comment", "블록주석"],
        tags: ["comment", "block"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "포맷팅",
        description: "문서 포맷팅",
        windowsShortcut: "Shift+Alt+F",
        macosShortcut: "Shift+Option+F",
        linuxShortcut: "Shift+Alt+F",
        popularity: 85,
        verified: true,
        aliases: ["format document", "포맷팅"],
        tags: ["format", "document"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "정의로 이동",
        description: "선택한 심볼의 정의로 이동",
        windowsShortcut: "F12",
        macosShortcut: "F12",
        linuxShortcut: "F12",
        popularity: 80,
        verified: true,
        aliases: ["go to definition", "정의이동"],
        tags: ["navigation", "definition"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "문제 패널",
        description: "문제 패널 열기",
        windowsShortcut: "Ctrl+Shift+M",
        macosShortcut: "Cmd+Shift+M",
        linuxShortcut: "Ctrl+Shift+M",
        popularity: 70,
        verified: true,
        aliases: ["problems panel", "문제패널"],
        tags: ["panel", "problems"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "확장 프로그램",
        description: "확장 프로그램 패널 열기",
        windowsShortcut: "Ctrl+Shift+X",
        macosShortcut: "Cmd+Shift+X",
        linuxShortcut: "Ctrl+Shift+X",
        popularity: 65,
        verified: true,
        aliases: ["extensions", "확장프로그램"],
        tags: ["extensions", "panel"]
      },

      // More Excel shortcuts
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "새 워크시트",
        description: "새 워크시트 추가",
        windowsShortcut: "Shift+F11",
        macosShortcut: "Shift+F11",
        linuxShortcut: "Shift+F11",
        popularity: 70,
        verified: true,
        aliases: ["new worksheet", "새워크시트"],
        tags: ["worksheet", "new"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "셀 편집",
        description: "선택한 셀 편집 모드",
        windowsShortcut: "F2",
        macosShortcut: "F2",
        linuxShortcut: "F2",
        popularity: 85,
        verified: true,
        aliases: ["edit cell", "셀편집"],
        tags: ["cell", "edit"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "현재 날짜",
        description: "현재 날짜 입력",
        windowsShortcut: "Ctrl+;",
        macosShortcut: "Cmd+;",
        linuxShortcut: "Ctrl+;",
        popularity: 75,
        verified: true,
        aliases: ["current date", "날짜입력"],
        tags: ["date", "current"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "현재 시간",
        description: "현재 시간 입력",
        windowsShortcut: "Ctrl+Shift+;",
        macosShortcut: "Cmd+Shift+;",
        linuxShortcut: "Ctrl+Shift+;",
        popularity: 70,
        verified: true,
        aliases: ["current time", "시간입력"],
        tags: ["time", "current"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "아래로 채우기",
        description: "선택한 셀을 아래로 채우기",
        windowsShortcut: "Ctrl+D",
        macosShortcut: "Cmd+D",
        linuxShortcut: "Ctrl+D",
        popularity: 80,
        verified: true,
        aliases: ["fill down", "아래채우기"],
        tags: ["fill", "down"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "오른쪽으로 채우기",
        description: "선택한 셀을 오른쪽으로 채우기",
        windowsShortcut: "Ctrl+R",
        macosShortcut: "Cmd+R",
        linuxShortcut: "Ctrl+R",
        popularity: 75,
        verified: true,
        aliases: ["fill right", "오른쪽채우기"],
        tags: ["fill", "right"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "전체 열 선택",
        description: "전체 열 선택",
        windowsShortcut: "Ctrl+Space",
        macosShortcut: "Cmd+Space",
        linuxShortcut: "Ctrl+Space",
        popularity: 70,
        verified: true,
        aliases: ["select column", "열선택"],
        tags: ["selection", "column"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "전체 행 선택",
        description: "전체 행 선택",
        windowsShortcut: "Shift+Space",
        macosShortcut: "Shift+Space",
        linuxShortcut: "Shift+Space",
        popularity: 70,
        verified: true,
        aliases: ["select row", "행선택"],
        tags: ["selection", "row"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "데이터 끝으로",
        description: "데이터 영역의 끝으로 이동",
        windowsShortcut: "Ctrl+End",
        macosShortcut: "Cmd+End",
        linuxShortcut: "Ctrl+End",
        popularity: 75,
        verified: true,
        aliases: ["go to end", "끝으로이동"],
        tags: ["navigation", "end"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "데이터 시작으로",
        description: "데이터 영역의 시작으로 이동",
        windowsShortcut: "Ctrl+Home",
        macosShortcut: "Cmd+Home",
        linuxShortcut: "Ctrl+Home",
        popularity: 70,
        verified: true,
        aliases: ["go to start", "시작으로이동"],
        tags: ["navigation", "start"]
      },

      // More Photoshop shortcuts
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "선택 도구",
        description: "선택 도구 (마키 도구)",
        windowsShortcut: "M",
        macosShortcut: "M",
        linuxShortcut: "M",
        popularity: 90,
        verified: true,
        aliases: ["marquee tool", "선택도구"],
        tags: ["tool", "selection"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "올가미 도구",
        description: "올가미 도구 선택",
        windowsShortcut: "L",
        macosShortcut: "L",
        linuxShortcut: "L",
        popularity: 80,
        verified: true,
        aliases: ["lasso tool", "올가미도구"],
        tags: ["tool", "lasso"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "마법봉 도구",
        description: "마법봉 도구 선택",
        windowsShortcut: "W",
        macosShortcut: "W",
        linuxShortcut: "W",
        popularity: 85,
        verified: true,
        aliases: ["magic wand", "마법봉"],
        tags: ["tool", "magic wand"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "자르기 도구",
        description: "자르기 도구 선택",
        windowsShortcut: "C",
        macosShortcut: "C",
        linuxShortcut: "C",
        popularity: 85,
        verified: true,
        aliases: ["crop tool", "자르기도구"],
        tags: ["tool", "crop"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "스포이드 도구",
        description: "스포이드 도구 선택",
        windowsShortcut: "I",
        macosShortcut: "I",
        linuxShortcut: "I",
        popularity: 80,
        verified: true,
        aliases: ["eyedropper", "스포이드"],
        tags: ["tool", "eyedropper"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "복원 브러시",
        description: "복원 브러시 도구 선택",
        windowsShortcut: "J",
        macosShortcut: "J",
        linuxShortcut: "J",
        popularity: 75,
        verified: true,
        aliases: ["healing brush", "복원브러시"],
        tags: ["tool", "healing"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "확대/축소 도구",
        description: "확대/축소 도구 선택",
        windowsShortcut: "Z",
        macosShortcut: "Z",
        linuxShortcut: "Z",
        popularity: 85,
        verified: true,
        aliases: ["zoom tool", "확대도구"],
        tags: ["tool", "zoom"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "레이어 병합",
        description: "보이는 레이어 병합",
        windowsShortcut: "Ctrl+Shift+E",
        macosShortcut: "Cmd+Shift+E",
        linuxShortcut: "Ctrl+Shift+E",
        popularity: 70,
        verified: true,
        aliases: ["merge layers", "레이어병합"],
        tags: ["layer", "merge"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "레이어 아래로 병합",
        description: "현재 레이어를 아래 레이어와 병합",
        windowsShortcut: "Ctrl+E",
        macosShortcut: "Cmd+E",
        linuxShortcut: "Ctrl+E",
        popularity: 75,
        verified: true,
        aliases: ["merge down", "아래로병합"],
        tags: ["layer", "merge down"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "색상 조정",
        description: "색상/채도 조정",
        windowsShortcut: "Ctrl+U",
        macosShortcut: "Cmd+U",
        linuxShortcut: "Ctrl+U",
        popularity: 80,
        verified: true,
        aliases: ["hue saturation", "색상조정"],
        tags: ["adjustment", "color"]
      },

      // More Chrome shortcuts
      {
        tool: "Google Chrome",
        category: "browser",
        title: "시크릿 모드",
        description: "시크릿 창 열기",
        windowsShortcut: "Ctrl+Shift+N",
        macosShortcut: "Cmd+Shift+N",
        linuxShortcut: "Ctrl+Shift+N",
        popularity: 85,
        verified: true,
        aliases: ["incognito mode", "시크릿모드"],
        tags: ["incognito", "private"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "최근 닫은 탭",
        description: "최근 닫은 탭 다시 열기",
        windowsShortcut: "Ctrl+Shift+T",
        macosShortcut: "Cmd+Shift+T",
        linuxShortcut: "Ctrl+Shift+T",
        popularity: 90,
        verified: true,
        aliases: ["reopen tab", "탭복원"],
        tags: ["tab", "reopen"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "북마크 바",
        description: "북마크 바 토글",
        windowsShortcut: "Ctrl+Shift+B",
        macosShortcut: "Cmd+Shift+B",
        linuxShortcut: "Ctrl+Shift+B",
        popularity: 70,
        verified: true,
        aliases: ["bookmark bar", "북마크바"],
        tags: ["bookmark", "bar"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "주소창 검색",
        description: "주소창에 포커스",
        windowsShortcut: "Ctrl+L",
        macosShortcut: "Cmd+L",
        linuxShortcut: "Ctrl+L",
        popularity: 85,
        verified: true,
        aliases: ["address bar", "주소창"],
        tags: ["address", "focus"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "다음 탭",
        description: "다음 탭으로 이동",
        windowsShortcut: "Ctrl+Tab",
        macosShortcut: "Cmd+Option+Right",
        linuxShortcut: "Ctrl+Tab",
        popularity: 80,
        verified: true,
        aliases: ["next tab", "다음탭"],
        tags: ["tab", "navigation"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "이전 탭",
        description: "이전 탭으로 이동",
        windowsShortcut: "Ctrl+Shift+Tab",
        macosShortcut: "Cmd+Option+Left",
        linuxShortcut: "Ctrl+Shift+Tab",
        popularity: 75,
        verified: true,
        aliases: ["previous tab", "이전탭"],
        tags: ["tab", "navigation"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "확대",
        description: "페이지 확대",
        windowsShortcut: "Ctrl++",
        macosShortcut: "Cmd++",
        linuxShortcut: "Ctrl++",
        popularity: 70,
        verified: true,
        aliases: ["zoom in", "확대"],
        tags: ["zoom", "magnify"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "축소",
        description: "페이지 축소",
        windowsShortcut: "Ctrl+-",
        macosShortcut: "Cmd+-",
        linuxShortcut: "Ctrl+-",
        popularity: 65,
        verified: true,
        aliases: ["zoom out", "축소"],
        tags: ["zoom", "reduce"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "원래 크기",
        description: "100% 원래 크기로 복원",
        windowsShortcut: "Ctrl+0",
        macosShortcut: "Cmd+0",
        linuxShortcut: "Ctrl+0",
        popularity: 60,
        verified: true,
        aliases: ["reset zoom", "원래크기"],
        tags: ["zoom", "reset"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "전체 화면",
        description: "전체 화면 모드 토글",
        windowsShortcut: "F11",
        macosShortcut: "Cmd+Ctrl+F",
        linuxShortcut: "F11",
        popularity: 65,
        verified: true,
        aliases: ["fullscreen", "전체화면"],
        tags: ["fullscreen", "mode"]
      },

      // Python IDE shortcuts
      {
        tool: "Python IDLE",
        category: "ide",
        title: "Python 실행",
        description: "Python 파일 실행",
        windowsShortcut: "F5",
        macosShortcut: "F5",
        linuxShortcut: "F5",
        popularity: 90,
        verified: true,
        aliases: ["run python", "파이썬실행"],
        tags: ["python", "run"]
      },
      {
        tool: "Python IDLE",
        category: "ide",
        title: "인터프리터 재시작",
        description: "Python 인터프리터 재시작",
        windowsShortcut: "Ctrl+F6",
        macosShortcut: "Cmd+F6",
        linuxShortcut: "Ctrl+F6",
        popularity: 75,
        verified: true,
        aliases: ["restart interpreter", "인터프리터재시작"],
        tags: ["python", "restart"]
      },
      {
        tool: "Python IDLE",
        category: "ide",
        title: "코드 완성",
        description: "자동 완성 제안",
        windowsShortcut: "Ctrl+Space",
        macosShortcut: "Cmd+Space",
        linuxShortcut: "Ctrl+Space",
        popularity: 85,
        verified: true,
        aliases: ["autocomplete", "자동완성"],
        tags: ["python", "autocomplete"]
      },
      {
        tool: "Python IDLE",
        category: "ide",
        title: "들여쓰기",
        description: "코드 들여쓰기",
        windowsShortcut: "Ctrl+]",
        macosShortcut: "Cmd+]",
        linuxShortcut: "Ctrl+]",
        popularity: 80,
        verified: true,
        aliases: ["indent", "들여쓰기"],
        tags: ["python", "indent"]
      },
      {
        tool: "Python IDLE",
        category: "ide",
        title: "내어쓰기",
        description: "코드 내어쓰기",
        windowsShortcut: "Ctrl+[",
        macosShortcut: "Cmd+[",
        linuxShortcut: "Ctrl+[",
        popularity: 75,
        verified: true,
        aliases: ["unindent", "내어쓰기"],
        tags: ["python", "unindent"]
      },

      // More communication tools
      {
        tool: "Microsoft Teams",
        category: "communication",
        title: "음소거 토글",
        description: "마이크 음소거 토글",
        windowsShortcut: "Ctrl+Shift+M",
        macosShortcut: "Cmd+Shift+M",
        linuxShortcut: "Ctrl+Shift+M",
        popularity: 90,
        verified: true,
        aliases: ["mute toggle", "음소거토글"],
        tags: ["audio", "mute"]
      },
      {
        tool: "Microsoft Teams",
        category: "communication",
        title: "비디오 토글",
        description: "비디오 켜기/끄기",
        windowsShortcut: "Ctrl+Shift+O",
        macosShortcut: "Cmd+Shift+O",
        linuxShortcut: "Ctrl+Shift+O",
        popularity: 85,
        verified: true,
        aliases: ["video toggle", "비디오토글"],
        tags: ["video", "toggle"]
      },
      {
        tool: "Microsoft Teams",
        category: "communication",
        title: "채팅 열기",
        description: "채팅 창 열기",
        windowsShortcut: "Ctrl+Shift+Space",
        macosShortcut: "Cmd+Shift+Space",
        linuxShortcut: "Ctrl+Shift+Space",
        popularity: 80,
        verified: true,
        aliases: ["open chat", "채팅열기"],
        tags: ["chat", "open"]
      },
      {
        tool: "Microsoft Teams",
        category: "communication",
        title: "통화 수락",
        description: "수신 통화 수락",
        windowsShortcut: "Ctrl+Shift+S",
        macosShortcut: "Cmd+Shift+S",
        linuxShortcut: "Ctrl+Shift+S",
        popularity: 75,
        verified: true,
        aliases: ["accept call", "통화수락"],
        tags: ["call", "accept"]
      },
      {
        tool: "Microsoft Teams",
        category: "communication",
        title: "통화 거부",
        description: "수신 통화 거부",
        windowsShortcut: "Ctrl+Shift+D",
        macosShortcut: "Cmd+Shift+D",
        linuxShortcut: "Ctrl+Shift+D",
        popularity: 70,
        verified: true,
        aliases: ["decline call", "통화거부"],
        tags: ["call", "decline"]
      },

      // More productivity tools
      {
        tool: "Obsidian",
        category: "productivity",
        title: "새 노트",
        description: "새 노트 생성",
        windowsShortcut: "Ctrl+N",
        macosShortcut: "Cmd+N",
        linuxShortcut: "Ctrl+N",
        popularity: 85,
        verified: true,
        aliases: ["new note", "새노트"],
        tags: ["note", "new"]
      },
      {
        tool: "Obsidian",
        category: "productivity",
        title: "빠른 스위처",
        description: "파일 빠른 검색",
        windowsShortcut: "Ctrl+O",
        macosShortcut: "Cmd+O",
        linuxShortcut: "Ctrl+O",
        popularity: 90,
        verified: true,
        aliases: ["quick switcher", "빠른스위처"],
        tags: ["search", "quick"]
      },
      {
        tool: "Obsidian",
        category: "productivity",
        title: "그래프 보기",
        description: "그래프 보기 열기",
        windowsShortcut: "Ctrl+G",
        macosShortcut: "Cmd+G",
        linuxShortcut: "Ctrl+G",
        popularity: 75,
        verified: true,
        aliases: ["graph view", "그래프보기"],
        tags: ["graph", "view"]
      },
      {
        tool: "Obsidian",
        category: "productivity",
        title: "링크 삽입",
        description: "내부 링크 삽입",
        windowsShortcut: "Ctrl+K",
        macosShortcut: "Cmd+K",
        linuxShortcut: "Ctrl+K",
        popularity: 80,
        verified: true,
        aliases: ["insert link", "링크삽입"],
        tags: ["link", "insert"]
      },
      {
        tool: "Obsidian",
        category: "productivity",
        title: "미리보기 모드",
        description: "편집/미리보기 모드 전환",
        windowsShortcut: "Ctrl+E",
        macosShortcut: "Cmd+E",
        linuxShortcut: "Ctrl+E",
        popularity: 70,
        verified: true,
        aliases: ["preview mode", "미리보기모드"],
        tags: ["preview", "mode"]
      },

      // More media tools
      {
        tool: "VLC Media Player",
        category: "media",
        title: "재생/일시정지",
        description: "미디어 재생 또는 일시정지",
        windowsShortcut: "Space",
        macosShortcut: "Space",
        linuxShortcut: "Space",
        popularity: 95,
        verified: true,
        aliases: ["play pause", "재생일시정지"],
        tags: ["media", "play"]
      },
      {
        tool: "VLC Media Player",
        category: "media",
        title: "전체 화면",
        description: "전체 화면 토글",
        windowsShortcut: "F",
        macosShortcut: "F",
        linuxShortcut: "F",
        popularity: 85,
        verified: true,
        aliases: ["fullscreen", "전체화면"],
        tags: ["media", "fullscreen"]
      },
      {
        tool: "VLC Media Player",
        category: "media",
        title: "볼륨 증가",
        description: "볼륨 증가",
        windowsShortcut: "Ctrl+Up",
        macosShortcut: "Cmd+Up",
        linuxShortcut: "Ctrl+Up",
        popularity: 80,
        verified: true,
        aliases: ["volume up", "볼륨증가"],
        tags: ["media", "volume"]
      },
      {
        tool: "VLC Media Player",
        category: "media",
        title: "볼륨 감소",
        description: "볼륨 감소",
        windowsShortcut: "Ctrl+Down",
        macosShortcut: "Cmd+Down",
        linuxShortcut: "Ctrl+Down",
        popularity: 75,
        verified: true,
        aliases: ["volume down", "볼륨감소"],
        tags: ["media", "volume"]
      },
      {
        tool: "VLC Media Player",
        category: "media",
        title: "빨리 감기",
        description: "10초 빨리 감기",
        windowsShortcut: "Right",
        macosShortcut: "Right",
        linuxShortcut: "Right",
        popularity: 85,
        verified: true,
        aliases: ["fast forward", "빨리감기"],
        tags: ["media", "seek"]
      },
      {
        tool: "VLC Media Player",
        category: "media",
        title: "되감기",
        description: "10초 되감기",
        windowsShortcut: "Left",
        macosShortcut: "Left",
        linuxShortcut: "Left",
        popularity: 80,
        verified: true,
        aliases: ["rewind", "되감기"],
        tags: ["media", "seek"]
      },

      // More office tools
      {
        tool: "Microsoft Word",
        category: "office",
        title: "굵게",
        description: "선택한 텍스트 굵게",
        windowsShortcut: "Ctrl+B",
        macosShortcut: "Cmd+B",
        linuxShortcut: "Ctrl+B",
        popularity: 90,
        verified: true,
        aliases: ["bold", "굵게"],
        tags: ["format", "bold"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "기울임꼴",
        description: "선택한 텍스트 기울임꼴",
        windowsShortcut: "Ctrl+I",
        macosShortcut: "Cmd+I",
        linuxShortcut: "Ctrl+I",
        popularity: 85,
        verified: true,
        aliases: ["italic", "기울임꼴"],
        tags: ["format", "italic"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "밑줄",
        description: "선택한 텍스트 밑줄",
        windowsShortcut: "Ctrl+U",
        macosShortcut: "Cmd+U",
        linuxShortcut: "Ctrl+U",
        popularity: 80,
        verified: true,
        aliases: ["underline", "밑줄"],
        tags: ["format", "underline"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "가운데 정렬",
        description: "텍스트 가운데 정렬",
        windowsShortcut: "Ctrl+E",
        macosShortcut: "Cmd+E",
        linuxShortcut: "Ctrl+E",
        popularity: 75,
        verified: true,
        aliases: ["center align", "가운데정렬"],
        tags: ["format", "align"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "왼쪽 정렬",
        description: "텍스트 왼쪽 정렬",
        windowsShortcut: "Ctrl+L",
        macosShortcut: "Cmd+L",
        linuxShortcut: "Ctrl+L",
        popularity: 70,
        verified: true,
        aliases: ["left align", "왼쪽정렬"],
        tags: ["format", "align"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "오른쪽 정렬",
        description: "텍스트 오른쪽 정렬",
        windowsShortcut: "Ctrl+R",
        macosShortcut: "Cmd+R",
        linuxShortcut: "Ctrl+R",
        popularity: 65,
        verified: true,
        aliases: ["right align", "오른쪽정렬"],
        tags: ["format", "align"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "글꼴 크기 증가",
        description: "글꼴 크기 증가",
        windowsShortcut: "Ctrl+Shift+>",
        macosShortcut: "Cmd+Shift+>",
        linuxShortcut: "Ctrl+Shift+>",
        popularity: 70,
        verified: true,
        aliases: ["increase font size", "글꼴크기증가"],
        tags: ["format", "font"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "글꼴 크기 감소",
        description: "글꼴 크기 감소",
        windowsShortcut: "Ctrl+Shift+<",
        macosShortcut: "Cmd+Shift+<",
        linuxShortcut: "Ctrl+Shift+<",
        popularity: 65,
        verified: true,
        aliases: ["decrease font size", "글꼴크기감소"],
        tags: ["format", "font"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "페이지 나누기",
        description: "페이지 나누기 삽입",
        windowsShortcut: "Ctrl+Enter",
        macosShortcut: "Cmd+Enter",
        linuxShortcut: "Ctrl+Enter",
        popularity: 75,
        verified: true,
        aliases: ["page break", "페이지나누기"],
        tags: ["page", "break"]
      },
      {
        tool: "Microsoft Word",
        category: "office",
        title: "단락 나누기",
        description: "단락 나누기 삽입",
        windowsShortcut: "Shift+Enter",
        macosShortcut: "Shift+Enter",
        linuxShortcut: "Shift+Enter",
        popularity: 70,
        verified: true,
        aliases: ["line break", "단락나누기"],
        tags: ["line", "break"]
      },

      // More comprehensive Windows shortcuts
      {
        tool: "Windows",
        category: "os",
        title: "시작 메뉴",
        description: "시작 메뉴 열기/닫기",
        windowsShortcut: "Win",
        macosShortcut: null,
        linuxShortcut: "Super",
        popularity: 95,
        verified: true,
        aliases: ["start menu", "시작메뉴"],
        tags: ["start", "menu"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "액션 센터",
        description: "액션 센터 열기",
        windowsShortcut: "Win+A",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 75,
        verified: true,
        aliases: ["action center", "액션센터"],
        tags: ["action", "notifications"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "잠금 화면",
        description: "PC 잠금",
        windowsShortcut: "Win+L",
        macosShortcut: "Cmd+Ctrl+Q",
        linuxShortcut: "Ctrl+Alt+L",
        popularity: 90,
        verified: true,
        aliases: ["lock screen", "잠금"],
        tags: ["security", "lock"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "스냅 레이아웃",
        description: "스냅 레이아웃 열기",
        windowsShortcut: "Win+Z",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 80,
        verified: true,
        aliases: ["snap layouts", "스냅레이아웃"],
        tags: ["window", "snap"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "클립보드 히스토리",
        description: "클립보드 히스토리 열기",
        windowsShortcut: "Win+V",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 85,
        verified: true,
        aliases: ["clipboard history", "클립보드히스토리"],
        tags: ["clipboard", "history"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "이모지 패널",
        description: "이모지 패널 열기",
        windowsShortcut: "Win+.",
        macosShortcut: "Cmd+Ctrl+Space",
        linuxShortcut: null,
        popularity: 70,
        verified: true,
        aliases: ["emoji panel", "이모지"],
        tags: ["emoji", "symbols"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "시스템 정보",
        description: "시스템 정보 열기",
        windowsShortcut: "Win+Pause",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 60,
        verified: true,
        aliases: ["system info", "시스템정보"],
        tags: ["system", "info"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "접근성 센터",
        description: "접근성 센터 열기",
        windowsShortcut: "Win+U",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 50,
        verified: true,
        aliases: ["accessibility center", "접근성센터"],
        tags: ["accessibility", "ease"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "위젯",
        description: "위젯 패널 열기",
        windowsShortcut: "Win+W",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 65,
        verified: true,
        aliases: ["widgets", "위젯"],
        tags: ["widgets", "news"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "음성 입력",
        description: "음성 입력 시작",
        windowsShortcut: "Win+H",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 70,
        verified: true,
        aliases: ["voice typing", "음성입력"],
        tags: ["voice", "dictation"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "돋보기",
        description: "돋보기 열기",
        windowsShortcut: "Win++",
        macosShortcut: "Cmd+Option+8",
        linuxShortcut: null,
        popularity: 60,
        verified: true,
        aliases: ["magnifier", "돋보기"],
        tags: ["accessibility", "zoom"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "화면 캡처",
        description: "화면 캡처 도구 열기",
        windowsShortcut: "Win+Shift+S",
        macosShortcut: "Cmd+Shift+4",
        linuxShortcut: "Shift+PrtSc",
        popularity: 90,
        verified: true,
        aliases: ["screenshot tool", "화면캡처"],
        tags: ["screenshot", "capture"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "작업 관리자",
        description: "작업 관리자 열기",
        windowsShortcut: "Ctrl+Shift+Esc",
        macosShortcut: "Cmd+Option+Esc",
        linuxShortcut: "Ctrl+Alt+Del",
        popularity: 95,
        verified: true,
        aliases: ["task manager", "작업관리자"],
        tags: ["task", "manager"]
      },
      {
        tool: "Windows",
        category: "os",
        title: "빠른 연결",
        description: "빠른 연결 메뉴 열기",
        windowsShortcut: "Win+X",
        macosShortcut: null,
        linuxShortcut: null,
        popularity: 80,
        verified: true,
        aliases: ["quick link", "빠른연결"],
        tags: ["quick", "menu"]
      },

      // More comprehensive VSCode shortcuts
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "명령 팔레트",
        description: "명령 팔레트 열기",
        windowsShortcut: "Ctrl+Shift+P",
        macosShortcut: "Cmd+Shift+P",
        linuxShortcut: "Ctrl+Shift+P",
        popularity: 95,
        verified: true,
        aliases: ["command palette", "명령팔레트"],
        tags: ["command", "palette"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "파일 빠른 열기",
        description: "파일 빠른 열기",
        windowsShortcut: "Ctrl+P",
        macosShortcut: "Cmd+P",
        linuxShortcut: "Ctrl+P",
        popularity: 90,
        verified: true,
        aliases: ["quick open", "빠른열기"],
        tags: ["file", "open"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "전역 검색",
        description: "전역 검색 (모든 파일에서 검색)",
        windowsShortcut: "Ctrl+Shift+F",
        macosShortcut: "Cmd+Shift+F",
        linuxShortcut: "Ctrl+Shift+F",
        popularity: 85,
        verified: true,
        aliases: ["global search", "전역검색"],
        tags: ["search", "global"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "심볼로 이동",
        description: "현재 파일의 심볼로 이동",
        windowsShortcut: "Ctrl+Shift+O",
        macosShortcut: "Cmd+Shift+O",
        linuxShortcut: "Ctrl+Shift+O",
        popularity: 80,
        verified: true,
        aliases: ["go to symbol", "심볼이동"],
        tags: ["navigation", "symbol"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "다음 같은 단어 선택",
        description: "다음 같은 단어 선택",
        windowsShortcut: "Ctrl+D",
        macosShortcut: "Cmd+D",
        linuxShortcut: "Ctrl+D",
        popularity: 85,
        verified: true,
        aliases: ["select next occurrence", "다음선택"],
        tags: ["selection", "occurrence"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "모든 같은 단어 선택",
        description: "모든 같은 단어 선택",
        windowsShortcut: "Ctrl+Shift+L",
        macosShortcut: "Cmd+Shift+L",
        linuxShortcut: "Ctrl+Shift+L",
        popularity: 80,
        verified: true,
        aliases: ["select all occurrences", "모든선택"],
        tags: ["selection", "all"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "다중 커서 위",
        description: "위쪽에 커서 추가",
        windowsShortcut: "Ctrl+Alt+Up",
        macosShortcut: "Cmd+Option+Up",
        linuxShortcut: "Ctrl+Alt+Up",
        popularity: 75,
        verified: true,
        aliases: ["add cursor above", "커서위"],
        tags: ["cursor", "multi"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "다중 커서 아래",
        description: "아래쪽에 커서 추가",
        windowsShortcut: "Ctrl+Alt+Down",
        macosShortcut: "Cmd+Option+Down",
        linuxShortcut: "Ctrl+Alt+Down",
        popularity: 75,
        verified: true,
        aliases: ["add cursor below", "커서아래"],
        tags: ["cursor", "multi"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "선택 영역 확장",
        description: "선택 영역 확장",
        windowsShortcut: "Shift+Alt+Right",
        macosShortcut: "Shift+Option+Right",
        linuxShortcut: "Shift+Alt+Right",
        popularity: 70,
        verified: true,
        aliases: ["expand selection", "선택확장"],
        tags: ["selection", "expand"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "선택 영역 축소",
        description: "선택 영역 축소",
        windowsShortcut: "Shift+Alt+Left",
        macosShortcut: "Shift+Option+Left",
        linuxShortcut: "Shift+Alt+Left",
        popularity: 65,
        verified: true,
        aliases: ["shrink selection", "선택축소"],
        tags: ["selection", "shrink"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "선택 영역 포맷",
        description: "선택 영역 포맷",
        windowsShortcut: "Ctrl+K Ctrl+F",
        macosShortcut: "Cmd+K Cmd+F",
        linuxShortcut: "Ctrl+K Ctrl+F",
        popularity: 70,
        verified: true,
        aliases: ["format selection", "선택포맷"],
        tags: ["format", "selection"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "분할 편집기",
        description: "편집기 분할",
        windowsShortcut: "Ctrl+\\",
        macosShortcut: "Cmd+\\",
        linuxShortcut: "Ctrl+\\",
        popularity: 80,
        verified: true,
        aliases: ["split editor", "분할편집기"],
        tags: ["editor", "split"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "편집기 그룹 포커스",
        description: "편집기 그룹 1/2/3 포커스",
        windowsShortcut: "Ctrl+1",
        macosShortcut: "Cmd+1",
        linuxShortcut: "Ctrl+1",
        popularity: 75,
        verified: true,
        aliases: ["focus editor group", "편집기포커스"],
        tags: ["editor", "focus"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "터미널 토글",
        description: "통합 터미널 토글",
        windowsShortcut: "Ctrl+`",
        macosShortcut: "Cmd+`",
        linuxShortcut: "Ctrl+`",
        popularity: 90,
        verified: true,
        aliases: ["toggle terminal", "터미널토글"],
        tags: ["terminal", "toggle"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "새 터미널",
        description: "새 터미널 생성",
        windowsShortcut: "Ctrl+Shift+`",
        macosShortcut: "Cmd+Shift+`",
        linuxShortcut: "Ctrl+Shift+`",
        popularity: 80,
        verified: true,
        aliases: ["new terminal", "새터미널"],
        tags: ["terminal", "new"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "Zen 모드",
        description: "Zen 모드 토글",
        windowsShortcut: "Ctrl+K Z",
        macosShortcut: "Cmd+K Z",
        linuxShortcut: "Ctrl+K Z",
        popularity: 60,
        verified: true,
        aliases: ["zen mode", "젠모드"],
        tags: ["zen", "focus"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "참조 찾기",
        description: "참조 찾기",
        windowsShortcut: "Shift+F12",
        macosShortcut: "Shift+F12",
        linuxShortcut: "Shift+F12",
        popularity: 75,
        verified: true,
        aliases: ["find references", "참조찾기"],
        tags: ["reference", "find"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "심볼 이름 변경",
        description: "심볼 이름 변경",
        windowsShortcut: "F2",
        macosShortcut: "F2",
        linuxShortcut: "F2",
        popularity: 80,
        verified: true,
        aliases: ["rename symbol", "이름변경"],
        tags: ["rename", "symbol"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "소스 코드 보기",
        description: "소스 코드 보기",
        windowsShortcut: "Ctrl+Shift+E",
        macosShortcut: "Cmd+Shift+E",
        linuxShortcut: "Ctrl+Shift+E",
        popularity: 85,
        verified: true,
        aliases: ["show explorer", "탐색기보기"],
        tags: ["explorer", "view"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "소스 제어",
        description: "소스 제어 보기",
        windowsShortcut: "Ctrl+Shift+G",
        macosShortcut: "Cmd+Shift+G",
        linuxShortcut: "Ctrl+Shift+G",
        popularity: 80,
        verified: true,
        aliases: ["show source control", "소스제어"],
        tags: ["git", "source"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "디버그",
        description: "디버그 보기",
        windowsShortcut: "Ctrl+Shift+D",
        macosShortcut: "Cmd+Shift+D",
        linuxShortcut: "Ctrl+Shift+D",
        popularity: 75,
        verified: true,
        aliases: ["show debug", "디버그보기"],
        tags: ["debug", "view"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "디버그 시작",
        description: "디버그 시작",
        windowsShortcut: "F5",
        macosShortcut: "F5",
        linuxShortcut: "F5",
        popularity: 80,
        verified: true,
        aliases: ["start debugging", "디버그시작"],
        tags: ["debug", "start"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "중단점 토글",
        description: "중단점 토글",
        windowsShortcut: "F9",
        macosShortcut: "F9",
        linuxShortcut: "F9",
        popularity: 75,
        verified: true,
        aliases: ["toggle breakpoint", "중단점토글"],
        tags: ["breakpoint", "debug"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "단계 실행",
        description: "단계 실행",
        windowsShortcut: "F10",
        macosShortcut: "F10",
        linuxShortcut: "F10",
        popularity: 70,
        verified: true,
        aliases: ["step over", "단계실행"],
        tags: ["debug", "step"]
      },
      {
        tool: "Visual Studio Code",
        category: "ide",
        title: "단계 진입",
        description: "단계 진입",
        windowsShortcut: "F11",
        macosShortcut: "F11",
        linuxShortcut: "F11",
        popularity: 65,
        verified: true,
        aliases: ["step into", "단계진입"],
        tags: ["debug", "step"]
      },

      // More comprehensive Excel shortcuts
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "자동 합계",
        description: "자동 합계 추가",
        windowsShortcut: "Alt+=",
        macosShortcut: "Cmd+=",
        linuxShortcut: "Alt+=",
        popularity: 90,
        verified: true,
        aliases: ["auto sum", "자동합계"],
        tags: ["sum", "formula"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "필터 토글",
        description: "자동 필터 토글",
        windowsShortcut: "Ctrl+Shift+L",
        macosShortcut: "Cmd+Shift+L",
        linuxShortcut: "Ctrl+Shift+L",
        popularity: 85,
        verified: true,
        aliases: ["toggle filter", "필터토글"],
        tags: ["filter", "data"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "정렬 대화상자",
        description: "정렬 대화상자 열기",
        windowsShortcut: "Ctrl+Shift+L",
        macosShortcut: "Cmd+Shift+L",
        linuxShortcut: "Ctrl+Shift+L",
        popularity: 75,
        verified: true,
        aliases: ["sort dialog", "정렬대화상자"],
        tags: ["sort", "data"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "차트 삽입",
        description: "차트 삽입",
        windowsShortcut: "F11",
        macosShortcut: "F11",
        linuxShortcut: "F11",
        popularity: 70,
        verified: true,
        aliases: ["insert chart", "차트삽입"],
        tags: ["chart", "insert"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "이름 정의",
        description: "이름 정의 대화상자",
        windowsShortcut: "Ctrl+F3",
        macosShortcut: "Cmd+F3",
        linuxShortcut: "Ctrl+F3",
        popularity: 60,
        verified: true,
        aliases: ["define name", "이름정의"],
        tags: ["name", "define"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "셀 서식",
        description: "셀 서식 대화상자",
        windowsShortcut: "Ctrl+1",
        macosShortcut: "Cmd+1",
        linuxShortcut: "Ctrl+1",
        popularity: 85,
        verified: true,
        aliases: ["format cells", "셀서식"],
        tags: ["format", "cells"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "행 삽입",
        description: "행 삽입",
        windowsShortcut: "Ctrl+Shift++",
        macosShortcut: "Cmd+Shift++",
        linuxShortcut: "Ctrl+Shift++",
        popularity: 80,
        verified: true,
        aliases: ["insert row", "행삽입"],
        tags: ["row", "insert"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "열 삽입",
        description: "열 삽입",
        windowsShortcut: "Ctrl+Shift++",
        macosShortcut: "Cmd+Shift++",
        linuxShortcut: "Ctrl+Shift++",
        popularity: 75,
        verified: true,
        aliases: ["insert column", "열삽입"],
        tags: ["column", "insert"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "행 삭제",
        description: "행 삭제",
        windowsShortcut: "Ctrl+-",
        macosShortcut: "Cmd+-",
        linuxShortcut: "Ctrl+-",
        popularity: 75,
        verified: true,
        aliases: ["delete row", "행삭제"],
        tags: ["row", "delete"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "열 삭제",
        description: "열 삭제",
        windowsShortcut: "Ctrl+-",
        macosShortcut: "Cmd+-",
        linuxShortcut: "Ctrl+-",
        popularity: 70,
        verified: true,
        aliases: ["delete column", "열삭제"],
        tags: ["column", "delete"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "셀 내용 지우기",
        description: "셀 내용 지우기",
        windowsShortcut: "Delete",
        macosShortcut: "Delete",
        linuxShortcut: "Delete",
        popularity: 90,
        verified: true,
        aliases: ["clear cell", "셀지우기"],
        tags: ["clear", "cell"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "수식 입력",
        description: "수식 입력 시작",
        windowsShortcut: "=",
        macosShortcut: "=",
        linuxShortcut: "=",
        popularity: 95,
        verified: true,
        aliases: ["enter formula", "수식입력"],
        tags: ["formula", "enter"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "절대 참조",
        description: "절대/상대 참조 토글",
        windowsShortcut: "F4",
        macosShortcut: "F4",
        linuxShortcut: "F4",
        popularity: 80,
        verified: true,
        aliases: ["absolute reference", "절대참조"],
        tags: ["reference", "absolute"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "통계 함수",
        description: "함수 마법사",
        windowsShortcut: "Shift+F3",
        macosShortcut: "Shift+F3",
        linuxShortcut: "Shift+F3",
        popularity: 70,
        verified: true,
        aliases: ["function wizard", "함수마법사"],
        tags: ["function", "wizard"]
      },
      {
        tool: "Microsoft Excel",
        category: "office",
        title: "피벗 테이블",
        description: "피벗 테이블 생성",
        windowsShortcut: "Alt+N+V",
        macosShortcut: "Cmd+Option+P",
        linuxShortcut: "Alt+N+V",
        popularity: 75,
        verified: true,
        aliases: ["pivot table", "피벗테이블"],
        tags: ["pivot", "table"]
      },

      // More comprehensive Chrome shortcuts
      {
        tool: "Google Chrome",
        category: "browser",
        title: "개발자 도구",
        description: "개발자 도구 열기",
        windowsShortcut: "F12",
        macosShortcut: "Cmd+Option+I",
        linuxShortcut: "F12",
        popularity: 85,
        verified: true,
        aliases: ["developer tools", "개발자도구"],
        tags: ["developer", "tools"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "자바스크립트 콘솔",
        description: "자바스크립트 콘솔 열기",
        windowsShortcut: "Ctrl+Shift+J",
        macosShortcut: "Cmd+Option+J",
        linuxShortcut: "Ctrl+Shift+J",
        popularity: 80,
        verified: true,
        aliases: ["javascript console", "자바스크립트콘솔"],
        tags: ["javascript", "console"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "소스 보기",
        description: "페이지 소스 보기",
        windowsShortcut: "Ctrl+U",
        macosShortcut: "Cmd+U",
        linuxShortcut: "Ctrl+U",
        popularity: 75,
        verified: true,
        aliases: ["view source", "소스보기"],
        tags: ["source", "view"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "검사 도구",
        description: "요소 검사",
        windowsShortcut: "Ctrl+Shift+C",
        macosShortcut: "Cmd+Shift+C",
        linuxShortcut: "Ctrl+Shift+C",
        popularity: 80,
        verified: true,
        aliases: ["inspect element", "요소검사"],
        tags: ["inspect", "element"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "캐시 새로고침",
        description: "캐시 무시하고 새로고침",
        windowsShortcut: "Ctrl+Shift+R",
        macosShortcut: "Cmd+Shift+R",
        linuxShortcut: "Ctrl+Shift+R",
        popularity: 85,
        verified: true,
        aliases: ["hard refresh", "캐시새로고침"],
        tags: ["refresh", "cache"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "홈페이지로",
        description: "홈페이지로 이동",
        windowsShortcut: "Alt+Home",
        macosShortcut: "Cmd+Home",
        linuxShortcut: "Alt+Home",
        popularity: 60,
        verified: true,
        aliases: ["go to home", "홈페이지"],
        tags: ["home", "page"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "탭 고정",
        description: "탭 고정/해제",
        windowsShortcut: "Ctrl+Shift+P",
        macosShortcut: "Cmd+Shift+P",
        linuxShortcut: "Ctrl+Shift+P",
        popularity: 70,
        verified: true,
        aliases: ["pin tab", "탭고정"],
        tags: ["tab", "pin"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "페이지 내 검색",
        description: "페이지 내 검색 다음",
        windowsShortcut: "Ctrl+G",
        macosShortcut: "Cmd+G",
        linuxShortcut: "Ctrl+G",
        popularity: 80,
        verified: true,
        aliases: ["find next", "다음검색"],
        tags: ["find", "next"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "페이지 내 검색 이전",
        description: "페이지 내 검색 이전",
        windowsShortcut: "Ctrl+Shift+G",
        macosShortcut: "Cmd+Shift+G",
        linuxShortcut: "Ctrl+Shift+G",
        popularity: 75,
        verified: true,
        aliases: ["find previous", "이전검색"],
        tags: ["find", "previous"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "다운로드 페이지",
        description: "다운로드 페이지 열기",
        windowsShortcut: "Ctrl+J",
        macosShortcut: "Cmd+J",
        linuxShortcut: "Ctrl+J",
        popularity: 80,
        verified: true,
        aliases: ["downloads page", "다운로드페이지"],
        tags: ["downloads", "page"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "확장 프로그램",
        description: "확장 프로그램 관리",
        windowsShortcut: "Ctrl+Shift+Delete",
        macosShortcut: "Cmd+Shift+Delete",
        linuxShortcut: "Ctrl+Shift+Delete",
        popularity: 60,
        verified: true,
        aliases: ["manage extensions", "확장프로그램관리"],
        tags: ["extensions", "manage"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "방문 기록",
        description: "방문 기록 페이지",
        windowsShortcut: "Ctrl+H",
        macosShortcut: "Cmd+H",
        linuxShortcut: "Ctrl+H",
        popularity: 75,
        verified: true,
        aliases: ["history page", "방문기록"],
        tags: ["history", "page"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "탭 복제",
        description: "현재 탭 복제",
        windowsShortcut: "Ctrl+Shift+K",
        macosShortcut: "Cmd+Shift+K",
        linuxShortcut: "Ctrl+Shift+K",
        popularity: 70,
        verified: true,
        aliases: ["duplicate tab", "탭복제"],
        tags: ["tab", "duplicate"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "탭 그룹",
        description: "탭 그룹 만들기",
        windowsShortcut: "Ctrl+Shift+A",
        macosShortcut: "Cmd+Shift+A",
        linuxShortcut: "Ctrl+Shift+A",
        popularity: 65,
        verified: true,
        aliases: ["tab group", "탭그룹"],
        tags: ["tab", "group"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "검색 엔진",
        description: "검색 엔진 빠른 사용",
        windowsShortcut: "Ctrl+K",
        macosShortcut: "Cmd+K",
        linuxShortcut: "Ctrl+K",
        popularity: 80,
        verified: true,
        aliases: ["search engine", "검색엔진"],
        tags: ["search", "engine"]
      },
      {
        tool: "Google Chrome",
        category: "browser",
        title: "작업 관리자",
        description: "Chrome 작업 관리자",
        windowsShortcut: "Shift+Esc",
        macosShortcut: "Shift+Esc",
        linuxShortcut: "Shift+Esc",
        popularity: 60,
        verified: true,
        aliases: ["task manager", "작업관리자"],
        tags: ["task", "manager"]
      },

      // More comprehensive Photoshop shortcuts
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "새 레이어",
        description: "새 레이어 만들기",
        windowsShortcut: "Ctrl+Shift+N",
        macosShortcut: "Cmd+Shift+N",
        linuxShortcut: "Ctrl+Shift+N",
        popularity: 90,
        verified: true,
        aliases: ["new layer", "새레이어"],
        tags: ["layer", "new"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "레이어 복제",
        description: "레이어 복제",
        windowsShortcut: "Ctrl+J",
        macosShortcut: "Cmd+J",
        linuxShortcut: "Ctrl+J",
        popularity: 85,
        verified: true,
        aliases: ["duplicate layer", "레이어복제"],
        tags: ["layer", "duplicate"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "레이어 그룹",
        description: "레이어 그룹 만들기",
        windowsShortcut: "Ctrl+G",
        macosShortcut: "Cmd+G",
        linuxShortcut: "Ctrl+G",
        popularity: 80,
        verified: true,
        aliases: ["group layers", "레이어그룹"],
        tags: ["layer", "group"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "색상 균형",
        description: "색상 균형 조정",
        windowsShortcut: "Ctrl+B",
        macosShortcut: "Cmd+B",
        linuxShortcut: "Ctrl+B",
        popularity: 75,
        verified: true,
        aliases: ["color balance", "색상균형"],
        tags: ["color", "balance"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "곡선 조정",
        description: "곡선 조정",
        windowsShortcut: "Ctrl+M",
        macosShortcut: "Cmd+M",
        linuxShortcut: "Ctrl+M",
        popularity: 80,
        verified: true,
        aliases: ["curves", "곡선조정"],
        tags: ["curves", "adjustment"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "레벨 조정",
        description: "레벨 조정",
        windowsShortcut: "Ctrl+L",
        macosShortcut: "Cmd+L",
        linuxShortcut: "Ctrl+L",
        popularity: 85,
        verified: true,
        aliases: ["levels", "레벨조정"],
        tags: ["levels", "adjustment"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "밝기/대비",
        description: "밝기/대비 조정",
        windowsShortcut: "Ctrl+Alt+B",
        macosShortcut: "Cmd+Option+B",
        linuxShortcut: "Ctrl+Alt+B",
        popularity: 70,
        verified: true,
        aliases: ["brightness contrast", "밝기대비"],
        tags: ["brightness", "contrast"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "이미지 크기",
        description: "이미지 크기 조정",
        windowsShortcut: "Ctrl+Alt+I",
        macosShortcut: "Cmd+Option+I",
        linuxShortcut: "Ctrl+Alt+I",
        popularity: 85,
        verified: true,
        aliases: ["image size", "이미지크기"],
        tags: ["image", "size"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "캔버스 크기",
        description: "캔버스 크기 조정",
        windowsShortcut: "Ctrl+Alt+C",
        macosShortcut: "Cmd+Option+C",
        linuxShortcut: "Ctrl+Alt+C",
        popularity: 80,
        verified: true,
        aliases: ["canvas size", "캔버스크기"],
        tags: ["canvas", "size"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "필터 반복",
        description: "마지막 필터 반복",
        windowsShortcut: "Ctrl+F",
        macosShortcut: "Cmd+F",
        linuxShortcut: "Ctrl+F",
        popularity: 75,
        verified: true,
        aliases: ["repeat filter", "필터반복"],
        tags: ["filter", "repeat"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "텍스트 도구",
        description: "텍스트 도구 선택",
        windowsShortcut: "T",
        macosShortcut: "T",
        linuxShortcut: "T",
        popularity: 85,
        verified: true,
        aliases: ["text tool", "텍스트도구"],
        tags: ["text", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "그라데이션 도구",
        description: "그라데이션 도구 선택",
        windowsShortcut: "G",
        macosShortcut: "G",
        linuxShortcut: "G",
        popularity: 80,
        verified: true,
        aliases: ["gradient tool", "그라데이션도구"],
        tags: ["gradient", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "페인트 통 도구",
        description: "페인트 통 도구 선택",
        windowsShortcut: "G",
        macosShortcut: "G",
        linuxShortcut: "G",
        popularity: 75,
        verified: true,
        aliases: ["paint bucket", "페인트통"],
        tags: ["paint", "bucket"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "펜 도구",
        description: "펜 도구 선택",
        windowsShortcut: "P",
        macosShortcut: "P",
        linuxShortcut: "P",
        popularity: 80,
        verified: true,
        aliases: ["pen tool", "펜도구"],
        tags: ["pen", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "도형 도구",
        description: "도형 도구 선택",
        windowsShortcut: "U",
        macosShortcut: "U",
        linuxShortcut: "U",
        popularity: 75,
        verified: true,
        aliases: ["shape tool", "도형도구"],
        tags: ["shape", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "손 도구",
        description: "손 도구 선택",
        windowsShortcut: "H",
        macosShortcut: "H",
        linuxShortcut: "H",
        popularity: 80,
        verified: true,
        aliases: ["hand tool", "손도구"],
        tags: ["hand", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "회전 도구",
        description: "회전 도구 선택",
        windowsShortcut: "R",
        macosShortcut: "R",
        linuxShortcut: "R",
        popularity: 70,
        verified: true,
        aliases: ["rotate tool", "회전도구"],
        tags: ["rotate", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "지우개 도구",
        description: "지우개 도구 선택",
        windowsShortcut: "E",
        macosShortcut: "E",
        linuxShortcut: "E",
        popularity: 85,
        verified: true,
        aliases: ["eraser tool", "지우개도구"],
        tags: ["eraser", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "클론 도구",
        description: "클론 도구 선택",
        windowsShortcut: "S",
        macosShortcut: "S",
        linuxShortcut: "S",
        popularity: 80,
        verified: true,
        aliases: ["clone tool", "클론도구"],
        tags: ["clone", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "선명 도구",
        description: "선명 도구 선택",
        windowsShortcut: "R",
        macosShortcut: "R",
        linuxShortcut: "R",
        popularity: 70,
        verified: true,
        aliases: ["sharpen tool", "선명도구"],
        tags: ["sharpen", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "번짐 도구",
        description: "번짐 도구 선택",
        windowsShortcut: "R",
        macosShortcut: "R",
        linuxShortcut: "R",
        popularity: 65,
        verified: true,
        aliases: ["smudge tool", "번짐도구"],
        tags: ["smudge", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "닷지 도구",
        description: "닷지 도구 선택",
        windowsShortcut: "O",
        macosShortcut: "O",
        linuxShortcut: "O",
        popularity: 70,
        verified: true,
        aliases: ["dodge tool", "닷지도구"],
        tags: ["dodge", "tool"]
      },
      {
        tool: "Adobe Photoshop",
        category: "design",
        title: "번 도구",
        description: "번 도구 선택",
        windowsShortcut: "O",
        macosShortcut: "O",
        linuxShortcut: "O",
        popularity: 65,
        verified: true,
        aliases: ["burn tool", "번도구"],
        tags: ["burn", "tool"]
      }
    ];

    initialShortcuts.forEach(shortcut => {
      const id = this.currentShortcutId++;
      const newShortcut: Shortcut = {
        id,
        ...shortcut,
        windowsShortcut: shortcut.windowsShortcut || null,
        macosShortcut: shortcut.macosShortcut || null,
        linuxShortcut: shortcut.linuxShortcut || null,
        popularity: shortcut.popularity || 0,
        verified: shortcut.verified || false,
        aliases: shortcut.aliases || null,
        tags: shortcut.tags || null
      };
      this.shortcuts.set(id, newShortcut);
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
      windowsShortcut: shortcut.windowsShortcut || null,
      macosShortcut: shortcut.macosShortcut || null,
      linuxShortcut: shortcut.linuxShortcut || null,
      popularity: 0,
      verified: shortcut.verified || false,
      aliases: shortcut.aliases || null,
      tags: shortcut.tags || null
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
      shortcutId: favorite.shortcutId || null,
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
