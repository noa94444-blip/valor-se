import { createBrowserClient } from '@supabase/ssr'

// createBrowserClient stores sessions in cookies (not just localStorage)
// This allows the Next.js middleware to read the session server-side

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any = null

export function getSupabase() {
      if (!_client) {
              _client = createBrowserClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                      )
      }
      return _client
}

export const supabase = getSupabase()
