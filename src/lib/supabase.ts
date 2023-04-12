import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPBASE_URL,
  import.meta.env.VITE_SUPBASE_KEY,
)
