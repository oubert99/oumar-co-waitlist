import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://utpgkwvoniellplogwko.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0cGdrd3ZvbmllbGxwbG9nd2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMDE3NTQsImV4cCI6MjA2MTU3Nzc1NH0.wxffVcV0Mvis-V2iLZa1g1GX44-u18Kn2TTwRPoh8bo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function joinWaitlist(rawEmail) {
  const email = rawEmail.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Enter a valid email' }
  }

  const { error } = await supabase.from('waitlist').insert({ email })

  if (error) {
    if (error.code === '23505') return { ok: true, duplicate: true }
    return { ok: false, error: 'Could not join the waitlist. Try again.' }
  }

  return { ok: true, duplicate: false }
}
