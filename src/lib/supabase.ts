import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.SUPBASE_URL,
  import.meta.env.SUPBASE_KEY,
)
