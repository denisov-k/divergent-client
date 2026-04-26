# Mobile Runtime

Current native runtime uses Expo entrypoint:

- `src/index.native.tsx`
- `src/app/native/NativeAppRoot.tsx`

Required env vars for standalone mobile runs:

- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_APP_PUBLIC_URL` (recommended for share/deep links; falls back to API URL)
- `EXPO_PUBLIC_TELEGRAM_BOT_URL` (optional)

Recommended first run:

1. Copy `.env.example` to `.env`
2. Point `EXPO_PUBLIC_API_BASE_URL` to a reachable backend origin
3. Run `npm run expo:start`
4. Open the app in Expo Go / emulator

Notes:

- web still uses `public/config/*.json`
- native uses `Config.native.ts` and does not fetch `/config/*.json`
- mobile session persistence already goes through native session adapter
