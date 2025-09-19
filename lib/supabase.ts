import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports';

const runtimeConfig = useRuntimeConfig();
const supabaseUrl = runtimeConfig.NUXT_PUBLIC_SUPABASE_URL;
const supabaseKey = runtimeConfig.NUXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl as string, supabaseKey as string)