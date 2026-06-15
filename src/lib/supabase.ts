import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
const missingSupabaseEnvVars = [
  !supabaseUrl ? 'EXPO_PUBLIC_SUPABASE_URL' : null,
  !supabaseAnonKey ? 'EXPO_PUBLIC_SUPABASE_ANON_KEY' : null,
].filter(Boolean) as string[];

export const isSupabaseConfigured = missingSupabaseEnvVars.length === 0;

if (!isSupabaseConfigured && __DEV__) {
  console.warn(
    `[supabase] Missing ${missingSupabaseEnvVars.join(', ')}. ` +
      'Create a .env file from .env.example and restart Expo so auth and live data are enabled.',
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;
