import express from 'express';
import serverless from 'serverless-http';
import { getShortcutsWithIds } from './shortcuts-data.js';

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

// Get full shortcuts data with IDs
const shortcuts = getShortcutsWithIds();

// API Routes
app.get('/api/shortcuts', async (req, res) => {
  try {
    res.json(shortcuts);
  } catch (error) {
    console.error('Error fetching shortcuts:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts' });
  }
});

app.get('/api/shortcuts/popular', async (req, res) => {
  try {
    // 인기도(popularity)에 따라 정렬하고 상위 10개 반환
    const popular = [...shortcuts].sort((a, b) => b.popularity - a.popularity).slice(0, 10);
    res.json(popular);
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
    const filtered = shortcuts.filter(s => 
      s.title.toLowerCase().includes(q.toLowerCase()) ||
      s.description.toLowerCase().includes(q.toLowerCase()) ||
      (s.aliases && s.aliases.some(alias => alias.toLowerCase().includes(q.toLowerCase())))
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
    const filtered = shortcuts.filter(s => s.category === category);
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching shortcuts by category:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts by category' });
  }
});

app.get('/api/shortcuts/tool/:tool', async (req, res) => {
  try {
    const { tool } = req.params;
    const filtered = shortcuts.filter(s => s.tool === tool);
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching shortcuts by tool:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts by tool' });
  }
});

// 추가 API 엔드포인트
app.get('/api/shortcuts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const shortcut = shortcuts.find(s => s.id === parseInt(id));
    if (!shortcut) {
      return res.status(404).json({ error: 'Shortcut not found' });
    }
    res.json(shortcut);
  } catch (error) {
    console.error('Error fetching shortcut by ID:', error);
    res.status(500).json({ error: 'Failed to fetch shortcut' });
  }
});

app.get('/api/tools', async (req, res) => {
  try {
    // 중복 제거된 도구 목록 반환
    const tools = [...new Set(shortcuts.map(s => s.tool))];
    res.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json({ error: 'Failed to fetch tools' });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    // 중복 제거된 카테고리 목록 반환
    const categories = [...new Set(shortcuts.map(s => s.category))];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    shortcuts: shortcuts.length
  });
});

// Export handler for Netlify Functions
export const handler = serverless(app);