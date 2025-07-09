import { useQuery } from "@tanstack/react-query";
import { Flame, Copy, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Shortcut } from "@shared/schema";

interface PopularShortcutsProps {
  onCopyShortcut: (shortcut: string) => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export default function PopularShortcuts({
  onCopyShortcut,
  onToggleFavorite,
  isFavorite,
}: PopularShortcutsProps) {
  const { data: popularShortcuts, isLoading } = useQuery<Shortcut[]>({
    queryKey: ["/api/shortcuts/popular"],
    queryFn: async () => {
      const response = await fetch("/api/shortcuts/popular?limit=6");
      if (!response.ok) {
        throw new Error("Failed to fetch popular shortcuts");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[var(--dark-card)] rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-[var(--dark)] rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-[var(--dark)] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!popularShortcuts || popularShortcuts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[var(--dark-card)] rounded-lg shadow-sm p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
        <Flame className="h-5 w-5 text-red-500 mr-2" />
        인기 단축키
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {popularShortcuts.map((shortcut) => (
          <div
            key={shortcut.id}
            className="bg-gray-50 dark:bg-[var(--dark)] rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {shortcut.tool}
              </span>
              <Flame className="h-3 w-3 text-red-500" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {shortcut.title}
                </p>
                <code className="text-xs bg-gray-200 dark:bg-[var(--dark-card)] px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                  {shortcut.windowsShortcut || shortcut.macosShortcut || shortcut.linuxShortcut}
                </code>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCopyShortcut(shortcut.windowsShortcut || shortcut.macosShortcut || shortcut.linuxShortcut || "")}
                  className="h-6 w-6 text-gray-400 hover:text-primary"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFavorite(shortcut.id)}
                  className={`h-6 w-6 transition-colors duration-200 ${
                    isFavorite(shortcut.id)
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-3 w-3 ${isFavorite(shortcut.id) ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
