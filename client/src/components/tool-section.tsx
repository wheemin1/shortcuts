import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import ShortcutCard from "./shortcut-card";
import type { Shortcut } from "@shared/schema";

interface ToolSectionProps {
  tool: string;
  shortcuts: Shortcut[];
  category: string;
  onCopyShortcut: (shortcut: string) => void;
  onToggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  getCategoryIcon: (category: string) => string;
}

export default function ToolSection({
  tool,
  shortcuts,
  category,
  onCopyShortcut,
  onToggleFavorite,
  isFavorite,
  getCategoryIcon,
}: ToolSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getToolIcon = (tool: string) => {
    switch (tool.toLowerCase()) {
      case "windows":
        return "fab fa-windows";
      case "visual studio code":
        return "fas fa-code";
      case "microsoft excel":
        return "fas fa-file-excel";
      case "adobe photoshop":
        return "fas fa-paint-brush";
      case "google chrome":
        return "fab fa-chrome";
      case "pycharm":
        return "fas fa-code";
      case "jupyter notebook":
        return "fas fa-book";
      case "slack":
        return "fab fa-slack";
      case "discord":
        return "fab fa-discord";
      case "figma":
        return "fas fa-palette";
      case "notion":
        return "fas fa-sticky-note";
      case "terminal":
        return "fas fa-terminal";
      default:
        return getCategoryIcon(category);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "os": return "text-red-500";
      case "ide": return "text-green-500";
      case "office": return "text-amber-500";
      case "design": return "text-purple-500";
      case "browser": return "text-blue-500";
      case "media": return "text-pink-500";
      case "communication": return "text-green-500";
      case "productivity": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="tool-section bg-white dark:bg-[var(--dark-card)] rounded-lg shadow-sm p-6 transition-colors duration-300 fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <i className={`${getToolIcon(tool)} text-2xl ${getCategoryColor(category)} mr-3`}></i>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {tool}
          </h3>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({shortcuts.length}개)
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-primary transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 slide-up">
          {shortcuts.map((shortcut) => (
            <ShortcutCard
              key={shortcut.id}
              shortcut={shortcut}
              onCopy={onCopyShortcut}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
