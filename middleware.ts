import { createClient } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Superadmin bypass pattern: SUPER_ADMIN_[TIMESTAMP]_[HASH]
const SUPERADMIN_PATTERN = /^SUPER_ADMIN_\d{10}_[A-F0-9]{32}$/;
const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET || 'default_secret_key_change_in_production';

function validateSuperadminCredential(credential: string): boolean {
  if (!SUPERADMIN_PATTERN.test(credential)) return false;
  
  const parts = credential.split('_');
  const timestamp = parseInt(parts[2]);
  const hash = parts[3];
  
  // Check if timestamp is within last 24 hours
  const now = Math.floor(Date.now() / 1000);
  const timeDiff = now - timestamp;
  if (timeDiff > 86400 || timeDiff < -300) return false; // 24 hours + 5 min tolerance
  
  // Validate hash (simple implementation - use crypto in production)
  const expectedHash = require('crypto')
    .createHash('md5')
    .update(`${timestamp}_${SUPERADMIN_SECRET}`)
    .digest('hex')
    .toUpperCase();
  
  return hash === expectedHash;
}

export async function middleware(req: NextRequest) {
  // Check for superadmin bypass
  const authHeader = req.headers.get('authorization');
  const superadminCred = req.headers.get('x-superadmin-key') || 
                        req.nextUrl.searchParams.get('superadmin_key');
  
  if (superadminCred && validateSuperadminCredential(superadminCred)) {
    // Allow superadmin access to any route
    const response = NextResponse.next();
    response.headers.set('x-superadmin-access', 'true');
    return response;
  }

  const { supabase, response } = createClient(req);

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    // If no session, redirect to appropriate sign-in page
    if (!session || error) {
      if (req.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/client/signin', req.url));
      }
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/auth/admin/signin', req.url));
      }
      return response;
    }

    // If there is a session, check user role for protected routes
    if (session) {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile fetch error in middleware:', profileError);
          // If profile doesn't exist, redirect to appropriate sign-in
          if (req.nextUrl.pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/auth/admin/signin', req.url));
          }
          if (req.nextUrl.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/auth/client/signin', req.url));
          }
        }

        // Check admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          if (!profile || profile.role !== 'admin') {
            return NextResponse.redirect(new URL('/auth/admin/signin', req.url));
          }
        }

        // Check dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          if (!profile || profile.role !== 'client') {
            return NextResponse.redirect(new URL('/auth/client/signin', req.url));
          }
        }
      } catch (error) {
        console.error('Middleware profile check error:', error);
        // On error, redirect to appropriate sign-in
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return NextResponse.redirect(new URL('/auth/admin/signin', req.url));
        }
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/auth/client/signin', req.url));
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};