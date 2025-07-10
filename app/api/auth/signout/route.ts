import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}