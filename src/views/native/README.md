First native entrypoints live here.

Current scope:
- `goals.tsx`
- `reminders.tsx`
- `challenges.tsx`
- `rewards.tsx`
- `progress.tsx`
- `frens.tsx`
- `settings.tsx`
- `more.tsx`
- `AppShell.tsx`

Rules for the migration:
- keep business logic in `src/shared/screens/<screen>`
- keep native UI here
- keep web UI in `src/views/web/<screen>.tsx`
- expand this folder screen by screen instead of rewriting the whole client at once
- grow `AppShell.tsx` into the future mobile root instead of duplicating navigation logic per screen
- route secondary sections through `more.tsx`, so the main mobile tab bar stays compact

Navigation contract:
- native deep links are parsed in `src/app/router.native.ts`
- `AppShell.tsx` consumes app routes from that shared router layer
- `NativeAuthRoot.tsx` consumes auth routes from the same contract
- platform helper files in `src/platform/*Linking.ts` now stay as compatibility wrappers only
