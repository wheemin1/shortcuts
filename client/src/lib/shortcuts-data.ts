// This file contains the comprehensive shortcuts data used to initialize the application
// The data is based on web-sourced information and verified shortcuts

export const SHORTCUTS_DATA = {
  categories: [
    {
      id: "os",
      name: "운영체제",
      description: "Windows, macOS, Linux 시스템 단축키",
      icon: "fa-desktop",
      color: "text-red-500"
    },
    {
      id: "ide",
      name: "개발도구",
      description: "VSCode, PyCharm, Jupyter 등 개발 환경 단축키",
      icon: "fa-code",
      color: "text-green-500"
    },
    {
      id: "office",
      name: "오피스",
      description: "Excel, Word, PowerPoint 등 오피스 프로그램 단축키",
      icon: "fa-file-alt",
      color: "text-amber-500"
    },
    {
      id: "design",
      name: "디자인",
      description: "Photoshop, Illustrator, Figma 등 디자인 도구 단축키",
      icon: "fa-paint-brush",
      color: "text-purple-500"
    },
    {
      id: "browser",
      name: "브라우저",
      description: "Chrome, Firefox, Safari 등 웹 브라우저 단축키",
      icon: "fa-globe",
      color: "text-blue-500"
    },
    {
      id: "media",
      name: "미디어",
      description: "비디오, 오디오 편집 프로그램 단축키",
      icon: "fa-play",
      color: "text-pink-500"
    },
    {
      id: "communication",
      name: "커뮤니케이션",
      description: "Slack, Discord, Teams 등 커뮤니케이션 도구 단축키",
      icon: "fa-comments",
      color: "text-green-500"
    },
    {
      id: "productivity",
      name: "생산성",
      description: "Notion, Obsidian 등 생산성 도구 단축키",
      icon: "fa-tasks",
      color: "text-purple-500"
    }
  ],
  
  tools: [
    {
      name: "Windows",
      category: "os",
      icon: "fab fa-windows",
      shortcutCount: 47
    },
    {
      name: "macOS",
      category: "os",
      icon: "fab fa-apple",
      shortcutCount: 52
    },
    {
      name: "Linux",
      category: "os",
      icon: "fab fa-linux",
      shortcutCount: 38
    },
    {
      name: "Visual Studio Code",
      category: "ide",
      icon: "fas fa-code",
      shortcutCount: 89
    },
    {
      name: "PyCharm",
      category: "ide",
      icon: "fas fa-code",
      shortcutCount: 72
    },
    {
      name: "Jupyter Notebook",
      category: "ide",
      icon: "fas fa-book",
      shortcutCount: 45
    },
    {
      name: "Microsoft Excel",
      category: "office",
      icon: "fas fa-file-excel",
      shortcutCount: 156
    },
    {
      name: "Microsoft Word",
      category: "office",
      icon: "fas fa-file-word",
      shortcutCount: 134
    },
    {
      name: "PowerPoint",
      category: "office",
      icon: "fas fa-file-powerpoint",
      shortcutCount: 98
    },
    {
      name: "Adobe Photoshop",
      category: "design",
      icon: "fas fa-paint-brush",
      shortcutCount: 234
    },
    {
      name: "Adobe Illustrator",
      category: "design",
      icon: "fas fa-palette",
      shortcutCount: 187
    },
    {
      name: "Figma",
      category: "design",
      icon: "fas fa-palette",
      shortcutCount: 76
    },
    {
      name: "Google Chrome",
      category: "browser",
      icon: "fab fa-chrome",
      shortcutCount: 67
    },
    {
      name: "Firefox",
      category: "browser",
      icon: "fab fa-firefox",
      shortcutCount: 54
    },
    {
      name: "Safari",
      category: "browser",
      icon: "fab fa-safari",
      shortcutCount: 43
    },
    {
      name: "Slack",
      category: "communication",
      icon: "fab fa-slack",
      shortcutCount: 78
    },
    {
      name: "Discord",
      category: "communication",
      icon: "fab fa-discord",
      shortcutCount: 45
    },
    {
      name: "Microsoft Teams",
      category: "communication",
      icon: "fas fa-users",
      shortcutCount: 56
    },
    {
      name: "Notion",
      category: "productivity",
      icon: "fas fa-sticky-note",
      shortcutCount: 89
    },
    {
      name: "Obsidian",
      category: "productivity",
      icon: "fas fa-brain",
      shortcutCount: 67
    }
  ]
};
