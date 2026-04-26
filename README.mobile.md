# Mobile Runtime

Current native runtime uses Expo entrypoint:

- `src/index.native.tsx`
- `src/app/native/NativeAppRoot.tsx`

Required env vars for standalone mobile runs:

- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_TELEGRAM_BOT_URL` (optional)
- `EXPO_PUBLIC_TON_MANIFEST_URL` (optional)
- `EXPO_PUBLIC_TON_WALLET` (optional)

Recommended first run:

1. Copy `.env.example` to `.env`
2. Point `EXPO_PUBLIC_API_BASE_URL` to a reachable backend origin
3. Run `npm run expo:start`
4. Open the app in Expo Go / emulator

Notes:

- web still uses `public/config/*.json`
- native uses `Config.native.ts` and does not fetch `/config/*.json`
- session persistence is currently in-memory in native runtime; replacing it with secure storage is a good next step
