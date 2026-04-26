First native entrypoints live here.

Current scope:
- `goals.tsx`
- `reminders.tsx`

Rules for the migration:
- keep business logic in `src/shared/screens/<screen>`
- keep native UI here
- keep web UI in `src/views/web/<screen>.tsx`
- expand this folder screen by screen instead of rewriting the whole client at once
