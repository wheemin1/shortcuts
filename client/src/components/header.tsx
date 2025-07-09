import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Heart, Moon, Sun, Plus } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  showFavoritesOnly,
  onToggleFavorites,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  return (
    <header className="bg-white dark:bg-[var(--dark-card)] shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">단축키모아</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 bg-gray-100 dark:bg-[var(--dark)] border-gray-300 dark:border-[var(--dark-border)] focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="단축키 검색... (예: 복사, copy, Ctrl+C)"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFavorites}
              className={`p-2 transition-colors duration-200 ${
                showFavoritesOnly 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-primary'
              }`}
            >
              <Heart className={`h-5 w-5 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors duration-200"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
              <Plus className="h-4 w-4 mr-2" />
              단축키 추가
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
