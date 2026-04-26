Canonical web screens live in this folder.

Current migration layout:
- `src/shared/screens/<screen>`: screen logic, data loading, derived state
- `src/views/web/<screen>.tsx`: web presentation entrypoint
- `src/views/<screen>.tsx`: compatibility alias during migration
- `src/views/<screen>-screen.tsx`: transitional thin-screen files kept for safe rollout

Next RN step:
- add `src/views/native/<screen>.tsx`
- reuse `src/shared/screens/<screen>` from both web and native
