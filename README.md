# Plentify

A warm, local-first Expo MVP for sharing, requesting, lending, exchanging, and mapping community resources.

## Run
```bash
npm install
npx expo start
```
Open the QR code in Expo Go.

## Environment
Copy `.env.example` to `.env` and set:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- optional `EXPO_PUBLIC_DEMO_CITY`

Without Supabase credentials, the app runs in demo mode with Kfar Saba mock listings.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/migrations/202606140001_initial_schema.sql` in SQL editor or via Supabase CLI.
3. Enable email auth.
4. Create a Storage bucket for listing images and add owner-folder policies before production.

## MVP limitations
- Realtime chat and push notifications are TODOs; current chat supports refresh/demo sending.
- Map clustering is intentionally deferred behind the map abstraction.
- Image upload UI is present; production Supabase Storage upload policies should be completed before launch.
