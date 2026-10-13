# AgileClix ERP — Implementation Plan

**Ordering:** Matches master prompt Phase 9.  
**Rule:** Do not start Phase *N+1* until Phase *N* quality gates pass.  
**Production / `main`:** No merge without explicit approval.

---

## Phase 0 — Repository audit and architecture

| Task | Owner | Status |
|------|-------|--------|
| Inspect repo structure and versions | Architect | **PASS** |
| Document current vs target | Architect | **PASS** |
| Gap analysis | Architect | **PASS** |
| Feature branch `feature/agileclix-saas-phase0-architecture` | DevOps | **PASS** |
| Stakeholder sign-off to start Phase 1 | Product | **BLOCKED** (awaiting review) |

**Deliverables:** `docs/architecture/*.md`  
**Tests:** N/A  
**Known limitations:** v16 image vs v17 source tree documented in `CURRENT_STATE.md`.

---

## Phase 1 — Architecture foundation (three layers, scaffold only)

**Goal:** Skeleton `apps/web`, `services/gateway`, `frappe_apps/agileclix_erp` without full module UI.

| # | Task | Files |
|---|------|--------|
| 1.1 | Resolve version line: branch `release/v16.50` **or** upgrade image to v17 when stable | `Dockerfile`, docs |
| 1.2 | Scaffold `agileclix_erp` Frappe app (publisher ZentoriLabs); migrate branding hooks | `frappe_apps/agileclix_erp/**` |
| 1.3 | FastAPI app: health, correlation ID, config, Frappe client stub | `services/gateway/**` |
| 1.4 | Next.js app: layout shell placeholder, env for API URL | `apps/web/**` |
| 1.5 | Dev compose overlay: web + gateway + existing ERP stack | `deploy/docker-compose.dev.yml` |

**Quality gates:** `ruff`/`pytest` gateway smoke; `pnpm lint` + `tsc` web; Docker build three images; no ERPNext core edits.

---

## Phase 2 — Docker ERPNext dev environment

| # | Task |
|---|------|
| 2.1 | Document local full stack (ERP + gateway + web + PG) |
| 2.2 | `bench`-compatible install of `agileclix_erp` in `create-site` |
| 2.3 | Align `AGILECLIX_ERP_IMAGE` build with pinned ERPNext version |

**Gate:** `create-site` exit 0; `bench list-apps` shows `erpnext`, `agileclix_erp`.

---

## Phase 3 — FastAPI gateway and authentication

| # | Task |
|---|------|
| 3.1 | Session store (Redis); login/logout proxying Frappe |
| 3.2 | CSRF for mutating routes |
| 3.3 | Rate limiting middleware |
| 3.4 | Standard error envelope `{ correlation_id, error, details }` |

**Gate:** Integration tests: login, 401 on protected route, CSRF rejection.

---

## Phase 4 — Tenant resolution and permission enforcement

| # | Task |
|---|------|
| 4.1 | PostgreSQL schema: tenants, domains, status |
| 4.2 | Middleware: domain → tenant → site name (server-side only) |
| 4.3 | Permission map: gateway checks + Frappe `has_permission` |

**Gate:** Two test tenants; cross-tenant access tests **FAIL** if any leak.

---

## Phase 5 — Design system

| # | Task |
|---|------|
| 5.1 | CSS variables / Tailwind theme tokens |
| 5.2 | AppShell, Sidebar, Topbar, ThemeSwitcher |
| 5.3 | Storybook or Ladle (optional) for components |

**Gate:** Visual regression optional; a11y lint on shell components.

---

## Phase 6 — `/desk` and app shell

| # | Task |
|---|------|
| 6.1 | Routes: `/login`, `/desk`, `/apps` |
| 6.2 | App launcher + workspace cards (static data → API) |
| 6.3 | Command palette stub |

**Gate:** E2E: login → land on `/desk`.

---

## Phase 7 — Generic list / form / detail renderers

| # | Task |
|---|------|
| 7.1 | Metadata adapter API (allowlisted DocTypes) |
| 7.2 | DataGrid, FormRenderer, FieldRenderer, LinkField |
| 7.3 | Routes `/records/[doctype]/**` |

**Gate:** CRUD on **Custom** test DocType in CI fixture.

---

## Phase 8 — Customer and Item modules

| # | Task |
|---|------|
| 8.1 | BFF adapters: Customer, Item |
| 8.2 | UI list + form for both |
| 8.3 | Permission tests per role |

---

## Phase 9 — Sales Order workflow

| # | Task |
|---|------|
| 9.1 | Quotation → Sales Order mappers via Frappe APIs |
| 9.2 | Submit/cancel SO |
| 9.3 | Linked documents panel |

---

## Phase 10 — Sales Invoice and accounting validation

| # | Task |
|---|------|
| 10.1 | SO → SI flow |
| 10.2 | Submit SI; verify GL entries via Frappe report API |
| 10.3 | **Mandatory E2E:** signup → provision → login → Customer → Item → Quotation → SO → SI → submit → GL |

---

## Phase 11 — Purchasing and inventory

Purchase Order, Receipt, Invoice, Stock Entry adapters (master prompt Phase 5 remainder).

---

## Phase 12 — Reporting and workflows

Report viewer, workflow actions, approvals route.

---

## Phase 13 — SaaS provisioning and billing

Worker, idempotent site create, plans, usage, suspend/restore.

---

## Phase 14 — Security hardening and production release

MFA, ASVS checklist, headers, secrets, backup/restore runbooks, Traefik prod compose, CI/CD, rollback.

---

## Phase completion report template

```
Phase: ___
PASS:    ___
FAIL:    ___
BLOCKED: ___
DEFERRED: ___

Evidence: (CI links, test commands, screenshots)
Limitations:
Next dependencies:
```

---

## Immediate next actions (after Phase 0 approval)

1. Merge or PR `feature/agileclix-saas-phase0-architecture` → `develop`.
2. Open tracking issue/epic per phase in GitHub.
3. Decide **v16.50 vs v17** pin (recommend v16.50 for production parity with current Coolify image).
4. Begin Phase 1.1–1.2 only (`agileclix_erp` scaffold + version decision).

**Phase 1 implementation is intentionally not started in this commit** pending your go-ahead.
