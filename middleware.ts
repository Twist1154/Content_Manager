import { createClient } from '@/utils/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
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