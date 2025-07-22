import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import serverless from 'serverless-http';
import { MemStorage } from '../../server/storage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// Initialize storage
const storage = new MemStorage();

// API Routes
app.get('/api/shortcuts', async (req, res) => {
  try {
    const shortcuts = await storage.getShortcuts();
    res.json(shortcuts);
  } catch (error) {
    console.error('Error fetching shortcuts:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts' });
  }
});

app.get('/api/shortcuts/popular', async (req, res) => {
  try {
    const shortcuts = await storage.getPopularShortcuts(10);
    res.json(shortcuts);
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
    const shortcuts = await storage.searchShortcuts(q);
    res.json(shortcuts);
  } catch (error) {
    console.error('Error searching shortcuts:', error);
    res.status(500).json({ error: 'Failed to search shortcuts' });
  }
});

app.get('/api/shortcuts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const shortcuts = await storage.getShortcutsByCategory(category);
    res.json(shortcuts);
  } catch (error) {
    console.error('Error fetching shortcuts by category:', error);
    res.status(500).json({ error: 'Failed to fetch shortcuts by category' });
  }
});

app.get('/api/shortcuts/tool/:tool', async (req, res) => {
  try {
    const { tool } = req.params;
    const shortcuts = await storage.getShortcutsByTool(tool);
    res.json(shortcuts);
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