'use client';

import { useState, useEffect } from 'react';

export default function SimpleThemeToggle() {
  // Default to dark theme
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);

  // Initialize once the component mounts
  useEffect(() => {
    // Check the current theme on page load
    const root = document.documentElement;
    const isLight = root.classList.contains('light-theme');
    
    // Set the internal state based on actual document state
    if (isLight) {
      setCurrentTheme('light');
    } else {
      // Default to dark theme
      setCurrentTheme('dark');
      
      // Ensure dark theme is applied if neither theme is set
      if (!root.classList.contains('dark-theme')) {
        root.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []);

  // Handle toggle click
  const handleToggle = () => {
    // Get the HTML element
    const root = document.documentElement;
    
    // If currently dark, make it light
    if (root.classList.contains('dark-theme') || currentTheme === 'dark') {
      // Remove the dark theme
      root.classList.remove('dark-theme');
      // Add the light theme
      root.classList.add('light-theme');
      // Update localStorage
      localStorage.setItem('theme', 'light');
      // Update component state
      setCurrentTheme('light');
      
      console.log('Switched to light theme');
    } 
    // If currently light, make it dark
    else {
      // Remove the light theme
      root.classList.remove('light-theme');
      // Add the dark theme
      root.classList.add('dark-theme');
      // Update localStorage
      localStorage.setItem('theme', 'dark');
      // Update component state
      setCurrentTheme('dark');
      
      console.log('Switched to dark theme');
    }
  };

  // If the state hasn't been initialized yet, render a placeholder
  if (currentTheme === null) {
    return <div className="h-14"></div>;
  }

  return (
    <div className="bg-background mx-4 rounded-lg p-4 flex items-center justify-center space-x-6 relative">
      {/* Sun icon */}
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
        className={currentTheme === 'light' ? 'text-primary' : 'text-gray-400'}
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
      
      {/* Toggle switch */}
      <button 
        onClick={handleToggle}
        aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} theme`}
        className="relative inline-flex items-center cursor-pointer"
      >
        <div className="w-11 h-6 bg-secondary rounded-full relative">
          <div 
            className={`absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all duration-300 ${
              currentTheme === 'light' ? 'left-[calc(100%-22px)]' : 'left-[2px]'
            }`}
          />
        </div>
      </button>
      
      {/* Moon icon */}
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
        className={currentTheme === 'dark' ? 'text-primary' : 'text-gray-400'}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      
      {/* Debug indicator showing current theme */}
      {/* <div className="absolute top-1 right-1 text-xs opacity-50">
        {currentTheme}
      </div> */}
    </div>
  );
} 