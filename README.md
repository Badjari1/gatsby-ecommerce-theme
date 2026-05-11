# SynergyInvest Governance Portal

A production-oriented Next.js + TypeScript portal for SynergyInvest Inc. covering governance operations, shareholder records, investor profiles, property assets, controlled documents, and audit logging.

## Architecture decisions

- **Application framework:** Next.js App Router for colocated server-rendered UI and API-first route handlers.
- **Database:** PostgreSQL with Prisma migrations for typed data access and auditable schema evolution.
- **Authentication:** NextAuth credentials provider with bcrypt password verification, JWT sessions, inactive-user checks, and short-lived sessions.
- **Authorization:** Central role-based access control in `lib/auth/permissions.ts`, enforced in API routes and dashboard access paths.
- **Validation:** Zod request schemas at service boundaries for strong input validation before persistence.
- **Auditability:** Write-on-action audit event service for key create workflows and dashboard visibility.
- **Document storage:** Storage abstraction with a secure local implementation that can be replaced by S3, Azure Blob, or GCS without changing document services.
- **UI:** Responsive Tailwind dashboard with reusable shell, badges, and data table components.
- **Testing:** Vitest unit coverage for RBAC and validation primitives.

## Folder structure

```text
app/                         Next.js App Router pages and route handlers
  (auth)/login               Authentication UI
  (dashboard)/dashboard      Protected dashboard pages
  api/*                      API-first resource endpoints
components/                  Reusable UI, form, and dashboard components
lib/auth                     NextAuth options, session guards, RBAC permissions
lib/audit                    Structured audit event service
lib/*/*-service.ts           Domain services for documents, investors, properties, shareholders
lib/validation               Zod validation contracts
prisma/schema.prisma         PostgreSQL schema and Prisma models
prisma/migrations            SQL migrations
tests                        Foundational unit tests
```

## Local setup

1. Copy `.env.example` to `.env.local` and provide a secure `NEXTAUTH_SECRET`.
2. Start PostgreSQL and set `DATABASE_URL`.
3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client and migrate:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Run the application:

```bash
npm run dev
```


## Previewing the portal

After installing dependencies, run the unauthenticated static preview to review the dashboard experience without a database session:

```bash
npm run preview:ui
```

Then open `http://localhost:3000/preview`.

For authenticated local development, migrate the database and seed a secure administrator account:

```bash
SEED_ADMIN_PASSWORD="replace-with-a-unique-16-character-password" npm run db:seed
```

Sign in with `admin@synergyinvest.example` and the password supplied through `SEED_ADMIN_PASSWORD`.

## Quality checks

```bash
npm run typecheck
npm run test
npm run build
```

## Current capabilities

- Protected dashboard shell and executive overview.
- Shareholder, investor, property, and document list pages.
- REST-style JSON API routes for list and create operations.
- RBAC permission matrix for enterprise roles.
- Prisma schema with users, roles, shareholder register, investor profiles, properties, documents, and audit events.
- SQL migration for initial PostgreSQL deployment.
- Zod validation and audit logging in domain services.

## Remaining production gaps

- Add self-service user provisioning, password reset, MFA, and SSO/SAML/OIDC.
- Add row-level ownership constraints for shareholder and investor self-service views.
- Replace local document storage with managed object storage and malware scanning.
- Add form pages for create/edit workflows and optimistic UI updates.
- Add workflow modules for board meetings, voting, messaging, multilingual content, and governance resolutions.
- Add integration tests with a disposable PostgreSQL container in CI.
