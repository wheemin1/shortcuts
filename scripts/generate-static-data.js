// Generate static data for deployment
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the shortcuts data from storage.ts
const storageFile = join(__dirname, '../server/storage.ts');
const storageContent = readFileSync(storageFile, 'utf8');

// Extract shortcuts array from the file
const shortcutsMatch = storageContent.match(/const shortcuts = \[([\s\S]*?)\];/);
if (!shortcutsMatch) {
  console.error('Could not find shortcuts data in storage.ts');
  process.exit(1);
}

// Generate the static data file
const staticDataContent = `// Generated static data for deployment
export const ALL_SHORTCUTS = [
${shortcutsMatch[1]}
];

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
};`;

// Write the static data file
const outputFile = join(__dirname, '../client/src/data/shortcuts-static.ts');
writeFileSync(outputFile, staticDataContent);

console.log('Static data generated successfully!');
console.log(`Generated ${outputFile}`);