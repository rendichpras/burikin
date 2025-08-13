'use client';


import { useThemeSwitch } from "@/hooks/use-theme-switch";
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, mounted, toggleTheme } = useThemeSwitch();

  return (
    <button
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-sm border-2 border-border bg-background hover:bg-accent hover:border-accent transition-all duration-200 shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] hover:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(26,26,26,1)] active:translate-x-0 active:translate-y-0 dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:active:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]"
    >
      {mounted && (theme === 'dark' ? (
        <Sun className="w-4 h-4 text-primary" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      ))}
    </button>
  );
}
