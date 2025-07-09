import { useMemo } from "react";
import type { Shortcut } from "@shared/schema";

export function useSearch(
  shortcuts: Shortcut[],
  query: string,
  category: string,
  selectedOS: string[],
  showFavoritesOnly: boolean,
  favorites: number[]
) {
  const filteredShortcuts = useMemo(() => {
    if (!shortcuts) return [];

    let filtered = shortcuts;

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(shortcut => shortcut.category === category);
    }

    // Filter by OS (show shortcuts that have at least one of the selected OS)
    if (selectedOS.length > 0) {
      filtered = filtered.filter(shortcut => {
        return selectedOS.some(os => {
          switch (os) {
            case "windows":
              return shortcut.windowsShortcut;
            case "macos":
              return shortcut.macosShortcut;
            case "linux":
              return shortcut.linuxShortcut;
            default:
              return false;
          }
        });
      });
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(shortcut => favorites.includes(shortcut.id));
    }

    // Filter by search query
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(shortcut => {
        const matchesTitle = shortcut.title.toLowerCase().includes(searchTerm);
        const matchesDescription = shortcut.description.toLowerCase().includes(searchTerm);
        const matchesTool = shortcut.tool.toLowerCase().includes(searchTerm);
        const matchesShortcut = [
          shortcut.windowsShortcut,
          shortcut.macosShortcut,
          shortcut.linuxShortcut
        ].some(s => s?.toLowerCase().includes(searchTerm));
        const matchesAliases = shortcut.aliases?.some(alias => 
          alias.toLowerCase().includes(searchTerm)
        );
        const matchesTags = shortcut.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm)
        );

        // Special Korean-English matching
        const specialMatches = (
          (searchTerm === "복사" && shortcut.windowsShortcut?.toLowerCase().includes("ctrl+c")) ||
          (searchTerm === "copy" && shortcut.title.includes("복사")) ||
          (searchTerm === "붙여넣기" && shortcut.windowsShortcut?.toLowerCase().includes("ctrl+v")) ||
          (searchTerm === "paste" && shortcut.title.includes("붙여넣기")) ||
          (searchTerm === "저장" && shortcut.windowsShortcut?.toLowerCase().includes("ctrl+s")) ||
          (searchTerm === "save" && shortcut.title.includes("저장"))
        );

        return matchesTitle || matchesDescription || matchesTool || matchesShortcut || 
               matchesAliases || matchesTags || specialMatches;
      });
    }

    // Sort by popularity
    return filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [shortcuts, query, category, selectedOS, showFavoritesOnly, favorites]);

  return {
    filteredShortcuts,
  };
}
