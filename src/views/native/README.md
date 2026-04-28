First native entrypoints live here.

Current scope:
- `goals.tsx`
- `reminders.tsx`
- `challenges.tsx`
- `rewards.tsx`
- `progress-view.tsx`
- `settings.tsx`
- `AppShell.tsx`

Rules for the migration:
- keep business logic in `src/shared/screens/<screen>`
- keep native UI here
- keep web UI in `src/views/web/<screen>.tsx`
- expand this folder screen by screen instead of rewriting the whole client at once
- grow `AppShell.tsx` into the future mobile root instead of duplicating navigation logic per screen
- keep secondary flows out of the main tab bar unless they become first-class tabs

Navigation contract:
- native deep links are parsed in `src/app/router.native.ts`
- `AppShell.tsx` consumes app routes from that shared router layer
- `NativeAuthRoot.tsx` consumes auth routes from the same contract
- preview and standalone native runtime now share `src/app/native/NativeRuntimeRoot.tsx`
