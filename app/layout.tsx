// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers'; // This is your ThemeProvider
import { ToastProvider } from '@/components/ui/Toast'; // --- NEW: Import ToastProvider ---

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hapo Uploader',
  description: 'A great advertising content management system for clients and marketing teams.',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  // Make sure your site.webmanifest file is also inside public/favicon/
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/*
          This is the correct provider structure.
          The ThemeProvider (`Providers`) should be on the outside,
          and the ToastProvider on the inside, so toasts can adapt to the theme.
        */}
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
