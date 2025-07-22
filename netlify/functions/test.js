import express from 'express';
import serverless from 'serverless-http';

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Basic shortcuts data (inline)
const basicShortcuts = [
  {
    id: 1,
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
    id: 2,
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
  }
];

app.get('/api/shortcuts', (req, res) => {
  res.json(basicShortcuts);
});

app.get('/api/shortcuts/popular', (req, res) => {
  res.json(basicShortcuts);
});

// Export handler for Netlify Functions
export const handler = serverless(app);
