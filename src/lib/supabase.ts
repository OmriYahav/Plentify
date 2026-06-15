import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

const normalizeExpoEnvValue = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const supabaseUrl = normalizeExpoEnvValue(process.env.EXPO_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = normalizeExpoEnvValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

const hasUrl = Boolean(supabaseUrl);
const hasAnonKey = Boolean(supabaseAnonKey);

const missingSupabaseEnvVars = [
  !hasUrl ? 'EXPO_PUBLIC_SUPABASE_URL' : null,
  !hasAnonKey ? 'EXPO_PUBLIC_SUPABASE_ANON_KEY' : null,
].filter(Boolean) as string[];

export const isSupabaseConfigured = missingSupabaseEnvVars.length === 0;

export const supabaseMissingConfigMessage =
  'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to .env from .env.example, then restart Expo with npx expo start --clear.';

if (__DEV__) {
  console.log('[env debug]', {
    hasUrl: Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  });
  console.info('[env] Supabase config loaded:', {hasUrl, hasAnonKey});
}

if (!isSupabaseConfigured && __DEV__) {
  console.warn('[supabase] Missing environment variables', {
    hasUrl,
    hasAnonKey,
    missing: missingSupabaseEnvVars,
  });
  console.warn(
    '[supabase] Create a .env file from .env.example and restart Expo with npx expo start --clear so auth and live data are enabled.',
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
