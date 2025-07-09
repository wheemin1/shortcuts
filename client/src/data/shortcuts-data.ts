// Static shortcuts data for client-side use
export const ALL_SHORTCUTS = [
  // Windows shortcuts
  {
    id: 1,
    tool: "Windows",
    category: "os",
    title: "복사",
    description: "선택한 항목 복사",
    windowsShortcut: "Ctrl+C",
    macosShortcut: "Cmd+C",
    linuxShortcut: "Ctrl+C",
    popularity: 95,
    verified: true,
    aliases: ["copy", "복사"],
    tags: ["copy", "clipboard"]
  },
  {
    id: 2,
    tool: "Windows",
    category: "os",
    title: "붙여넣기",
    description: "복사한 항목 붙여넣기",
    windowsShortcut: "Ctrl+V",
    macosShortcut: "Cmd+V",
    linuxShortcut: "Ctrl+V",
    popularity: 95,
    verified: true,
    aliases: ["paste", "붙여넣기"],
    tags: ["paste", "clipboard"]
  },
  {
    id: 3,
    tool: "Windows",
    category: "os",
    title: "잘라내기",
    description: "선택한 항목 잘라내기",
    windowsShortcut: "Ctrl+X",
    macosShortcut: "Cmd+X",
    linuxShortcut: "Ctrl+X",
    popularity: 90,
    verified: true,
    aliases: ["cut", "잘라내기"],
    tags: ["cut", "clipboard"]
  },
  {
    id: 4,
    tool: "Windows",
    category: "os",
    title: "실행 취소",
    description: "마지막 작업 실행 취소",
    windowsShortcut: "Ctrl+Z",
    macosShortcut: "Cmd+Z",
    linuxShortcut: "Ctrl+Z",
    popularity: 90,
    verified: true,
    aliases: ["undo", "실행취소"],
    tags: ["undo", "revert"]
  },
  {
    id: 5,
    tool: "Windows",
    category: "os",
    title: "다시 실행",
    description: "실행 취소한 작업 다시 실행",
    windowsShortcut: "Ctrl+Y",
    macosShortcut: "Cmd+Shift+Z",
    linuxShortcut: "Ctrl+Y",
    popularity: 85,
    verified: true,
    aliases: ["redo", "다시실행"],
    tags: ["redo", "repeat"]
  },
  {
    id: 6,
    tool: "Windows",
    category: "os",
    title: "모두 선택",
    description: "모든 항목 선택",
    windowsShortcut: "Ctrl+A",
    macosShortcut: "Cmd+A",
    linuxShortcut: "Ctrl+A",
    popularity: 90,
    verified: true,
    aliases: ["select all", "모두선택"],
    tags: ["select", "all"]
  },
  {
    id: 7,
    tool: "Windows",
    category: "os",
    title: "저장",
    description: "현재 문서 저장",
    windowsShortcut: "Ctrl+S",
    macosShortcut: "Cmd+S",
    linuxShortcut: "Ctrl+S",
    popularity: 95,
    verified: true,
    aliases: ["save", "저장"],
    tags: ["save", "file"]
  },
  {
    id: 8,
    tool: "Windows",
    category: "os",
    title: "열기",
    description: "파일 열기",
    windowsShortcut: "Ctrl+O",
    macosShortcut: "Cmd+O",
    linuxShortcut: "Ctrl+O",
    popularity: 85,
    verified: true,
    aliases: ["open", "열기"],
    tags: ["open", "file"]
  },
  {
    id: 9,
    tool: "Windows",
    category: "os",
    title: "새로 만들기",
    description: "새 문서 만들기",
    windowsShortcut: "Ctrl+N",
    macosShortcut: "Cmd+N",
    linuxShortcut: "Ctrl+N",
    popularity: 80,
    verified: true,
    aliases: ["new", "새로만들기"],
    tags: ["new", "create"]
  },
  {
    id: 10,
    tool: "Windows",
    category: "os",
    title: "인쇄",
    description: "현재 문서 인쇄",
    windowsShortcut: "Ctrl+P",
    macosShortcut: "Cmd+P",
    linuxShortcut: "Ctrl+P",
    popularity: 80,
    verified: true,
    aliases: ["print", "인쇄"],
    tags: ["print", "document"]
  },
  // Add more shortcuts here...
  // For demo purposes, I'll add just a few key ones
  {
    id: 11,
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
    tags: ["tab", "new"]
  },
  {
    id: 12,
    tool: "Google Chrome",
    category: "browser",
    title: "새 창",
    description: "새 창 열기",
    windowsShortcut: "Ctrl+N",
    macosShortcut: "Cmd+N",
    linuxShortcut: "Ctrl+N",
    popularity: 85,
    verified: true,
    aliases: ["new window", "새창"],
    tags: ["window", "new"]
  },
  {
    id: 13,
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
    id: 14,
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
    id: 15,
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
  }
];

// Export types for consistency
export interface Shortcut {
  id: number;
  tool: string;
  category: string;
  title: string;
  description: string;
  windowsShortcut: string | null;
  macosShortcut: string | null;
  linuxShortcut: string | null;
  popularity: number;
  verified: boolean;
  aliases: string[];
  tags: string[];
}

// Export helper functions
export const getShortcuts = (): Shortcut[] => ALL_SHORTCUTS;
export const getShortcutsByCategory = (category: string): Shortcut[] => 
  ALL_SHORTCUTS.filter(s => s.category === category);
export const getShortcutsByTool = (tool: string): Shortcut[] => 
  ALL_SHORTCUTS.filter(s => s.tool === tool);
export const getPopularShortcuts = (limit: number = 10): Shortcut[] => 
  ALL_SHORTCUTS.sort((a, b) => b.popularity - a.popularity).slice(0, limit);
export const searchShortcuts = (query: string): Shortcut[] => {
  const lowerQuery = query.toLowerCase();
  return ALL_SHORTCUTS.filter(s => 
    s.title.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.tool.toLowerCase().includes(lowerQuery) ||
    s.aliases.some(alias => alias.toLowerCase().includes(lowerQuery)) ||
    s.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};