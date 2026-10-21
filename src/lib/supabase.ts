import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** Null when the app is built without Supabase settings; the app then runs guest-only. */
export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null
