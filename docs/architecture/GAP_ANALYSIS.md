# AgileClix ERP — Gap Analysis

Mapping master prompt phases to **current** vs **required** state.

## Summary matrix

| Capability | Current | Target | Gap severity |
|------------|---------|--------|--------------|
| Headless Next.js UX | None | Full App Router app | **Critical** |
| FastAPI BFF | None | All UI API traffic | **Critical** |
| `agileclix_erp` Frappe app | None (`agileclix_branding` only) | APIs, hooks, allowlists | **High** |
| Multi-tenant (PG registry + site/DB per tenant) | Single `SITE_NAME` | SaaS provisioning | **Critical** |
| Design system (tokens + components) | Partial in `banking/` | Unified AgileClix DS | **High** |
| Metadata engine (DocType adapter) | Frappe Desk only | Gateway + UI renderers | **High** |
| Entity adapters (Customer, SO, SI, …) | Frappe REST (implicit) | Typed FastAPI + tests | **High** |
| Security (MFA, RBAC mapping, CSRF, rate limit) | Frappe defaults | BFF + platform | **High** |
| Traefik multi-host routing | Coolify single domain | Per-tenant domains | **Medium** |
| CI/CD for SaaS stack | ERPNext upstream CI | Gateway/web/compose pipelines | **Medium** |
| E2E golden path test | None | Signup → SI → GL | **Critical** |
| Version alignment (v16 image vs v17 source) | Misaligned | Single pinned line | **High** |

## Phase-by-phase gaps

### Phase 0 — Repository discovery

| Item | Status |
|------|--------|
| Audit complete | **PASS** |
| Architecture docs | **PASS** |
| Feature branch | **PASS** |

### Phase 1 — Architecture and rebranding

| Item | Current | Gap |
|------|---------|-----|
| Independent Next.js `/desk` | Frappe Desk | Build `apps/web` from scratch |
| FastAPI gateway | Missing | New `services/gateway` |
| `agileclix_erp` app | Missing | New app; migrate branding into it |
| No Desk dependency | Desk required today | Feature flags + routing cutover |
| ZentoriLabs publisher metadata | AgileClix only | Metadata update |

### Phase 2 — Design system

| Item | Current | Gap |
|------|---------|-----|
| Tokens (#2563EB, etc.) | Old blues in `agileclix_desk.css` | New token package in web |
| shadcn component set | banking/ui partial set | 20+ named components in web |
| Theme switcher | banking theme-provider | Product-wide |

**Reuse opportunity:** Port patterns from `banking/src/components/ui/*` and `frappe-react-sdk` error parsing — adapt to Next.js and BFF contracts (do not embed SDK against Frappe from browser in production).

### Phase 3 — Screen routes

| Item | Current | Gap |
|------|---------|-----|
| ~40+ route families | `/app`, `/desk` (Frappe), `/banking` | Full route registry in Next.js |
| Platform admin routes | System Manager in Desk | `/platform/*` in web + gateway |

### Phase 4 — Metadata engine

| Item | Current | Gap |
|------|---------|-----|
| DocType meta | `frappe.desk.form.load` etc. | Gateway allowlisted meta API |
| List/Form/Detail renderers | Frappe Form | React FormRenderer + FieldRenderer |
| Workflow UI | Desk | WorkflowActions component + API |

### Phase 5 — ERP API integration

| Item | Current | Gap |
|------|---------|-----|
| 15 named entities | Native DocTypes exist | BFF CRUD/submit/cancel + permission checks |
| Audit logging | Frappe Version | Platform audit + correlation ID |

### Phase 6 — Multi-tenant SaaS

| Item | Current | Gap |
|------|---------|-----|
| PostgreSQL | None | New schema + migrations |
| Provisioning worker | `create-site` one-shot | Queue-driven multi-site |
| Domain verification | None | DNS/HTTP challenge |
| Entitlements / billing | None | Plans table + enforcement hooks |
| Suspend/restore | None | Gateway block + Frappe read-only mode |

### Phase 7 — Security

| Item | Current | Gap |
|------|---------|-----|
| Session management | Frappe cookie | BFF session store |
| MFA | Optional in Frappe | Product requirement |
| Tenant isolation tests | None | Automated suite |
| No admin API for tenants | Risk if misconfigured | Service accounts per tenant |

### Phase 8 — Deployment

| Item | Current | Gap |
|------|---------|-----|
| Custom ERP image | Partial (`agileclix_branding`) | Add `agileclix_erp`, pin versions |
| Next/FastAPI images | None | New Dockerfiles |
| Production compose | Single-tenant Coolify | Multi-service compose + Traefik labels |
| Backups/monitoring | Manual/volume | Automated jobs + alerts |

### Phase 9 — Implementation order

Aligned with `IMPLEMENTATION_PLAN.md`; current repo completes **step 2 partially** (Docker ERP) only.

### Phase 10 — Quality gates

| Gate | Current |
|------|---------|
| Unit/integration tests for new stack | **FAIL** (not started) |
| Security tests | **FAIL** |
| Documented limitations | **PASS** (this doc set) |

## What we keep (no rewrite)

- `docker-compose.yml` pattern (configurator, create-site, workers) as **reference** for per-tenant provisioning scripts.
- `agileclix_branding` assets and hooks until merged into `agileclix_erp`.
- `erpnext/` as unmodified business engine (track upstream; avoid copying full tree into image).
- `banking/` as **reference UI** for shadcn/Tailwind/Frappe error handling — not as the main shell.

## Deferred (explicit)

- Full ERP module parity (HR, POS, etc.) — per master prompt, incremental after SO/SI path.
- AI approval workflows — placeholder in security phase.
- Replacing MariaDB with Postgres **for ERP** — out of scope (ERP stays MariaDB per site).
