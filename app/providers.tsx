// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    // attribute="class" tells next-themes to change the class on the <html> element
    // defaultTheme="system" uses the user's OS preference as the default
    // enableSystem allows for the "system" option
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
        </ThemeProvider>
    );
}