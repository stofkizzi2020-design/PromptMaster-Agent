import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

function applyTheme() {
  const root = document.documentElement;
  root.classList.remove('dark');
  document.body.classList.remove('dark');
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');

  // Enforce light mode globally on every render lifecycle.
  useEffect(() => {
    applyTheme();
    try {
      localStorage.setItem('pm_theme', 'light');
    } catch {}
  }, [theme]);

  const setTheme = useCallback(() => {
    setThemeState('light');
  }, []);

  const resolvedTheme = 'light';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
