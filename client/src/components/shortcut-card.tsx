import { Button } from "@/components/ui/button";
import { Copy, Heart, Monitor, Apple, Smartphone } from "lucide-react";
import Keycap from "@/components/keycap";
import type { Shortcut } from "@shared/schema";

interface ShortcutCardProps {
  shortcut: Shortcut;
  onCopy: (shortcut: string) => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export default function ShortcutCard({
  shortcut,
  onCopy,
  onToggleFavorite,
  isFavorite,
}: ShortcutCardProps) {
  const getShortcutForOS = (os: string) => {
    switch (os.toLowerCase()) {
      case "windows":
        return shortcut.windowsShortcut;
      case "macos":
        return shortcut.macosShortcut;
      case "linux":
        return shortcut.linuxShortcut;
      default:
        return shortcut.windowsShortcut;
    }
  };

  const handleCopy = () => {
    const shortcutText = getShortcutForOS("windows") || getShortcutForOS("macos") || getShortcutForOS("linux");
    if (shortcutText) {
      onCopy(shortcutText);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(shortcut.id);
  };

  return (
    <div className="shortcut-card bg-gray-50 dark:bg-[var(--dark)] rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            {shortcut.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {shortcut.description}
          </p>
          
          {/* Tags */}
          {shortcut.tags && shortcut.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {shortcut.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-200 dark:bg-[var(--dark-card)] text-gray-600 dark:text-gray-400 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {/* OS-specific shortcuts with keycaps */}
          <div className="flex flex-col space-y-2">
            {shortcut.windowsShortcut && (
              <div className="flex items-center space-x-2">
                <div className="os-badge windows">
                  <Monitor className="h-3 w-3" />
                  <span>Win</span>
                </div>
                <Keycap keys={shortcut.windowsShortcut} os="windows" />
              </div>
            )}
            {shortcut.macosShortcut && (
              <div className="flex items-center space-x-2">
                <div className="os-badge macos">
                  <Apple className="h-3 w-3" />
                  <span>Mac</span>
                </div>
                <Keycap keys={shortcut.macosShortcut} os="macos" />
              </div>
            )}
            {shortcut.linuxShortcut && (
              <div className="flex items-center space-x-2">
                <div className="os-badge linux">
                  <Smartphone className="h-3 w-3" />
                  <span>Linux</span>
                </div>
                <Keycap keys={shortcut.linuxShortcut} os="linux" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 text-gray-400 hover:text-primary transition-colors duration-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={`h-8 w-8 transition-colors duration-200 ${
                isFavorite(shortcut.id)
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite(shortcut.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
