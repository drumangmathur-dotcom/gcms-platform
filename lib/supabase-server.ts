import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

let _supabaseServerInstance: SupabaseClient<Database> | null = null;

function getSupabaseServer(): SupabaseClient<Database> {
    if (_supabaseServerInstance) {
        return _supabaseServerInstance;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables');
    }

    _supabaseServerInstance = createClient<Database>(
        supabaseUrl,
        supabaseServiceRoleKey,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );

    return _supabaseServerInstance;
}

/**
 * Server-side Supabase client with service role key
 * This bypasses Row Level Security (RLS) - use with caution
 * Only use this in API routes and server components
 * 
 * This is lazily initialized at runtime to avoid build-time errors
 */
export const supabaseServer = new Proxy({} as SupabaseClient<Database>, {
    get(target, prop) {
        const client = getSupabaseServer();
        const value = (client as any)[prop];
        return typeof value === 'function' ? value.bind(client) : value;
    }
});
