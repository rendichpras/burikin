'use client';


import { useThemeSwitch } from "@/hooks/use-theme-switch";
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useThemeSwitch();

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
    >
      {mounted && (theme === 'dark' ? (
        <Sun className="w-4 h-4 text-primary" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      ))}
    </button>
  );
}
