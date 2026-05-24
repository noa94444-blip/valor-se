import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabase() {
        if (!_supabase) {
                  _supabase = createClient(supabaseUrl, supabaseAnonKey)
        }
        return _supabase
}

export const supabase = getSupabase()
