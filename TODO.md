# TODO - Remove Lovable AI traces + deployment readiness

- [ ] Remove Lovable-related bun config from `bunfig.toml`.
- [ ] Remove Lovable-related entries by deleting `bun.lock` so dependencies regenerate.
- [ ] Reinstall dependencies (Bun) and ensure lockfile is regenerated.
- [ ] Run `bun run build` (or `bun run lint`) to ensure everything still compiles.
- [ ] Validate deployment config (Vercel/Cloudflare) with existing `vercel.json` / `wrangler.jsonc`.
- [ ] Re-run repo search for `lovable` / `ai-generated` strings to confirm removal.

