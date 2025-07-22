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

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test data
const testShortcuts = [
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
  },
  {
    id: 3,
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
  }
];

// API Routes
app.get('/api/shortcuts', async (req, res) => {
  try {
    res.json(testShortcuts);
  } catch (error) {
    console.error('Error fetching shortcuts:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts' });
  }
});

app.get('/api/shortcuts/popular', async (req, res) => {
  try {
    res.json(testShortcuts.slice(0, 2));
  } catch (error) {
    console.error('Error fetching popular shortcuts:', error);
    res.status(500).json({ error: 'Failed to fetch popular shortcuts' });
  }
});

app.get('/api/shortcuts/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const filtered = testShortcuts.filter(s => 
      s.title.toLowerCase().includes(q.toLowerCase()) ||
      s.description.toLowerCase().includes(q.toLowerCase())
    );
    res.json(filtered);
  } catch (error) {
    console.error('Error searching shortcuts:', error);
    res.status(500).json({ error: 'Failed to search shortcuts' });
  }
});

app.get('/api/shortcuts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const filtered = testShortcuts.filter(s => s.category === category);
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching shortcuts by category:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts by category' });
  }
});

app.get('/api/shortcuts/tool/:tool', async (req, res) => {
  try {
    const { tool } = req.params;
    const filtered = testShortcuts.filter(s => s.tool === tool);
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching shortcuts by tool:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts by tool' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export handler for Netlify Functions
export const handler = serverless(app);