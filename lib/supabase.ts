import { createBrowserClient } from '@supabase/ssr'

// Use createBrowserClient from @supabase/ssr so sessions are stored in cookies
// This allows the middleware SSR client to read the session server-side
let _supabase: ReturnType<typeof createBrowserClient> | null = null

export function getSupabase() {
    if (!_supabase) {
          _supabase = createBrowserClient(
                  process.env.NEXT_PUBLIC_SUPABASE_URL!,
                  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                )
    }
    return _supabase
}

export const supabase = getSupabase()
