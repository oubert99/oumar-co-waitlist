# AGENTS.md

## Cursor Cloud specific instructions

This is a single-page **React 19 + Vite** waitlist site (`waitlist-app`) for the OUMAR "Stiff™ Jacket". It is deployed as a static site to GitHub Pages (see `.github/workflows/deploy.yml`).

### Commands (all from repo root)
- Dev server: `npm run dev` (Vite, serves on `http://localhost:5173/`).
- Lint: `npm run lint` (oxlint; one pre-existing `no-unused-vars` warning on `src/App.jsx` is expected and non-blocking).
- Build: `npm run build` (outputs to `dist/`).
- Preview production build: `npm run preview`.

### Backend / Supabase notes
- The waitlist backend is Supabase. `src/lib/supabase.js` ships **hardcoded fallback** Supabase URL + anon key, so joining the waitlist works out of the box with no `.env` file. Optionally override via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (see `.env.example`).
- Anon inserts into the `waitlist` table are allowed by RLS, but anon `SELECT` is not — a `GET` on the table returns 401, which is expected. Verify the backend via an insert (the app's "Join Waitlist" flow), not a read.
- `supabase/functions/waitlist-welcome/` is a Deno edge function (sends a Brevo welcome email). It is deployed to Supabase separately and is **not** part of the local Vite dev/build flow; it needs `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and a Brevo key configured on Supabase.

### Other notes
- The `data/` directory contains unrelated product-catalog JSON/SVG assets that are **not** referenced by the waitlist app build; ignore it for this app.
- Core "hello world" flow to validate the app: open the dev server, enter an email in the "Enter your email" field, click "Join Waitlist", and confirm the "You're In" modal appears.
