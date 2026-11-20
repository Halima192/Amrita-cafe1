# Amrita Coffee House

Premium interactive cafe website for Amrita Coffee House (Bilimora, Gujarat).

## Stack

React · Vite · TypeScript · Tailwind CSS · Framer Motion · Lucide React  
Games: local `RoomTransport` offline; Supabase Realtime when `.env` keys are set.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Typecheck + production build (`dist/`) |
| `npm run preview` | Preview the production build |
| `npm run lint` | Oxlint |

## Sample content

Menu prices, visit hours, phone, email, and social links are **labeled sample / placeholder** until owners confirm real details. Do not treat them as live cafe data.

## Games

- Offline: `src/games/transport/localTransport.ts` (same phone)
- Online: `src/games/transport/supabaseTransport.ts` when env keys are set
- Rules stay pure in `src/games/rules/`

### Enable cross-device play

1. Create a [Supabase](https://supabase.com) project
2. Run `supabase/migrations/001_game_rooms.sql` in the SQL Editor
3. Confirm `game_rooms` is in the `supabase_realtime` publication
4. Copy Project URL + anon key into `.env`:

| Variable | Notes |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | Anon/public key |

5. Restart `npm run dev`

Host: Create room → share code. Guest: Join room → paste code.

## Publish prep (Cursor `publish-app`)

1. `npm run build` must succeed (no TypeScript errors).
2. No secrets in the repo — only `.env.example` placeholders.
3. Bind real Supabase values via Cursor app secrets when Phase 5 ships.
4. Do not publish until instructed; this project is presentation-ready for owner review.

## Project status

Phases 1–4 + 6 complete. Phase 5 (Supabase Realtime) waiting on credentials.
