import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const shortcuts = pgTable("shortcuts", {
  id: serial("id").primaryKey(),
  tool: text("tool").notNull(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  windowsShortcut: text("windows_shortcut"),
  macosShortcut: text("macos_shortcut"),
  linuxShortcut: text("linux_shortcut"),
  popularity: integer("popularity").default(0),
  verified: boolean("verified").default(false),
  aliases: text("aliases").array(),
  tags: text("tags").array(),
});

export const favoriteShortcuts = pgTable("favorite_shortcuts", {
  id: serial("id").primaryKey(),
  shortcutId: integer("shortcut_id").references(() => shortcuts.id),
  userId: text("user_id").notNull(), // For future user system
  createdAt: text("created_at").default("now()"),
});

export const shortcutUsage = pgTable("shortcut_usage", {
  id: serial("id").primaryKey(),
  shortcutId: integer("shortcut_id").references(() => shortcuts.id),
  usageCount: integer("usage_count").default(0),
  lastUsed: text("last_used").default("now()"),
});

export const insertShortcutSchema = createInsertSchema(shortcuts).omit({
  id: true,
  popularity: true,
});

export const insertFavoriteShortcutSchema = createInsertSchema(favoriteShortcuts).omit({
  id: true,
  createdAt: true,
});

export const insertShortcutUsageSchema = createInsertSchema(shortcutUsage).omit({
  id: true,
  lastUsed: true,
});

export type Shortcut = typeof shortcuts.$inferSelect;
export type InsertShortcut = z.infer<typeof insertShortcutSchema>;
export type FavoriteShortcut = typeof favoriteShortcuts.$inferSelect;
export type InsertFavoriteShortcut = z.infer<typeof insertFavoriteShortcutSchema>;
export type ShortcutUsage = typeof shortcutUsage.$inferSelect;
export type InsertShortcutUsage = z.infer<typeof insertShortcutUsageSchema>;
