import { useEffect } from "react";
import { Check, X } from "lucide-react";

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
}

export default function Toast({ message, show, onClose, type = "success" }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="h-4 w-4" />;
      case "error":
        return <X className="h-4 w-4" />;
      default:
        return <Check className="h-4 w-4" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-green-600";
    }
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${getBackgroundColor()} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50 ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
