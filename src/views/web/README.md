Canonical web screens live in this folder.

Current migration layout:
- `src/shared/screens/<screen>`: screen logic, data loading, derived state
- `src/views/web/<screen>.tsx`: canonical web presentation entrypoint
- `src/views/<screen>.tsx`: compatibility alias during migration
- `src/views/native/<screen>.tsx`: native presentation entrypoint

Transitional `*-screen.tsx` files have been removed.

Next cleanup step:
- gradually retire `src/views/<screen>.tsx` aliases once nothing imports them
- keep new work in `shared/screens` plus `views/web` or `views/native`
