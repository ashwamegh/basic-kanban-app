'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from '@/lib/context/ThemeContext';

// This prevents hydration mismatch by ensuring the theme is set on the client
function ClientOnly({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Set initial theme class as early as possible to prevent flash
  useEffect(() => {
    try {
      console.log('Providers: Setting initial theme class');
      const storedTheme = localStorage.getItem('theme') || 'dark';
      
      // Remove any existing theme classes first
      document.documentElement.classList.remove('dark-theme', 'light-theme');
      
      // Add the theme class
      document.documentElement.classList.add(`${storedTheme}-theme`);
      console.log('Initial theme classes:', document.documentElement.className);
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      // Fallback to dark theme
      document.documentElement.classList.add('dark-theme');
    }
    
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder or loading state
    return (
      <div className="min-h-screen bg-[#000] text-white">
        {/* You could add a loading spinner here if desired */}
      </div>
    );
  }

  return (
    <ClientOnly>
      <ThemeProvider>{children}</ThemeProvider>
    </ClientOnly>
  );
} 