import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://woykjmpdodyvbkqnhcfs.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndveWtqbXBkb2R5dmJrcW5oY2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3Mzk0NTAsImV4cCI6MjEwMjMxNTQ1MH0.vKmBPPhZOetjpC5i97ibQlq-zdWYn5e173Pv8q3wNiw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function joinWaitlist(rawEmail) {
  const email = rawEmail.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Enter a valid email' }
  }

  const { data, error } = await supabase.functions.invoke('waitlist-welcome', {
    body: { email },
  })

  if (error) {
    return { ok: false, error: 'Could not join the waitlist. Try again.' }
  }
  if (data?.ok === false) {
    return { ok: false, error: data.error || 'Could not join the waitlist. Try again.' }
  }

  return { ok: true, duplicate: Boolean(data?.duplicate) }
}
