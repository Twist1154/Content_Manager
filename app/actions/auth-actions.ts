'use server';

import { createClient } from '@/utils/supabase/server';

interface AuthResult {
    success: boolean;
    message: string;
    error?: string;
    userId?: string;
}

/**
 * Register a new user with email and password
 * Sets both user_metadata and app_metadata with the role
 */
export async function registerUser(
    email: string, 
    password: string, 
    role: 'client' | 'admin' = 'client'
): Promise<AuthResult> {
    try {
        const supabase = await createClient({ useServiceRole: true });// Request service role key for admin operations

        // First, create the user with user_metadata
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm the email
            user_metadata: {
                role: role // Keep user_metadata for backward compatibility
            },
            app_metadata: {
                role: role // Set app_metadata for RLS policies
            }
        });

        if (error) {
            console.error('Error registering user:', error);
            return {
                success: false,
                message: 'Failed to register user',
                error: error.message
            };
        }

        if (!data.user) {
            return {
                success: false,
                message: 'User creation failed with no error',
                error: 'No user returned from createUser'
            };
        }

        // Create profile record
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: data.user.id,
                email: data.user.email!,
                role: role
            });

        if (profileError) {
            console.error('Error creating profile:', profileError);
            // Don't fail the entire operation, just log the warning
            console.warn('Profile creation failed, but user was created successfully');
        }

        return {
            success: true,
            message: 'User registered successfully',
            userId: data.user.id
        };
    } catch (error: any) {
        console.error('Unexpected error in registerUser:', error);
        return {
            success: false,
            message: 'An unexpected error occurred during registration',
            error: error.message
        };
    }
}

/**
 * Update a user's app_metadata after OAuth sign-in
 * This is called from the auth callback handler
 */
export async function updateUserAfterOAuth(
    userId: string,
    email: string,
    role: 'client' | 'admin' = 'client'
): Promise<AuthResult> {
    try {
        const supabase = await createClient({ useServiceRole: true }); // Request service role key for admin operations

        // Update user's app_metadata
        const { error } = await supabase.auth.admin.updateUserById(userId, {
            app_metadata: {
                role: role
            }
        });

        if (error) {
            console.error('Error updating user app_metadata after OAuth:', error);
            return {
                success: false,
                message: 'Failed to update user metadata',
                error: error.message
            };
        }

        // Ensure profile exists
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                email: email,
                role: role
            });

        if (profileError) {
            console.error('Error creating/updating profile after OAuth:', profileError);
            // Don't fail the entire operation, just log the warning
            console.warn('Profile update failed, but user metadata was updated successfully');
        }

        return {
            success: true,
            message: 'User metadata updated successfully after OAuth',
            userId: userId
        };
    } catch (error: any) {
        console.error('Unexpected error in updateUserAfterOAuth:', error);
        return {
            success: false,
            message: 'An unexpected error occurred while updating user after OAuth',
            error: error.message
        };
    }
}