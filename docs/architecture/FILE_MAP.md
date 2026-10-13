# AgileClix ERP — File Map

## Current repository (as of Phase 0 audit)

### Root

| Path | Role |
|------|------|
| `docker-compose.yml` | Production-oriented ERPNext stack (Coolify) |
| `docker-compose.override.yml` | Local port publish (dev only) |
| `Dockerfile` | `frappe/erpnext:v16.50.0` + `agileclix_branding` |
| `.dockerignore` | Build context exclusions |
| `.env` | Local secrets (gitignored) |
| `package.json` | ERPNext root; scripts → `banking/` |
| `pyproject.toml` | ERPNext Python package metadata (v17-dev pin) |
| `license.txt` | GPL-3.0 |
| `AgileClix_logo.png` | Brand asset source |
| `README.md` | Upstream ERPNext readme |

### Custom Frappe apps

| Path | Role |
|------|------|
| `agileclix_branding/agileclix_branding/hooks.py` | CSS/JS, boot, website context |
| `agileclix_branding/agileclix_branding/boot.py` | `enrich_boot_session`, `sync_branding_settings` |
| `agileclix_branding/agileclix_branding/public/**` | Logo, CSS, JS |
| `agileclix_branding/setup.py`, `pyproject.toml` | Packaging |

### ERPNext application (upstream fork)

| Path | Role |
|------|------|
| `erpnext/**` | Full ERPNext modules, DocTypes, tests, patches |
| `erpnext/hooks.py` | Standard ERPNext hooks (no AgileClix fork edits) |
| `erpnext/__init__.py` | Version `17.0.0-dev` |

### Embedded SPA (reference UI, not Next.js)

| Path | Role |
|------|------|
| `banking/package.json` | Vite + React 19 + Tailwind 4 |
| `banking/src/App.tsx` | Banking app entry |
| `banking/src/lib/frappe.ts` | Frappe error parsing |
| `banking/src/components/ui/**` | shadcn-style primitives |
| `banking/vite.config.ts` | Dev proxy to Frappe |

### CI / GitHub

| Path | Role |
|------|------|
| `.github/workflows/server-tests-mariadb.yml` | ERPNext DB tests |
| `.github/workflows/server-tests-postgres.yml` | Postgres compat tests (ERP dev) |
| `.github/workflows/linters.yml` | Ruff etc. |

### Documentation (Phase 0+)

| Path | Role |
|------|------|
| `docs/architecture/CURRENT_STATE.md` | This audit |
| `docs/architecture/TARGET_ARCHITECTURE.md` | Target design |
| `docs/architecture/GAP_ANALYSIS.md` | Gaps vs master prompt |
| `docs/architecture/FILE_MAP.md` | This file |
| `docs/architecture/IMPLEMENTATION_PLAN.md` | Phased tasks |

---

## Target repository layout (to be created)

Monorepo recommended; exact names follow master prompt.

```
agilexlic_erp/
├── apps/
│   └── web/                          # Next.js AgileClix UI
│       ├── app/                      # App Router routes
│       ├── components/               # Design system + features
│       ├── lib/                        # API client, auth, tokens
│       ├── styles/                     # Tailwind + CSS variables
│       ├── package.json
│       └── Dockerfile
├── services/
│   └── gateway/                      # FastAPI BFF
│       ├── app/
│       │   ├── main.py
│       │   ├── api/                    # Routers per domain
│       │   ├── core/                   # Config, security, tenancy
│       │   ├── frappe/                 # Frappe client adapters
│       │   └── models/                 # Pydantic schemas
│       ├── tests/
│       ├── pyproject.toml
│       └── Dockerfile
├── platform/
│   ├── worker/                         # Provisioning jobs
│   └── migrations/                     # Alembic (PostgreSQL)
├── frappe_apps/
│   └── agileclix_erp/                  # Replaces/extends agileclix_branding
│       ├── agileclix_erp/
│       │   ├── hooks.py
│       │   ├── api/                    # Whitelisted methods
│       │   └── fixtures/
│       └── pyproject.toml
├── deploy/
│   ├── docker-compose.prod.yml         # Full SaaS stack
│   ├── docker-compose.erp-tenant.yml   # Per-tenant ERP slice (optional)
│   └── traefik/                        # Dynamic config examples
├── agileclix_branding/                 # KEEP until merged → agileclix_erp
├── erpnext/                            # KEEP — upstream track; do not fork core
├── banking/                            # KEEP — reference; optional future port
├── docker-compose.yml                  # KEEP — legacy single-tenant until cutover
├── Dockerfile                          # EVOLVE — include agileclix_erp
└── docs/architecture/
```

### Route registry (web)

Planned under `apps/web/lib/routes/registry.ts` — maps module slugs to nav, permissions, and child paths (master prompt Phase 3).

### Allowlists (gateway)

Planned under `services/gateway/app/core/doctype_allowlist.py` — explicit DocTypes and HTTP methods.

---

## Files to modify in early phases (preview)

| File | Change |
|------|--------|
| `Dockerfile` | COPY `frappe_apps/agileclix_erp` (after app exists) |
| `docker-compose.yml` | Add gateway/web/postgres services (later compose file preferred) |
| `create-site` command in compose | Install `agileclix_erp` app |
| `agileclix_branding/*` | Deprecate after migration to `agileclix_erp` |

**Do not modify** `erpnext/**` for SaaS features — use `agileclix_erp` app only.
