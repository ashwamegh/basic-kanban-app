import type { Metadata } from "next";
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Kanban Task Management",
  description: "A Kanban task management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                // Get saved theme or use system preference
                let theme = localStorage.getItem('theme');
                if (!theme) {
                  // Check system preference
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  theme = prefersDark ? 'dark' : 'light';
                  localStorage.setItem('theme', theme);
                }
                
                // Apply theme class to HTML element
                document.documentElement.classList.remove('light-theme', 'dark-theme');
                document.documentElement.classList.add(theme + '-theme');
                
                // Log for debugging
                console.log('Initial theme set to:', theme);
              } catch (e) {
                console.error('Error setting initial theme:', e);
                document.documentElement.classList.add('dark-theme');
              }
            })();
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
