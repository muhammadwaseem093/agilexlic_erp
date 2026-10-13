# AgileClix ERP — Current State (Repository Audit)

**Audit date:** 2026-10-13  
**Branch audited:** `develop` @ `3fbf6a9da5`  
**Remote:** `https://github.com/muhammadwaseem093/agilexlic_erp.git`  
**Default remote branch:** `origin/develop`

## Executive summary

This repository is primarily an **ERPNext application fork** (upstream-style tree under `erpnext/`) with **custom Docker Compose deployment** for Coolify/Hostinger and a small **Frappe custom app** `agileclix_branding` layered on the official **`frappe/erpnext:v16.50.0`** image.

There is **no** Next.js App Router frontend, **no** FastAPI gateway, **no** PostgreSQL platform database, **no** multi-tenant SaaS control plane, and **no** `agileclix_erp` Frappe app yet. Customer UX today is **standard Frappe Desk** plus optional CSS/JS branding.

## Repository topology

| Area | Present | Notes |
|------|---------|--------|
| `erpnext/` | Yes | Full ERPNext app source; `__version__ = "17.0.0-dev"`; `pyproject.toml` pins Frappe `>=17.0.0-dev,<18.0.0` |
| `frappe/` (framework) | No | Not vendored; supplied inside Docker image only |
| `agileclix_branding/` | Yes | Desk/login/website branding hooks, static assets |
| `agileclix_erp/` | No | Target custom app (Phase 1+) |
| `banking/` | Yes | **Vite + React 19** SPA (not Next.js); embedded in ERPNext at `/banking`; uses `frappe-react-sdk` |
| `docker-compose.yml` | Yes | Frappe Docker–style stack: configurator, create-site, MariaDB, Redis, workers, nginx frontend |
| `docker-compose.override.yml` | Yes | Local `8080:8080` only |
| `Dockerfile` | Yes | `FROM frappe/erpnext:v16.50.0` + COPY `agileclix_branding` |
| `docs/` | No (before Phase 0) | Architecture docs added in Phase 0 |
| CI (`.github/workflows`) | Yes | Upstream ERPNext workflows (MariaDB/Postgres tests, linters, release) — not Coolify/SaaS |

## Version and compatibility tension (critical)

| Component | Source tree | Production Docker image |
|-----------|-------------|-------------------------|
| ERPNext | `17.0.0-dev` | `v16.50.0` (image) |
| Frappe | Not in repo; metadata expects v17-dev | v16.x inside image |
| Python (pyproject) | `>=3.14` in root `pyproject.toml` | Image runtime per Frappe v16 |
| Node (banking) | Vite 8, React 19 | Built via ERPNext asset pipeline when upstream CI runs |

**Implication:** The git tree tracks **upstream ERPNext development** while deploys use a **pinned v16.50** image with only `agileclix_branding` copied in. Full-repo COPY or `bench build` against v17 source on v16 image has already caused deploy failures (mitigated by current Dockerfile strategy).

## Deployment state (Coolify)

- **Target URL:** `https://erp.agileclix.com` (frontend container port 8080 behind proxy).
- **Single-site model:** `SITE_NAME` env (default `erp.agileclix.com`); one MariaDB database per stack volume, not per-tenant registry.
- **Init jobs:** `configurator` → `create-site` → long-running `backend`, `websocket`, workers, `scheduler`, `frontend` (nginx).
- **Secrets:** `SERVICE_PASSWORD_64_ADMIN`, `SERVICE_PASSWORD_64_MARIADB` (Coolify-style naming).
- **Recent fix:** Configurator no longer runs `bench build` / `bench clear-cache` (exit 2 without site).

## Branding and authentication

### `agileclix_branding`

- Hooks: `app_include_css/js`, `boot_session`, `after_install`, `after_migrate`, `website_context`.
- Boot enrichment exposes `bootinfo.agileclix_branding` (app name, logo URL, colors).
- Publisher metadata still says **AgileClix** (not yet **ZentoriLabs** per master prompt).
- License: MIT (app); ERPNext remains **GPL-3.0** (`license.txt`, `package.json`).

### Authentication today

- **Frappe native:** Session/cookies via Desk and `/api`; Administrator user; password from `SERVICE_PASSWORD_64_ADMIN`.
- **No** BFF session layer, **no** MFA platform, **no** tenant resolution from domain at app layer (only `FRAPPE_SITE_NAME_HEADER` for single site).

## Existing frontend patterns (not headless SaaS UI)

`banking/` is the closest precedent for a modern UI in this repo:

- **Stack:** Vite, React 19, Tailwind 4, Radix/shadcn-style UI primitives, TanStack Table, `frappe-react-sdk`, React Router 8.
- **Integration:** Calls Frappe REST/RPC from the browser (same-origin when served under ERPNext).
- **Scope:** Banking reconciliation and statement import only — **not** a replacement for Desk.

There is **no** `apps/web` or `services/gateway` directory.

## ERPNext core modifications

- **No** AgileClix-specific edits detected in `erpnext/hooks.py` or core controllers (branding isolated to `agileclix_branding`).
- Upstream `extend_doctype_class` usage exists in stock ERPNext (e.g. `Address`).

## Licenses

| Artifact | License |
|----------|---------|
| `erpnext/`, root `package.json` | GPL-3.0 |
| `agileclix_branding` | MIT |
| `banking/` | Part of ERPNext repo (GPL context) |

SaaS distribution must comply with GPL obligations for ERPNext/Frappe derivatives (source offer, combination works).

## Quality and tests

- Extensive ERPNext Python tests under `erpnext/**/test_*.py`.
- Root `package.json` scripts: `dev`/`build` delegate to `banking/`.
- **No** tests for Docker Compose, Coolify, or AgileClix branding app.
- **No** E2E for tenant signup → SO → SI (master prompt gate).

## Phase 0 completion checklist

| Item | Status |
|------|--------|
| Repository structure inspected | PASS |
| Versions/branches identified | PASS |
| Next/FastAPI presence verified | PASS (absent; banking is Vite/React) |
| Branding/auth/tenancy assessed | PASS |
| Architecture docs created | PASS (this file set) |
| Existing work preserved | PASS (docs-only branch) |
| Feature branch before code changes | PASS (`feature/agileclix-saas-phase0-architecture`) |

**Phase 1 implementation:** BLOCKED until stakeholder review of this audit (per master prompt).
