'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
        setTheme(storedTheme);
      } else {
        // Use system preference as fallback
        const systemPreference = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        setTheme(systemPreference);
      }
    } catch (error) {
      console.error('Failed to access localStorage:', error);
    }
  }, []);

  // Apply theme class to document when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    try {
      console.log('Applying theme:', theme);
      
      // Remove both theme classes
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.remove('light-theme');
      
      // Add the current theme class
      document.documentElement.classList.add(`${theme}-theme`);
      
      // Save to localStorage
      localStorage.setItem('theme', theme);
      
      console.log('Applied theme classes:', document.documentElement.className);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    console.log('Toggle theme called, current theme:', theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      console.log('Setting new theme to:', newTheme);
      return newTheme;
    });
  };

  const contextValue = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 