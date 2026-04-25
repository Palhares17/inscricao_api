# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`). A `.env` at the repo root is loaded via `dotenv.config()` in `src/core/database/data-source.ts`.

```bash
pnpm install                  # install deps
pnpm run start:dev            # run with watch mode (primary dev loop)
pnpm run start:debug          # watch + Node inspector
pnpm run start                # one-shot run
pnpm run start:prod           # run compiled output from dist/main

pnpm run build                # nest build → dist/
pnpm run lint                 # eslint --fix across src/apps/libs/test
pnpm run format               # prettier --write

pnpm run test                 # unit tests (jest, rootDir = src, *.spec.ts)
pnpm run test:watch
pnpm run test:cov             # coverage → ./coverage
pnpm run test:e2e             # jest with test/jest-e2e.json (rootDir = repo root, *.e2e-spec.ts)

# single test file
pnpm exec jest src/app.controller.spec.ts
pnpm exec jest --config ./test/jest-e2e.json test/app.e2e-spec.ts
# single test name
pnpm exec jest -t "should return"
```

Unit and e2e tests use different jest configs — the `jest` block in `package.json` drives `pnpm run test` (scoped to `src/`), while `test/jest-e2e.json` drives `pnpm run test:e2e` (scoped to the repo root). A spec file placed in `test/` will not be picked up by `pnpm run test`.

## Architecture

NestJS 11 HTTP service (Express platform) backed by Postgres via TypeORM. Currently at starter scaffolding — `AppController` / `AppService` are placeholder `Hello World`, and the real structure is the wiring below.

- **Entry point**: `src/main.ts` bootstraps `AppModule` and listens on `process.env.PORT ?? 3000`. Note: `.env` declares `GUEST_PORT=3333` / `HOST_PORT=3333` but `main.ts` reads `PORT`, so those env vars are currently inert — either set `PORT` or update `main.ts` when adding real config.
- **Root module**: `src/app.module.ts` imports `TypeOrmModule.forRoot(dataSourceOptions)` from `src/core/database/data-source.ts`. New feature modules should be added to `AppModule.imports`.
- **Database config**: `src/core/database/data-source.ts` exports both the `DataSourceOptions & SeederOptions` object (consumed by `TypeOrmModule`) and a default `DataSource` instance (consumed by the TypeORM CLI for migrations/seeds). Migrations are expected at `src/core/database/migrations/*.{ts,js}` — this directory does not yet exist and should be created alongside the first migration. `typeorm-extension` is installed for seeding.
- **Crypto envs**: `.env` defines `CRYPTO_SHA_ALGORITHM`, `CRYPTO_AES_ALGORITHM`, `CRYPTO_AES_KEY`, `CRYPTO_AES_IV` — no consumer exists yet; these are reserved for an upcoming crypto utility.

## Conventions

- **TypeScript**: `module: nodenext`, `target: ES2023`, `strictNullChecks: true` but `noImplicitAny: false` and `strictBindCallApply: false` — intentionally loose on `any` and bind/call/apply.
- **ESLint**: `typescript-eslint` recommendedTypeChecked + prettier. `@typescript-eslint/no-explicit-any` is **off**, `no-floating-promises` and `no-unsafe-argument` are **warn**. `endOfLine: auto` in the prettier rule keeps Windows checkouts from erroring.
- **Prettier**: single quotes, trailing commas `all`.
- **Nest CLI**: `sourceRoot: src`, `deleteOutDir: true` — each build wipes `dist/`.
