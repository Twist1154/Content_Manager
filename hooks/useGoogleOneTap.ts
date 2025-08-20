'use client';

import Script from 'next/script'; // You can't use the Script component in a hook, so we'll load it manually.
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

// Helper function to load the script
const loadGoogleScript = (onLoad: () => void, onError: () => void) => {
    if (document.getElementById('google-gsi-script')) {
        onLoad();
        return;
    }
    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = onLoad;
    script.onerror = onError;
    document.head.appendChild(script);
};

export function useGoogleOneTap() {
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();
    const [isScriptLoaded, setScriptLoaded] = useState(false);

    // --- All the logic from the component is moved here ---
    const generateNonce = async (): Promise<[string, string]> => {
        // Generate a random nonce and its SHA-256 hash (base64url encoded)
        const random = crypto.getRandomValues(new Uint8Array(16));
        const nonce = Array.from(random)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        const encoder = new TextEncoder();
        const data = encoder.encode(nonce);
        const digest = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(digest));
        const hashedNonce = btoa(String.fromCharCode(...hashArray))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');

        return [nonce, hashedNonce];
    };

    const initializeGoogleOneTap = async () => {
        try {
            const w = window as any;
            if (!w?.google?.accounts?.id) {
                // Google script not ready; skip
                return;
            }

            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            if (!clientId) {
                console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
                return;
            }

            const [nonce, hashedNonce] = await generateNonce();

            w.google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response: any) => {
                    try {
                        const { error } = await supabase.auth.signInWithIdToken({
                            provider: 'google',
                            token: response?.credential,
                            nonce: hashedNonce,
                        } as any);
                        if (error) {
                            console.error('Supabase sign-in error:', error);
                            return;
                        }
                        router.refresh();
                    } catch (err) {
                        console.error('Error handling Google One Tap callback:', err);
                    }
                },
                nonce: hashedNonce,
                auto_select: false,
                cancel_on_tap_outside: true,
                context: 'signin',
            });

            w.google.accounts.id.prompt();
        } catch (e) {
            console.error('Failed to initialize Google One Tap:', e);
        }
    };

    useEffect(() => {
        // Load the script when the hook is first used
        loadGoogleScript(
            () => setScriptLoaded(true),
            () => console.error('Failed to load Google GSI script')
        );
    }, []);

    useEffect(() => {
        if (isScriptLoaded) {
            const timeoutId = setTimeout(initializeGoogleOneTap, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [isScriptLoaded]);

    // The hook doesn't need to return anything, as it just triggers a side effect.
}