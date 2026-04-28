# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`). A `.env` at the repo root is loaded via `dotenv.config()` in `src/core/database/data-source.ts`.

```bash
pnpm install                  # install deps
pnpm run start:dev            # nest start --watch (primary dev loop)
pnpm run start:debug          # watch + Node inspector
pnpm run start                # one-shot run
pnpm run start:prod           # node dist/main

pnpm run build                # nest build → dist/  (deleteOutDir wipes dist first)
pnpm run lint                 # eslint --fix across {src,apps,libs,test}/**/*.ts
pnpm run format               # prettier --write src/ test/

pnpm run test                 # unit jest, rootDir=src, *.spec.ts
pnpm run test:watch
pnpm run test:cov             # coverage → ./coverage
pnpm run test:e2e             # jest --config test/jest-e2e.json, *.e2e-spec.ts

# single test
pnpm exec jest src/app.controller.spec.ts
pnpm exec jest --config ./test/jest-e2e.json test/app.e2e-spec.ts
pnpm exec jest -t "should return"

# database (Docker)
pnpm run db:up                # docker compose up -d  (mmc-database-dev on Postgres 17)
pnpm run db:down              # stop+remove container; data persists in external volume mymobiconfapi_mmc-data
pnpm run db:logs              # follow Postgres logs

# migrations (TypeORM CLI via typeorm-ts-node-commonjs)
pnpm run typeorm -- <cmd>     # generic entry, points at src/core/database/data-source.ts
pnpm run migration:generate   # writes ./src/core/database/migrations/migration<timestamp>.ts
```

Unit and e2e have **different jest configs** — the `jest` block in `package.json` drives `pnpm run test` (rootDir `src/`, picks up `*.spec.ts`); `test/jest-e2e.json` drives `pnpm run test:e2e` (rootDir is the repo root, picks up `*.e2e-spec.ts`). A spec under `test/` is invisible to `pnpm run test`, and a spec under `src/` is invisible to e2e.

`docker-compose.db.yaml` declares the network `mymobiconf-dev-network` and volume `mymobiconfapi_mmc-data` as **external** — both must already exist (created by the sibling `mymobiconfapi` project) before `db:up` will succeed.

## Architecture

NestJS 11 HTTP service (Express platform) backed by Postgres via TypeORM 0.3, with Swagger and JWT/Passport auth. The starter `AppController`/`AppService` are still placeholder `Hello World`; real surface is exposed by the feature modules.

### Bootstrap & global wiring (`src/main.ts`)

- Hardcoded `app.listen(3333)` — `PORT`/`GUEST_PORT`/`HOST_PORT` env vars are **inert**. Change the literal in `main.ts` if you need a different port.
- `app.setGlobalPrefix('api')` — every controller route is served under `/api/...`.
- Swagger UI is mounted at `/docs` with bearer auth scheme name `'access-token'` (use `@ApiBearerAuth('access-token')` on protected routes so the Swagger "Authorize" button targets the right scheme).

### Module graph (`src/app.module.ts`)

Three feature roots plus the global core layer:

- `AuthModule` (`src/core/auth/`) — global JWT (`JwtModule.registerAsync({ global: true })`) + Passport with `defaultStrategy: 'organizador'`. Exports `OrganizadorGuard`, `JwtModule`, `PassportModule` so feature modules can `imports: [AuthModule]` to get auth context.
- `ParticipantsModule` (`src/participants/`) — public-facing participant endpoints. Currently wires `EventosModule` (`GET /api/eventos`).
- `OrganizersModule` (`src/organizers/`) — admin/back-office endpoints. Currently wires `ClientModule` (`GET /api/organizers/client/me`, guarded by role).

New feature modules go under `src/<area>/<sub-area>/` and are imported into either `Participants`/`Organizers` (or directly into `AppModule` for cross-cutting roots).

### Core layer (`src/core/`)

Shared infra that other modules depend on:

- `database/data-source.ts` — exports both the `DataSourceOptions` (consumed by `TypeOrmModule.forRoot`) and a default `DataSource` instance (consumed by the TypeORM CLI). `synchronize: false`; entities are registered via the barrel below; `migrations` glob points at `src/core/database/migrations/*.{ts,js}` — **this directory does not exist yet** and will be created by the first `migration:generate` run.
- `entities/entities.ts` — single barrel re-exporting every TypeORM entity as the `entities` array. **All new entities must be appended here** or TypeORM won't see them at runtime or migration-generation time. Entities themselves are organized by aggregate (`evento/`, `participante/`, `cliente/`, `inscricao/`, `atividade/`, `gamificacao/`, `qrcode/`, `galeria/`, `questionario/`, `certificado/`, `recuperacao/`, `endereco/`, `duvida/`, `tag/`).
- `auth/strategies/organizador-jwt.strategy.ts` — Passport JWT strategy named `'organizador'`. **Throws at construction time if `JWT_SECRET` is unset**, so the app will refuse to boot without it. `validate()` returns the decoded `JwtPayload` (`sub`, `role`) directly — that becomes `request.user`.
- `guards/organizador.guard.ts` — RBAC guard. Reads `request.user`, asserts the role is in `OrganizadorRolesEnum` (`admin`, `organizador`, `chair`), and intersects with the `@Roles(...)` metadata on the handler. **Note**: there is currently a near-duplicate at `src/core/auth/guards/organizador.guard.ts` exported from `AuthModule.providers`; the rest of the codebase (controllers and `client.controller.ts`) imports the one at `src/core/guards/organizador.guard.ts`. Treat the `core/guards/` copy as canonical and prefer collapsing the duplicate over forking it further.
- `decorators/roles.decorator.ts` — `@Roles(...OrganizadorRolesEnum[])` writes the `'roles'` metadata key the guard reads.
- `decorators/user.decorator.ts` — `@GetUser() user: JwtPayload` param decorator pulls the JWT payload off the request.
- `types/jwt-payload.type.ts` — `{ sub: string; role: string; iat?, exp? }`. The strategy does not currently issue tokens itself; an external service is expected to mint JWTs that match this shape.
- `enum/` — `organizador-roles.enum.ts` (RBAC) and `metodo-pagamento.enum.ts`.

### Auth/RBAC pattern for new routes

Use the stack already proven in `src/organizers/client/client.controller.ts`:

```ts
@UseGuards(OrganizadorGuard)
@Roles(OrganizadorRolesEnum.Admin)
@Controller('organizers/client')
export class ClientController {
  @Get('me')
  findMe(@GetUser() user: JwtPayload) { ... }
}
```

The guard does **not** authenticate — it only authorizes a request whose `user` was already populated by the `'organizador'` Passport strategy (which is the global `defaultStrategy`). If a route needs JWT verification before the role check, apply Passport's `AuthGuard('organizador')` (or rely on the default strategy via your own composite guard) **before** `OrganizadorGuard`.

### Reserved/unused config

- `.env` defines `CRYPTO_SHA_ALGORITHM`, `CRYPTO_AES_ALGORITHM`, `CRYPTO_AES_KEY`, `CRYPTO_AES_IV` — no consumer yet; reserved for an upcoming crypto utility.
- `SSL` and `SWAGGER_ENABLED` env vars are declared but not read anywhere; Swagger is currently always-on.
- `GUEST_PORT`/`HOST_PORT` (see Bootstrap note above) are inert.

## Conventions

- **Domain naming is Portuguese** (`Evento`, `Participante`, `Inscricao`, `Atividade`, `OrganizadorRolesEnum`); module/service/file names mostly track that (`eventos.module.ts`, `participante.entity.ts`). Module *roots* exposed to wiring are English (`OrganizersModule`, `ParticipantsModule`). Match the locale of the surrounding code rather than translating.
- **TypeScript**: `module: nodenext`, `target: ES2023`, `strictNullChecks: true`, but `noImplicitAny: false`, `strictBindCallApply: false`, `strictPropertyInitialization: false` — intentionally loose so TypeORM entity classes don't need definite-assignment assertions on every column.
- **ESLint**: `typescript-eslint` recommendedTypeChecked + prettier. `@typescript-eslint/no-explicit-any` is **off**; `no-floating-promises` and `no-unsafe-argument` are **warn**. `endOfLine: auto` keeps Windows checkouts from erroring.
- **Prettier**: single quotes, trailing commas `all`.
- **Imports**: the codebase mixes absolute (`src/core/...`) and relative (`../../core/...`) paths. There's no path alias configured in `tsconfig.json` — `src/...` resolves because `baseUrl: "./"`. Either style is accepted; relative imports are slightly more common for in-module siblings.
- **Nest CLI**: `sourceRoot: src`, `deleteOutDir: true` — each build wipes `dist/`.
