'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Ctx = { theme: Theme; setTheme: (t: Theme) => void; toggle: () => void };

const ThemeContext = createContext<Ctx | null>(null);

const STORAGE_KEY = 'softgen-theme';

/**
 * Dark is default per design-tokens.md §1.3 — light is a toggle.
 * The user choice is persisted in localStorage and applied to <html>
 * via `data-theme`, matching the CSS variable scheme in globals.css.
 *
 * The inline script in <head> sets the right data-theme before paint
 * to avoid a flash of unstyled (light) content.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null) as Theme | null;
    const initial: Theme = saved === 'light' || saved === 'dark' ? saved : 'dark';
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // localStorage may be disabled — choice just won't persist.
    }
  };

  const toggle = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Ctx {
  const v = useContext(ThemeContext);
  if (!v) throw new Error('useTheme must be used inside <ThemeProvider>');
  return v;
}

/** Inlined into <head> so the document is dark before first paint. */
export const themeBootstrapScript = `
(function () {
  try {
    var k = 'softgen-theme';
    var saved = localStorage.getItem(k);
    var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;
