# Copilot / AI Agent Instructions for this repository

This is an Angular 18 application scaffolded with the Angular CLI. The notes below describe the repository structure, important conventions, and concrete examples an AI coding agent can use to make safe, correct edits.

1. Big picture
- **Framework & tooling**: Angular 18, TypeScript (~5.5), CLI-driven project. Key commands live in `package.json` (`start`, `build`, `test`, `watch`). The CLI config lives in `angular.json`.
- **Source layout**: main code is under `src/`. App entrypoint and wiring are in `src/app`.
- **Routing & app providers**: router is provided in `src/app/app.config.ts` via `provideRouter(routes)` where `routes` are declared in `src/app/app.routes.ts` (currently an empty `Routes` array). `provideZoneChangeDetection({ eventCoalescing: true })` is used for change detection configuration — when adding providers or global services, prefer updating `appConfig.providers`.

2. Where to make changes
- UI components: `src/app/features/` and `src/app/shared/components/` (e.g. `product-card`, `button`, `modal`). New components should use the Angular schematics conventions (`ng generate component`) and follow existing style: SCSS and `app` selector prefix.
- Core services and models: `src/app/core/` holds subfolders `auth/`, `http/`, `models/`, `utils/`. These directories are currently placeholders; place cross-cutting services here (HTTP wrappers, auth guards, DTO models).
- Assets & styles: static assets live in `public/`. Global styles are in `src/styles.scss` and component styles are SCSS.

3. Build / test / run (exact commands)
- Development server: `npm start` (runs `ng serve`) — serves at `http://localhost:4200/`.
- Build: `npm run build` (configured in `angular.json` to output to `dist/ecommerce`). Use `npm run watch` for continuous development builds.
- Tests: `npm test` (Karma + Jasmine). There is no e2e runner configured by default.

4. Project-specific conventions & patterns
- **SCSS styles**: The project uses SCSS by default (see `angular.json` schematic defaults). When generating components, ensure `--style=scss` or use the schematic defaults.
- **Component prefix**: Angular `prefix` is `app` (set in `angular.json`). New selectors should follow `app-...`.
- **Router wiring**: All new routes should be added to `src/app/app.routes.ts`. Because `provideRouter(routes)` is used, route changes may require edits to both `app.routes.ts` and any lazy-loaded module index files.
- **Global providers**: Add application-wide providers in `src/app/app.config.ts` inside `appConfig.providers`. Do not modify `main.ts` to add runtime providers unless necessary.

5. Integration points & external dependencies
- HTTP & Auth: Expect to add API wrappers under `src/app/core/http` and authentication logic under `src/app/core/auth`. There is no `src/environments` folder present in the repository — create `src/environments/environment.ts` and `src/environments/environment.prod.ts` if you need environment-based base URLs or feature flags.
- Third-party libs: Dependencies are declared in `package.json` (Angular packages, `rxjs`, `zone.js`). Add new runtime dependencies to `package.json` and run `npm install` in CI locally.

6. Examples (copyable guidance)
- Add a new top-level route:
  - Edit `src/app/app.routes.ts` and push a `Route` into the exported `routes` array.
- Register a global provider:
  - Edit `src/app/app.config.ts` and add the provider to `providers: [...]` (e.g. an HTTP interceptor or global service factory).
- Add an API base URL:
  - Create `src/environments/environment.ts` exporting `export const environment = { production: false, apiBase: 'https://api.example.com' }` and reference it from `src/app/core/http` service implementations.

7. What I did _not_ assume
- There are placeholder directories under `src/app/core/` (they may be empty). Do not remove them — they indicate intended places for cross-cutting code.
- No environment files found. Do not assume an existing env config; create `src/environments` when needed.

8. When in doubt
- Prefer non-invasive changes: add new files, register providers in `app.config.ts`, add routes to `app.routes.ts`.
- Run `npm start` locally to confirm behavior before large refactors.

If anything here is unclear or you want me to include extra examples (unit test patterns, CI steps, or a suggested `environment.ts` template), tell me which area to expand and I'll iterate.
