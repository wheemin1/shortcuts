import { useState, useEffect } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import PopularShortcuts from "@/components/popular-shortcuts";
import ToolSection from "@/components/tool-section";
import Toast from "@/components/toast";
import { useShortcuts } from "@/hooks/use-shortcuts";
import { useFavorites } from "@/hooks/use-favorites";
import { useSearch } from "@/hooks/use-search";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOS, setSelectedOS] = useState<string[]>(["windows", "macos", "linux"]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const { data: shortcuts, isLoading, error } = useShortcuts();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { filteredShortcuts } = useSearch(shortcuts || [], searchQuery, selectedCategory, selectedOS, showFavoritesOnly, favorites);

  // Dark mode management
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!isDarkMode).toString());
  };

  const handleCopyShortcut = (shortcut: string) => {
    navigator.clipboard.writeText(shortcut).then(() => {
      showToastMessage(`${shortcut} 단축키가 클립보드에 복사되었습니다!`);
    }).catch(() => {
      showToastMessage("복사에 실패했습니다.");
    });
  };

  const handleToggleFavorite = (shortcutId: number) => {
    if (isFavorite(shortcutId)) {
      removeFavorite(shortcutId);
      showToastMessage("즐겨찾기에서 제거되었습니다.");
    } else {
      addFavorite(shortcutId);
      showToastMessage("즐겨찾기에 추가되었습니다.");
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Group shortcuts by tool
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.tool]) {
      acc[shortcut.tool] = [];
    }
    acc[shortcut.tool].push(shortcut);
    return acc;
  }, {} as Record<string, typeof shortcuts>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "os": return "fa-desktop";
      case "ide": return "fa-code";
      case "office": return "fa-file-alt";
      case "design": return "fa-paint-brush";
      case "browser": return "fa-globe";
      case "media": return "fa-play";
      case "communication": return "fa-comments";
      case "productivity": return "fa-tasks";
      default: return "fa-folder";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">단축키 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-[var(--dark)] transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedOS={selectedOS}
              onOSChange={setSelectedOS}
              shortcutsCount={filteredShortcuts.length}
              totalShortcuts={shortcuts?.length || 0}
            />
          </div>

          <div className="lg:col-span-3">
            {!showFavoritesOnly && (
              <div className="mb-8">
                <PopularShortcuts
                  onCopyShortcut={handleCopyShortcut}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                />
              </div>
            )}

            <div className="space-y-6">
              {Object.entries(groupedShortcuts).map(([tool, toolShortcuts]) => (
                <ToolSection
                  key={tool}
                  tool={tool}
                  shortcuts={toolShortcuts}
                  category={toolShortcuts[0]?.category || ""}
                  onCopyShortcut={handleCopyShortcut}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  getCategoryIcon={getCategoryIcon}
                />
              ))}

              {Object.keys(groupedShortcuts).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500">
                    <i className="fas fa-search text-4xl mb-4"></i>
                    <p className="text-lg font-medium">검색 결과가 없습니다</p>
                    <p className="text-sm mt-2">다른 키워드로 검색해보세요</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
