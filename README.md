# weekly.

A weekly planner for students and learners. Make **projects**, add **tasks**, then give each task some **days** — every day becomes its own checkbox, and the week fills itself in.

Built from the functional spec in [`planner-clone-spec.md`](planner-clone-spec.md).

## Features

- **Projects → tasks → day slots**, with inline task entry (Enter adds the next one, Esc finishes; blank titles are skipped)
- **Assign days** modal: deadline (date + optional time), per-day subtasks with notes, drag subtasks between days, task description
- **Week board**: focus one day or show all days, progress for the week, each day, project and task
- **Missed** subtasks (past days, unfinished) with a **Move** menu that can record the miss
- **Week navigation** to plan ahead, with a ↩ back to this week
- **End week**: snapshot into the **Archive**, then carry unfinished work forward or clear the board
- **Copy / Paste plan** to reuse an archived week or share with a friend (optional checkmark reset)
- **Stats**: average/best week, streaks, missed count, weekly completion bars and a day-by-day heatmap
- **Light / Auto / Dark** theme, JSON backup export/import, undo on delete
- Keyboard: `N` new task in the last project, `←` / `→` change focused day
- Installable **PWA** that works offline
- Optional **Supabase** accounts with cloud sync; guest mode saves to `localStorage`

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

| Command | What it does |
|---|---|
| `npm test` | Unit tests (Vitest) for week math, progress, end week, plan text, stats, merge |
| `npm run build` | Type-check and production build to `dist/` |
| `npm run preview` | Serve the production build |

Tip: add `?today=2026-10-23` to the URL to pretend it's another day (handy for checking missed states).

## Enabling sign-in and sync (optional)

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL editor (one `plans` row per user, protected by row-level security).
2. Copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. In Supabase → Authentication → URL configuration, add your local and deployed URLs as redirect URLs.

On first sign-in the guest board is merged into the account; after that every change is saved (debounced 500 ms).

## Deploying

It's a static Vite app: deploy `dist/` anywhere (Vercel, Netlify, GitHub Pages). On Vercel, import the repo, keep the Vite preset, and add the two `VITE_SUPABASE_*` env vars if you want sync.

## Project layout

```
src/
├─ App.tsx, main.tsx        hash router (plan · stats · archive · auth), theme + sync bootstrap
├─ config.ts                app name and storage keys
├─ types.ts                 Project, Task, Slot, Archive
├─ lib/                     week math, progress, end week, plan text, stats, merge, theme, shortcuts
├─ store/                   usePlanner (persisted data), useUI (transient UI), sync (Supabase)
├─ components/              board, cards, menus, modals/
├─ pages/                   Plan, Stats, Archive, Auth
└─ styles/                  tokens.css (light/dark), base.css, app.css
```
