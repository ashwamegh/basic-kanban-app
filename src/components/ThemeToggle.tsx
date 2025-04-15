'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const currentClasses = document.documentElement.className;
      console.log('Current HTML classes:', currentClasses);
      
      let detectedTheme: 'dark' | 'light' = 'dark';
      
      // Determine theme from class on document
      if (currentClasses.includes('light-theme')) {
        detectedTheme = 'light';
      } else if (currentClasses.includes('dark-theme')) {
        detectedTheme = 'dark';
      }
      
      console.log('Detected theme from classes:', detectedTheme);
      setTheme(detectedTheme);
      
      // Double-check with localStorage
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
      console.log('Saved theme in localStorage:', savedTheme);
      
      if (savedTheme === 'dark' || savedTheme === 'light') {
        // Only update if different to avoid unnecessary re-renders
        if (savedTheme !== detectedTheme) {
          console.log('Updating theme from localStorage:', savedTheme);
          setTheme(savedTheme);
        }
      }
    } catch (err) {
      console.error('Error initializing theme:', err);
    }
  }, []);
  
  // Apply the theme change
  const toggleTheme = () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      console.log('Toggling theme from', theme, 'to', newTheme);
      
      // Update state
      setTheme(newTheme);
      
      // Remove both theme classes
      document.documentElement.classList.remove('dark-theme');
      document.documentElement.classList.remove('light-theme');
      
      // Add the new theme class
      document.documentElement.classList.add(`${newTheme}-theme`);
      console.log('Updated document classes:', document.documentElement.className);
      
      // Store preference
      localStorage.setItem('theme', newTheme);
      console.log('Saved theme to localStorage:', newTheme);
      
      // Force a redraw of the page elements (optional)
      document.body.style.transition = 'background-color 0.2s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    } catch (err) {
      console.error('Error toggling theme:', err);
    }
  };
  
  if (!mounted) return null;

  return (
    <div className="bg-background mx-4 rounded-lg p-4 flex items-center justify-center space-x-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${theme === 'light' ? 'text-primary' : 'text-gray-400'}`}
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={theme === 'light'} 
          onChange={toggleTheme} 
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${theme === 'dark' ? 'text-primary' : 'text-gray-400'}`}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      
      {/* Small indicator of current theme (for debugging) */}
      <div className="absolute top-1 right-1 text-xs">
        {theme}
      </div>
    </div>
  );
} 