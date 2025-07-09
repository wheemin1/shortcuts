import { cn } from "@/lib/utils";

interface KeycapProps {
  keys: string;
  className?: string;
  os?: "windows" | "macos" | "linux";
}

export default function Keycap({ keys, className, os = "windows" }: KeycapProps) {
  const normalizeKeys = (keyString: string) => {
    if (!keyString) return [];
    
    // Split by + and clean up
    const parts = keyString.split('+').map(k => k.trim());
    
    // OS-specific key mappings
    const keyMappings = {
      windows: {
        'Ctrl': 'Ctrl',
        'Alt': 'Alt',
        'Shift': 'Shift',
        'Win': 'Win',
        'Cmd': 'Ctrl',
        'Option': 'Alt',
        'PrtSc': 'PrtSc',
        'Space': 'Space',
        'Tab': 'Tab',
        'Enter': 'Enter',
        'Esc': 'Esc',
        'Delete': 'Del',
        'Backspace': 'Backspace'
      },
      macos: {
        'Cmd': '⌘',
        'Ctrl': '⌃',
        'Alt': '⌥',
        'Option': '⌥',
        'Shift': '⇧',
        'Win': '⌘',
        'Space': '␣',
        'Tab': '⇥',
        'Enter': '⏎',
        'Esc': '⎋',
        'Delete': '⌫',
        'Backspace': '⌫'
      },
      linux: {
        'Ctrl': 'Ctrl',
        'Alt': 'Alt',
        'Shift': 'Shift',
        'Super': 'Super',
        'Win': 'Super',
        'Cmd': 'Ctrl',
        'Option': 'Alt',
        'Space': 'Space',
        'Tab': 'Tab',
        'Enter': 'Enter',
        'Esc': 'Esc',
        'Delete': 'Del',
        'Backspace': 'Backspace'
      }
    };
    
    return parts.map(key => {
      const mapping = keyMappings[os];
      return mapping[key] || key;
    });
  };

  const keyParts = normalizeKeys(keys);
  
  if (keyParts.length === 0) return null;

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {keyParts.map((key, index) => (
        <span key={index} className="inline-flex items-center">
          <kbd className="keycap">
            {key}
          </kbd>
          {index < keyParts.length - 1 && (
            <span className="text-muted-foreground mx-1 text-sm">+</span>
          )}
        </span>
      ))}
    </div>
  );
}