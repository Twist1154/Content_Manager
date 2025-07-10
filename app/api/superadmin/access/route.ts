import { NextRequest, NextResponse } from 'next/server';
import { validateSuperadminAccess } from '@/lib/auth';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const superadminKey = request.headers.get('x-superadmin-key') || 
                         request.nextUrl.searchParams.get('superadmin_key');
    
    if (!superadminKey || !await validateSuperadminAccess(superadminKey)) {
      return NextResponse.json(
        { error: 'Invalid or expired superadmin key' },
        { status: 401 }
      );
    }
    
    const supabase = await createClient();
    
    // Get all users and profiles for superadmin view
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Superadmin access granted',
      data: profiles,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Superadmin access error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const superadminKey = request.headers.get('x-superadmin-key') || 
                         request.nextUrl.searchParams.get('superadmin_key');
    
    if (!superadminKey || !await validateSuperadminAccess(superadminKey)) {
      return NextResponse.json(
        { error: 'Invalid or expired superadmin key' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { action, userId, newRole } = body;
    
    const supabase = await createClient();
    
    switch (action) {
      case 'updateRole':
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId);
        
        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update role' },
            { status: 500 }
          );
        }
        
        return NextResponse.json({
          message: 'Role updated successfully',
          userId,
          newRole
        });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Superadmin action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}