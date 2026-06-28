## Migration plan: TanStack Start → Vite + React Router SPA

### Heads-up before we start
- Lovable's preview/publish pipeline expects the TanStack template. After this migration the site becomes a static SPA shell (no SSR). It will still build and run, but:
  - Per-page SEO/OG metadata is no longer rendered server-side. Crawlers/link unfurlers will see whatever `react-helmet-async` injects after JS executes.
  - JSON-LD on `/` will only appear after hydration.
  - `sitemap.xml` becomes a static file in `public/`, not a server route.
- The current SPA conversion is intentionally one-way. Reverting means redoing the same amount of work.

---

### 1. Build / entry rewrite
- `vite.config.ts`: replace `@lovable.dev/vite-tanstack-config` with stock `vite` + `@vitejs/plugin-react-swc` + `vite-tsconfig-paths`. Keep the `@` alias and port 8080.
- Add `index.html` at project root with `<div id="root">` and `<script type="module" src="/src/main.tsx">`.
- Add `src/main.tsx`: creates `QueryClient`, renders `<BrowserRouter>` + `<HelmetProvider>` + `<Routes>`.
- Delete: `src/server.ts`, `src/start.ts`, `src/router.tsx`, `src/routes/__root.tsx`, `src/routeTree.gen.ts`, `src/routes/sitemap[.]xml.ts`, `src/routes/README.md`.
- Delete: `src/integrations/supabase/auth-middleware.ts`, `auth-attacher.ts`, `client.server.ts` (no server runtime anymore).
- Delete: `src/lib/error-capture.ts`, `src/lib/error-page.ts` (SSR-only).
- `package.json`: remove `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/router-plugin`, `@lovable.dev/vite-tanstack-config`, nitro/cloudflare deps. Add `react-router-dom`, `react-helmet-async`, `@vitejs/plugin-react-swc`, `vite-tsconfig-paths`.
- Move static `og-image.jpg`, `robots.txt`, new `sitemap.xml` into `public/`.

### 2. Route conversion
Each route file becomes a pure component with metadata via `<Helmet>`.

```text
src/routes/index.tsx      →  src/pages/Home.tsx       path "/"
src/routes/admin.tsx      →  src/pages/Admin.tsx      path "/admin"
src/routes/auth.tsx       →  src/pages/Auth.tsx       path "/auth"
src/routes/biodata.tsx    →  src/pages/Biodata.tsx    path "/biodata"
                          →  src/pages/NotFound.tsx   path "*"
```

Replacements (mechanical, no logic changes):
- `createFileRoute(...)({...})` → plain default-exported component.
- `useNavigate from @tanstack/react-router` → from `react-router-dom`; calls `navigate("/admin", { replace: true })` instead of `navigate({ to: "/admin", replace: true })`.
- `Link from @tanstack/react-router` → from `react-router-dom`; `to="/path"` (no `params`).
- `head: () => ({ meta, links, scripts })` → `<Helmet>` block at the top of each page component (title, description, og tags, canonical, JSON-LD via `<script type="application/ld+json">`).
- `useSuspenseQuery` stays (TanStack Query is unaffected).
- `Suspense fallback` stays.

### 3. Private password → Supabase Edge Function
- Create `supabase/functions/unlock-private/index.ts`:
  - POST JSON `{ password }`, CORS headers.
  - Timing-safe compare against `Deno.env.get("PRIVATE_SECTION_PASSWORD")`.
  - On success, use service role (`SUPABASE_SERVICE_ROLE_KEY`) to read one row from `private_details` and return it. On failure return 401.
- `src/lib/private.functions.ts` → rename to `src/lib/private.ts`. Replace the `createServerFn` export with `unlockPrivate({ password })` that calls `supabase.functions.invoke("unlock-private", { body: { password } })`. Same return shape, so `src/routes/index.tsx`'s caller is unchanged.
- Deploy the edge function. `PRIVATE_SECTION_PASSWORD` secret already exists in the project.

### 4. Auth + admin
- Sign-in flow stays on the Supabase JS client (already browser-side). No middleware to attach bearer tokens because there are no server functions anymore.
- `src/routes/admin.tsx` already gates via `supabase.auth.getUser()` in `useEffect`; keep that.

### 5. Sitemap
- Replace dynamic `sitemap[.]xml.ts` with a static `public/sitemap.xml` listing `/`, `/biodata`. (Admin/auth stay `noindex`.)

### 6. Verify
- `bun run build:dev` succeeds.
- Open `/`, `/admin`, `/auth`, `/biodata`, an unknown route (404 page).
- Submit the private-section password → confirm edge function is called and returns the row.

---

### Files added
`index.html`, `src/main.tsx`, `src/pages/{Home,Admin,Auth,Biodata,NotFound}.tsx`, `public/sitemap.xml`, `supabase/functions/unlock-private/index.ts`.

### Files modified
`vite.config.ts`, `package.json`, `src/lib/private.ts` (renamed from `.functions.ts`), `src/styles.css` (no change expected; verify Tailwind v4 still loads under stock Vite).

### Files deleted
`src/server.ts`, `src/start.ts`, `src/router.tsx`, `src/routes/` (entire folder), `src/routeTree.gen.ts`, `src/integrations/supabase/{auth-middleware,auth-attacher,client.server}.ts`, `src/lib/{error-capture,error-page}.ts`, `src/lib/lovable-error-reporting.ts` (TSS-specific).

Approve to proceed; I'll execute the full migration in one pass.
