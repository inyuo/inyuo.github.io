# AGENTS.md

varHarrie's personal blog — a zero-backend GitHub Pages site. Posts/snippets come from
GitHub Issues (querying milestones), projects from GitHub repositories. Built with Vite.

## Toolchain

- **React 18 + TypeScript 4.9** (strict), **Vite 4** bundler.
- **Styling**: `twin.macro` (`tw.div\`...\``+`styled`) on top of Emotion + Tailwind.
Dark mode is class-based via the `use-dark-mode`hook; do not add raw Tailwind classes
elsewhere — express styles through`tw`template literals or the`tw="..."` JSX prop.
- **Icons**: `~icons/ri/...`, `~icons/octicon/...`, etc. from `unplugin-icons` (Vite handles the `~icons` virtual module).
- **CSS-as-string imports**: Prism themes + GitHub markdown CSS are imported as raw text
  (`...?raw`) and injected dynamically by `loadThemeStyles` (`src/utils.ts`). Follow this pattern for new theme swaps.
- **Markdown**: `markdown-it` with a custom `highlight` (Prism) via `src/utils.ts`; rendered by `MarkdownHtml`.
- **i18n**: `i18next` + `react-i18next`. Locales live in `src/i18n/locales/{cn,en}/translation.json`. Use `useTranslation()`; language is persisted under `localStorage['language']` (values `cn`/`en`).

## Commands

```bash
yarn dev       # vite dev server (http://localhost:5173)
yarn build     # runs `tsc && vite build` — typecheck IS part of build
yarn preview   # serve the built dist
```

There is **no `lint` or `test` script**. Verification is type-check + build:

```bash
npx tsc --noEmit          # typecheck only (tsconfig has noEmit, composite ref to tsconfig.node.json)
npx prettier --check .    # formatting only
npx prettier --write .    # fix formatting
```

## Environment setup

```bash
cp .env.example .env.local
# edit .env.local with your GitHub owner/repo and token
```

**Critical**: the GitHub token is **split into two env vars**
(`VITE_GITHUB_ACCESS_TOKEN_PART1` + `VITE_GITHUB_ACCESS_TOKEN_PART2`) and concatenated at
runtime in `src/services/github.ts`. Do **not** merge them into one variable. This split
exists to avoid the full token appearing in the committed/bundled source.

All env vars are `VITE_`-prefixed (exposed to the client bundle) and are **strings**.
Milestone identifiers are numbers: `VITE_GITHUB_MILESTONE_POSTS` and
`VITE_GITHUB_MILESTONE_SNIPPETS` are converted via `Number(...)` in `src/App.tsx`.

## Architecture / data flow

- `src/services/github.ts` — thin GitHub REST v3 client. Single default-exported singleton
  (`github`). Query params use `per_page` (not `pageSize`) mapped from options.
- `src/models/*.ts` — plain classes with a **private constructor** + static `from(raw)` factory
  that maps GitHub's snake_case `Issue`/`Milestone`/etc. to camelCase model fields
  (e.g. `raw.html_url` → `htmlUrl`, `raw.created_at` → `createdAt`). Add API fields by
  extending both the GitHub type in `github.ts` and the model `from()` mapping.
- `src/hooks/*` — `useHandling(fn, initial?)` wraps an async fn with a boolean loading flag;
  custom data hooks (`useArticle`, `useArticlesQuery`) follow the
  `useState + useHandling(Callback) + useEffect(load)` pattern in `src/views/*.tsx`.
  `useQuery()` reads typed URL search params via `react-router-dom`'s `useSearchParams`.
- `src/views/*.tsx` — route components (see `src/App.tsx` routes). Views import models, the
  `github` singleton, and UI components.
- Routing is `HashRouter` (GitHub Pages friendly) in `src/App.tsx`.

## Conventions

- Default-export React components (`export default function X()`). Views often wrapped in
  `memo()`.
- Styling defined alongside components as `const X = tw.tag\`...\``or`styled(...)`; keep
style extraction near the top of the file (see `src/views/Home.tsx`, `Main.tsx`).
- Prettier import order (via `@ianvs/prettier-plugin-sort-imports`):
  `^@/(.*)$` → `^[../]` → `^[./]`. (No `@` path alias is configured, so `@/` matches nothing local.)
- `.env.local` / `*.local` are gitignored; never commit secrets.

## Deployment

The `dist/` output is committed and served by GitHub Pages (note: `.gitignore` ignores
`dist-ssr` but **not** `dist`). To redeploy, rebuild and push `dist/` along with source.

## Gotchas

- `noEmit` is set; type errors must be fixed, not suppressed (`as any`/`@ts-ignore` are not used).
- The repo is the source of truth and is **not currently a git repository** in this workspace.
- No test suite exists; the only verification gate is `tsc` via `yarn build`.
