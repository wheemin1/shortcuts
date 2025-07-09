import { useQuery } from "@tanstack/react-query";
import type { Shortcut } from "@shared/schema";

export function useShortcuts() {
  return useQuery<Shortcut[]>({
    queryKey: ["/api/shortcuts"],
    queryFn: async () => {
      const response = await fetch("/api/shortcuts");
      if (!response.ok) {
        throw new Error("Failed to fetch shortcuts");
      }
      return response.json();
    },
  });
}

export function useShortcutsByCategory(category: string) {
  return useQuery<Shortcut[]>({
    queryKey: ["/api/shortcuts/category", category],
    queryFn: async () => {
      const response = await fetch(`/api/shortcuts/category/${category}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shortcuts by category");
      }
      return response.json();
    },
    enabled: !!category,
  });
}

export function useShortcutsByTool(tool: string) {
  return useQuery<Shortcut[]>({
    queryKey: ["/api/shortcuts/tool", tool],
    queryFn: async () => {
      const response = await fetch(`/api/shortcuts/tool/${encodeURIComponent(tool)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shortcuts by tool");
      }
      return response.json();
    },
    enabled: !!tool,
  });
}

export function useSearchShortcuts(query: string) {
  return useQuery<Shortcut[]>({
    queryKey: ["/api/shortcuts/search", query],
    queryFn: async () => {
      const response = await fetch(`/api/shortcuts/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("Failed to search shortcuts");
      }
      return response.json();
    },
    enabled: !!query && query.length > 0,
  });
}

export function usePopularShortcuts(limit: number = 10) {
  return useQuery<Shortcut[]>({
    queryKey: ["/api/shortcuts/popular", limit],
    queryFn: async () => {
      const response = await fetch(`/api/shortcuts/popular?limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch popular shortcuts");
      }
      return response.json();
    },
  });
}
