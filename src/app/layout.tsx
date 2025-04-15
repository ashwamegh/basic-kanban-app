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
        {/* Add inline script to set theme early and avoid flash */}
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.add(theme + '-theme');
              } catch (e) {
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
