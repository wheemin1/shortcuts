import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertShortcutSchema, insertFavoriteShortcutSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all shortcuts
  app.get("/api/shortcuts", async (req, res) => {
    try {
      const shortcuts = await storage.getShortcuts();
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shortcuts" });
    }
  });

  // Get shortcuts by category
  app.get("/api/shortcuts/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const shortcuts = await storage.getShortcutsByCategory(category);
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shortcuts by category" });
    }
  });

  // Get shortcuts by tool
  app.get("/api/shortcuts/tool/:tool", async (req, res) => {
    try {
      const { tool } = req.params;
      const shortcuts = await storage.getShortcutsByTool(tool);
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shortcuts by tool" });
    }
  });

  // Search shortcuts
  app.get("/api/shortcuts/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const shortcuts = await storage.searchShortcuts(q);
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ error: "Failed to search shortcuts" });
    }
  });

  // Get popular shortcuts
  app.get("/api/shortcuts/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const shortcuts = await storage.getPopularShortcuts(limit);
      res.json(shortcuts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular shortcuts" });
    }
  });

  // Get single shortcut
  app.get("/api/shortcuts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const shortcut = await storage.getShortcut(id);
      
      if (!shortcut) {
        return res.status(404).json({ error: "Shortcut not found" });
      }
      
      res.json(shortcut);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch shortcut" });
    }
  });

  // Create new shortcut
  app.post("/api/shortcuts", async (req, res) => {
    try {
      const shortcut = insertShortcutSchema.parse(req.body);
      const newShortcut = await storage.createShortcut(shortcut);
      res.status(201).json(newShortcut);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid shortcut data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create shortcut" });
    }
  });

  // Update shortcut
  app.put("/api/shortcuts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const shortcut = insertShortcutSchema.partial().parse(req.body);
      const updatedShortcut = await storage.updateShortcut(id, shortcut);
      
      if (!updatedShortcut) {
        return res.status(404).json({ error: "Shortcut not found" });
      }
      
      res.json(updatedShortcut);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid shortcut data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update shortcut" });
    }
  });

  // Delete shortcut
  app.delete("/api/shortcuts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteShortcut(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Shortcut not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete shortcut" });
    }
  });

  // Track shortcut usage
  app.post("/api/shortcuts/:id/usage", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementShortcutUsage(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track usage" });
    }
  });

  // Get favorite shortcuts
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const favorites = await storage.getFavoriteShortcuts(userId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // Add favorite shortcut
  app.post("/api/favorites", async (req, res) => {
    try {
      const favorite = insertFavoriteShortcutSchema.parse(req.body);
      const newFavorite = await storage.addFavoriteShortcut(favorite);
      res.status(201).json(newFavorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid favorite data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  // Remove favorite shortcut
  app.delete("/api/favorites/:shortcutId/:userId", async (req, res) => {
    try {
      const shortcutId = parseInt(req.params.shortcutId);
      const { userId } = req.params;
      const removed = await storage.removeFavoriteShortcut(shortcutId, userId);
      
      if (!removed) {
        return res.status(404).json({ error: "Favorite not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
