'use client';


import { useThemeSwitch } from "@/hooks/use-theme-switch";
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useThemeSwitch();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-full border-none bg-background hover:bg-accent/10 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:shadow-sm"
    >
      {mounted && (theme === 'dark' ? (
        <Sun className="w-4 h-4 text-primary" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      ))}
    </button>
  );
}
