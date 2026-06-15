# Plentify

A warm, local-first Expo MVP for sharing, requesting, lending, exchanging, and mapping community resources.

## Run
```bash
npm install
npm start
```
Open the QR code in Expo Go.

`npm start` and `npm run start:lan` detect your computer's LAN IPv4 address, set `REACT_NATIVE_PACKAGER_HOSTNAME`, and start Expo in LAN mode so the QR code uses an address like `exp://192.168.x.x:8081` instead of `exp://127.0.0.1:8081`.

Useful development commands:

```bash
npm run start:lan      # Expo LAN mode for Expo Go on a real phone
npm run start:clear    # Expo LAN mode with Metro cache cleared
npm run start:tunnel   # Expo tunnel mode if LAN/Wi-Fi cannot connect
npm run start:local    # localhost mode only when explicitly needed
npm run android
npm run ios
npm run web
```

## Expo Go connection troubleshooting

- Use `npm start` or `npm run start:lan` for Expo Go on a real phone.
- If the QR code shows `127.0.0.1`, run `npm run start:lan`.
- If LAN does not work, run `npm run start:tunnel`.
- Make sure your phone and computer are on the same Wi-Fi network.
- Disable VPN if needed, because some VPNs block local network traffic.
- Check your firewall if port `8081` is blocked.
- To manually choose the host IP on macOS/Linux:

  ```bash
  EXPO_DEV_HOST=192.168.1.23 npm run start:lan
  ```

- To manually choose the host IP on Windows PowerShell:

  ```powershell
  $env:EXPO_DEV_HOST="192.168.1.23"
  npm run start:lan
  ```

## Environment
Copy `.env.example` to `.env` and set the Expo public Supabase variables:
- `EXPO_PUBLIC_SUPABASE_URL` — your Supabase project URL.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon/public API key.
- optional `EXPO_PUBLIC_DEMO_CITY`

Expo only exposes environment variables to React Native when they are prefixed with `EXPO_PUBLIC_`. Do not use unprefixed names such as `SUPABASE_URL` in the app bundle, and do not commit real keys. Restart Expo after changing `.env` values so Metro picks up the new configuration.

Without Supabase credentials, the app runs in demo mode with Kfar Saba mock listings, and auth screens fail gracefully with a friendly unavailable message.

## Supabase setup
1. Create a Supabase project.
2. Run `supabase/migrations/202606140001_initial_schema.sql` in SQL editor or via Supabase CLI.
3. Enable email auth.
4. Enable Apple and Google in Supabase Auth providers. Use the native app id `com.plentify.app`, the app scheme `plentify`, and add `plentify://auth/callback` to the allowed redirect URLs.
5. In Google Cloud, add iOS and Android OAuth clients for bundle/package id `com.plentify.app`; in Apple Developer, enable Sign in with Apple for the same bundle id.
6. Create a Storage bucket for listing images and add owner-folder policies before production.

## MVP limitations
- Realtime chat and push notifications are TODOs; current chat supports refresh/demo sending.
- Map clustering is intentionally deferred behind the map abstraction.
- Image upload UI is present; production Supabase Storage upload policies should be completed before launch.
