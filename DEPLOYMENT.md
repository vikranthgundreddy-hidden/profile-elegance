# Deploying to Your Own Supabase Project

This project was built on a managed Supabase backend. The application code is
already environment-driven — every Supabase URL and key is read from
`import.meta.env.VITE_*` (browser) or `process.env.*` (server). No source
file contains a hardcoded project reference. Migration is a configuration +
data-layer task only; no application logic needs to change.

---

## 1. Create your Supabase project

1. Create a new project at https://supabase.com.
2. Note the **Project Ref** (e.g. `abcdwxyz`) and the API URL
   `https://<ref>.supabase.co`.
3. From **Project Settings → API**, copy:
   - `anon` / publishable key  → `*_PUBLISHABLE_KEY`
   - `service_role` key        → `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## 2. Apply the database schema

Run every file in `supabase/migrations/` in filename order against the new
project. Either:

- **Supabase CLI** (recommended)
  ```
  supabase link --project-ref <your-ref>
  supabase db push
  ```
- **SQL editor**: paste each migration file in order and run.

Migrations are kept intact — they create the tables (`profile`,
`personal_details`, `private_details`, `timeline`, `gallery`, `hobbies`,
`bride_photos`, `meeting_requests`, `queries`), enable RLS, install
policies, and add the `set_updated_at()` trigger function.

## 3. Create storage buckets

The app expects two **private** buckets (URLs are signed at read time):

| Bucket          | Visibility | Used by                              |
| --------------- | ---------- | ------------------------------------ |
| `gallery`       | Private    | Gallery section / Admin uploads      |
| `bride-photos`  | Private    | "Request photos" submissions / Admin |

Create them in **Storage → New bucket** (uncheck "Public"). Add storage RLS
policies matching the originals if you customized them.

## 4. Configure Auth

- **Email/password**: enable in **Authentication → Providers**.
- **Site URL & redirect URLs**: add your deployment origin
  (e.g. `https://yourdomain.com`) under **Authentication → URL Configuration**.
- Create the admin user in **Authentication → Users → Add user** (the admin
  dashboard at `/admin` requires a signed-in user).
- Anonymous sign-ups: leave disabled unless needed.

There are **no Edge Functions** in this project (`supabase/functions/` is
empty). All server logic runs through TanStack Start server functions
(`createServerFn`) hosted alongside the app.

## 5. Set environment variables

Copy `.env.example` → `.env` for local dev, and configure the same variables
in your hosting provider (Vercel / Netlify / Cloudflare / etc.) for prod.

### Required client-visible (bundled into the browser)
| Var                                | Value                                       |
| ---------------------------------- | ------------------------------------------- |
| `VITE_SUPABASE_URL`                | `https://<your-ref>.supabase.co`            |
| `VITE_SUPABASE_PUBLISHABLE_KEY`    | anon / publishable API key                  |
| `VITE_SUPABASE_PROJECT_ID`         | `<your-ref>`                                |

### Required server-side (SSR + server functions)
| Var                                | Value                                       |
| ---------------------------------- | ------------------------------------------- |
| `SUPABASE_URL`                     | same as `VITE_SUPABASE_URL`                 |
| `SUPABASE_PUBLISHABLE_KEY`         | same as `VITE_SUPABASE_PUBLISHABLE_KEY`     |
| `SUPABASE_PROJECT_ID`              | `<your-ref>`                                |
| `SUPABASE_SERVICE_ROLE_KEY`        | **secret** — service_role key, server only  |
| `PRIVATE_SECTION_PASSWORD`         | **secret** — password gating `/` private section |

> Never expose `SUPABASE_SERVICE_ROLE_KEY` or `PRIVATE_SECTION_PASSWORD` to
> the browser — they are read only inside `*.server.ts` / `*.functions.ts`
> handlers.

## 6. Update the local Supabase config (optional)

`supabase/config.toml` currently pins the old project ref:

```
project_id = "wasnbcktjggqakyjubzi"
```

Replace with your own ref if you plan to use the Supabase CLI locally:

```
project_id = "<your-ref>"
```

This file is only used by the CLI; it does not affect the running app.

## 7. Build & deploy

```
bun install
bun run build
```

Deploy the build output to your platform of choice. The runtime needs the
server env vars above to be present.

---

## Inventory of Supabase touchpoints (for reference)

| Concern              | Where                                                                 |
| -------------------- | --------------------------------------------------------------------- |
| Browser client       | `src/integrations/supabase/client.ts` (reads `VITE_*` / `process.env`) |
| Server admin client  | `src/integrations/supabase/client.server.ts` (service role)            |
| Auth middleware      | `src/integrations/supabase/auth-middleware.ts` (bearer validation)     |
| Bearer attacher      | `src/integrations/supabase/auth-attacher.ts` + `src/start.ts`          |
| Generated types      | `src/integrations/supabase/types.ts` (regenerate via `supabase gen types`) |
| DB reads             | `src/lib/site-data.ts`, `src/routes/biodata.tsx`, `src/routes/admin.tsx` |
| DB writes            | `src/routes/admin.tsx`, `src/routes/index.tsx` (forms)                 |
| Storage              | buckets `gallery`, `bride-photos` used in `admin.tsx`, `index.tsx`, `site-data.ts` |
| Private section RPC  | `src/lib/private.functions.ts` (uses `PRIVATE_SECTION_PASSWORD`)       |
| Migrations           | `supabase/migrations/*.sql` (apply in order)                           |
| Edge Functions       | none                                                                   |

---

## Files added by this preparation pass

- `.env.example` — template listing every env var the app reads.
- `DEPLOYMENT.md` — this guide.

No application source files were modified. No deployment was performed.
