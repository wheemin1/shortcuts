import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dock, 
  Code, 
  FileText, 
  PaintBucket, 
  Globe, 
  Play, 
  MessageCircle, 
  CheckSquare,
  Grid3X3
} from "lucide-react";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedOS: string[];
  onOSChange: (os: string[]) => void;
  shortcutsCount: number;
  totalShortcuts: number;
}

const categories = [
  { id: "all", label: "전체", icon: Grid3X3, color: "text-gray-600" },
  { id: "os", label: "운영체제", icon: Dock, color: "text-red-500" },
  { id: "ide", label: "개발도구", icon: Code, color: "text-green-500" },
  { id: "office", label: "오피스", icon: FileText, color: "text-amber-500" },
  { id: "design", label: "디자인", icon: PaintBucket, color: "text-purple-500" },
  { id: "browser", label: "브라우저", icon: Globe, color: "text-blue-500" },
  { id: "media", label: "미디어", icon: Play, color: "text-pink-500" },
  { id: "communication", label: "커뮤니케이션", icon: MessageCircle, color: "text-green-500" },
  { id: "productivity", label: "생산성", icon: CheckSquare, color: "text-purple-500" },
];

export default function Sidebar({
  selectedCategory,
  onCategoryChange,
  selectedOS,
  onOSChange,
  shortcutsCount,
  totalShortcuts,
}: SidebarProps) {
  const handleOSChange = (os: string, checked: boolean) => {
    if (checked) {
      onOSChange([...selectedOS, os]);
    } else {
      onOSChange(selectedOS.filter(item => item !== os));
    }
  };

  return (
    <div className="bg-white dark:bg-[var(--dark-card)] rounded-lg shadow-sm p-6 transition-colors duration-300">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">카테고리</h2>
      
      {/* Category Filters */}
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isSelected ? "default" : "ghost"}
              className={`w-full justify-start px-3 py-2 text-left transition-colors duration-200 ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-gray-100 dark:hover:bg-[var(--dark)] text-gray-700 dark:text-gray-300"
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon className={`h-4 w-4 mr-2 ${isSelected ? 'text-primary-foreground' : category.color}`} />
              {category.label}
              {category.id === "all" && (
                <span className="ml-auto text-xs">({totalShortcuts})</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="mt-6 p-3 bg-gray-50 dark:bg-[var(--dark)] rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-primary">{shortcutsCount}</span>개의 단축키가 검색되었습니다
        </p>
      </div>

      {/* OS Filter */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">운영체제</h3>
        <div className="space-y-3">
          {[
            { value: "windows", label: "Windows" },
            { value: "macos", label: "macOS" },
            { value: "linux", label: "Linux" }
          ].map((os) => (
            <div key={os.value} className="flex items-center space-x-2">
              <Checkbox
                id={os.value}
                checked={selectedOS.includes(os.value)}
                onCheckedChange={(checked) => handleOSChange(os.value, checked as boolean)}
              />
              <label
                htmlFor={os.value}
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                {os.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
