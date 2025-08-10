'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Menghindari hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return {
    theme,
    mounted,
    toggleTheme
  };
}
