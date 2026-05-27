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
pnpm run migration:run        # apply pending migrations
```

Unit and e2e have **different jest configs** — the `jest` block in `package.json` drives `pnpm run test` (rootDir `src/`, picks up `*.spec.ts`); `test/jest-e2e.json` drives `pnpm run test:e2e` (rootDir is the repo root, picks up `*.e2e-spec.ts`). A spec under `test/` is invisible to `pnpm run test`, and a spec under `src/` is invisible to e2e.

`docker-compose.db.yaml` declares the network `mymobiconf-dev-network` and volume `mymobiconfapi_mmc-data` as **external** — both must already exist (created by the sibling `mymobiconfapi` project) before `db:up` will succeed.

## Architecture

NestJS 11 HTTP service (Express platform) backed by Postgres via TypeORM 0.3, with Swagger and JWT/Passport auth. The starter `AppController`/`AppService` are still placeholder `Hello World`; real surface is exposed by the feature modules.

### Bootstrap & global wiring (`src/main.ts`)

- Hardcoded `app.listen(3333)` — `PORT`/`GUEST_PORT`/`HOST_PORT` env vars are **inert**. Change the literal in `main.ts` if you need a different port.
- `app.setGlobalPrefix('api')` — every controller route is served under `/api/...`.
- Global `ValidationPipe` with `{ whitelist: true, transform: true, forbidNonWhitelisted: true }` — DTOs must declare every accepted field via `class-validator` decorators, and unknown fields cause `400`. `transform: true` activates implicit type coercion (e.g. `ParseUUIDPipe`-friendly behavior, `enum` parsing from strings).
- Swagger UI is mounted at `/docs` with bearer auth scheme name `'access-token'` (use `@ApiBearerAuth('access-token')` on protected routes so the Swagger "Authorize" button targets the right scheme).

### Module graph (`src/app.module.ts`)

Three feature roots plus the global core layer:

- **`AuthModule`** (`src/core/auth/auth.module.ts`) — global `JwtModule.registerAsync({ global: true })` + `PassportModule.register({ defaultStrategy: 'organizador' })`. Registers only the `OrganizadorJwtStrategy` and `OrganizadorAuthGuard` providers; exports `OrganizadorAuthGuard`, `JwtModule`, `PassportModule`. The participant strategy is registered in a *different* module (see below) — this module is organizer-side only despite the generic name.
- **`ParticipantsModule`** (`src/participants/participants.module.ts`) — wires `EventosModule`, `EnrollmentsModule`, `AuthModule` (participant-side, see below), `ParticipantModule`, and `ExtrasModule` (note: a participant-side `ExtrasModule` exists separately from the organizer one). Participant signup/signin lives here, not in the core `AuthModule`.
- **`OrganizersModule`** (`src/organizers/organizers.module.ts`) — wires `ClientModule`, `CategoryModule`, `ExtrasModule`, `EnrollmentsModule`, `CheckInModule`. `EnrollmentsModule` exposes organizer-facing list/manage views over the same `Inscricao` entity used by participants; `CheckInModule` handles credenciamento (check-in), extra credentialing, cancellation, and enrollment statistics routes.

New feature modules go under `src/<area>/<sub-area>/` and are imported into either `ParticipantsModule` / `OrganizersModule` (or directly into `AppModule` for cross-cutting roots).

### Core layer (`src/core/`)

Shared infra that other modules depend on:

- `database/data-source.ts` — exports both the `DataSourceOptions` (consumed by `TypeOrmModule.forRoot`) and a default `DataSource` instance (consumed by the TypeORM CLI). Reads `POSTGRES_HOST` / `POSTGRES_PORT` / `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` / `POSTGRES_SSL` from `.env`. `synchronize: false`; entities are registered via the barrel below; `migrations` glob points at `src/core/database/migrations/*.{ts,js}`.
- `entities/entities.ts` — single barrel re-exporting every TypeORM entity as the `entities` array. **All new entities must be appended here** or TypeORM won't see them at runtime or migration-generation time. Entities themselves are organized by aggregate (`evento/`, `participante/`, `cliente/`, `inscricao/`, `atividade/`, `gamificacao/`, `qrcode/`, `galeria/`, `questionario/`, `certificado/`, `recuperacao/`, `endereco/`, `duvida/`, `tag/`).
- `modules/crypto/crypto.service.ts` — provides `criptografaMaoUnica` (SHA hash, one-way: passwords) and `criptografaMaoDupla` / `descriptografaMaoDupla` (AES cipher: PII like email and name). Reads `CRYPTO_SHA_ALGORITHM`, `CRYPTO_AES_ALGORITHM`, `CRYPTO_AES_KEY`, `CRYPTO_AES_IV` from `.env`. Currently consumed by the participant-side `AuthService` (signup/signin compare and store encrypted values, **not** raw values).
- `decorators/user.decorator.ts` — `@GetUser()` param decorator. Returns `request.user` typed as `any` (declare the destination type at the call site). What ends up there depends on which strategy authenticated the request — see "Auth strategies" below.
- `decorators/roles.decorator.ts` — `@Roles(...OrganizadorRolesEnum[])` writes the `'roles'` metadata key the organizer guard reads.
- `types/jwt-payload.type.ts` — `{ sub: string; role: string; iat?, exp? }`. Note: neither strategy actually returns this type any more (both do a DB lookup and return entities); this interface mostly documents the wire format.
- `enum/` — `organizador-roles.enum.ts` (RBAC: `admin`, `organizador`, `chair`) and `metodo-pagamento.enum.ts`.
- `utils/pagination.dto.ts` — shared `PaginationDto` (`page`, `limit` max 100, `order` via `OrderEnum` ASC/DESC, `search`) plus `pagination.interface.ts`. Used as a `@Query()` DTO by organizer list routes (e.g. check-in/enrollments); reuse it rather than re-declaring pagination params.

### Auth strategies (`src/core/auth/strategies/` + `src/core/guards/`)

Two parallel Passport strategies. **Each one performs a DB lookup in `validate()` and returns a full entity** — `request.user` is not a JWT payload at the handler level.

- **`OrganizadorJwtStrategy`** (name `'organizador'`, default strategy globally). On every authenticated request: loads `ClienteOrganizadores` by `payload.sub` with the `role` relation; rejects if missing, `ativo === false`, or has no role. Returns the `ClienteOrganizadores` entity. Throws at construction time if `JWT_SECRET` is unset.
- **`ParticipanteJwtStrategy`** (name `'participante'`). On every authenticated request: calls `ParticipantService.findById(payload.sub)`; rejects if missing. Returns the `Participante` entity. Registered in `src/participants/auth/auth.module.ts`, not the core `AuthModule`. Also throws at construction time if `JWT_SECRET` is unset.

The matching guards both authenticate *and* authorize in one step:

- **`OrganizadorAuthGuard`** (`src/core/guards/organizador-auth.guard.ts`) extends `AuthGuard('organizador')`. After the strategy populates `request.user`, its `handleRequest` cross-references `@Roles(...)` metadata against `user.role.nome` and throws `403` on mismatch. So one `@UseGuards(OrganizadorAuthGuard)` decorator covers both JWT verification and RBAC.
- **`ParticipanteAuthGuard`** (`src/core/guards/participante-auth.guard.ts`) extends `AuthGuard('participante')`. JWT-verify-only; there is no role concept on the participant side.

### Auth/RBAC patterns

**Organizer route (JWT + role check):**

```ts
@UseGuards(OrganizadorAuthGuard)
@Roles(OrganizadorRolesEnum.Admin)
@Controller('organizers/client')
export class ClientController {
  @Get('me')
  findMe(@GetUser() user: ClienteOrganizadores) {
    return this.clientService.findOrganizadorById(user.id);
  }
}
```

**Participant route (JWT only):**

```ts
@Controller('eventos/:eventoId')
export class EnrollmentsController {
  @Post('inscricao')
  @UseGuards(ParticipanteAuthGuard)
  create(
    @Param('eventoId', ParseUUIDPipe) eventId: string,
    @GetUser() participant: Participante,
    @Body() dto: CreateEnrollmentDto,
  ) { ... }
}
```

### JWT issuance

JWTs are minted **in-process** by `src/participants/auth/auth.service.ts` — `signUp`, `singIn` (note typo in method name), and `refreshToken` all use `JwtService.sign({ sub })`. Access tokens expire in `1d`, refresh tokens in `3d`. Refresh uses `jwtService.verify` against the same `JWT_SECRET` — there is currently **no separate refresh secret and no refresh-token rotation/blacklist**. Email is AES-encrypted before being stored or compared; password is SHA-hashed (one-way). There is no organizer-side signup endpoint yet — organizer JWTs are presumed minted by an external/admin flow that has not been built into this codebase.

### Reserved/unused config

- `SWAGGER_ENABLED` env var is declared in `.env` but never read; Swagger is always-on.
- `PORT` / `GUEST_PORT` / `HOST_PORT` are inert (see Bootstrap note).

## Conventions

- **Domain naming is Portuguese** (`Evento`, `Participante`, `Inscricao`, `Atividade`, `OrganizadorRolesEnum`); module/service/file names mostly track that (`eventos.module.ts`, `participante.entity.ts`). Module *roots* exposed to wiring are English (`OrganizersModule`, `ParticipantsModule`, `EnrollmentsModule`). Service method names sometimes mix locales too (e.g. `criptografaMaoUnica`, `findOrganizadorById`) — match the locale of the surrounding code rather than translating.
- **TypeScript**: `module: nodenext`, `target: ES2023`, `strictNullChecks: true`, but `noImplicitAny: false`, `strictBindCallApply: false`, `strictPropertyInitialization: false` — intentionally loose so TypeORM entity classes don't need definite-assignment assertions on every column.
- **ESLint**: `typescript-eslint` recommendedTypeChecked + prettier. `@typescript-eslint/no-explicit-any` is **off**; `no-floating-promises` and `no-unsafe-argument` are **warn**. `endOfLine: auto` keeps Windows checkouts from erroring.
- **Prettier**: single quotes, trailing commas `all`.
- **Imports**: the codebase mixes absolute (`src/core/...`) and relative (`../../core/...`) paths. There's no path alias configured in `tsconfig.json` — `src/...` resolves because `baseUrl: "./"`. Either style is accepted; relative imports are slightly more common for in-module siblings.
- **Nest CLI**: `sourceRoot: src`, `deleteOutDir: true` — each build wipes `dist/`.
