'use client';

import { useEffect } from 'react';

export default function ThemeScript() {
  useEffect(() => {
    // This runs only on the client
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(`${theme}-theme`);
  }, []);

  return null;
} 