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
