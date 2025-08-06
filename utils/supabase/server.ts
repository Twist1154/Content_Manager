// utils/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface SupabaseServerClientOptions {
  useServiceRole?: boolean;
}

// CORRECTED: The function is now async
export const createClient = async (options?: SupabaseServerClientOptions) => {
  // CORRECTED: We now await the cookies() call
  const cookieStore = await cookies();
  
  // The rest of the logic remains the same, but it's now inside an async function.
  if (options?.useServiceRole) {
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set in .env.local");
    }

    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
            } catch (error) {
                // The `set` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing cookies.
          }
        },
        remove(name: string, options: CookieOptions) {
            try {
            cookieStore.set({ name, value: '', ...options });
            } catch (error) {
                // The `delete` method was called from a Server Component.
            }
      },
    },
    }
  );
};