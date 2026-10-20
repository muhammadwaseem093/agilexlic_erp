# AgileClix ERP — development

**Publisher:** ZentoriLabs  
**ERP runtime pin:** `frappe/erpnext:v16.50.0` ([VERSION_PIN.md](architecture/VERSION_PIN.md))

## Stacks

| Stack | Command | URLs |
|-------|---------|------|
| ERP only (Coolify / local) | `docker compose up -d --build` | Desk: `http://localhost:8080` |
| Full stack (incl. web + gateway) | `docker compose up -d --build` | Web `http://localhost:3000` (map domain in Coolify), Gateway `:8000` |
| Dev override (local gateway port 8100) | `docker compose -f docker-compose.yml -f deploy/docker-compose.dev.yml up -d --build` | Gateway `http://localhost:8100` |

## Frappe apps

- `frappe_apps/agileclix_erp` — primary custom app (branding + gateway APIs).
- `agileclix_branding` — legacy; still installed for existing sites.

**Admin:** Frappe Desk stays enabled for break-glass administration while the Next.js `/desk` shell is built out.

## Gateway (local Python)

```bash
cd services/gateway
pip install -e ".[dev]"
pytest
uvicorn app.main:app --reload --port 8100
```

## Web (local Node)

```bash
cd apps/web
npm install
NEXT_PUBLIC_GATEWAY_URL=http://localhost:8100 npm run dev
```

## Rebranding (white-label)

All branding lives in `brand/`:

- `brand/brand.json`: name, short name, platform name, tagline, description, publisher, logo file, font (family + Google Fonts URL), radius, light/dark colours, and text replacements for upstream product names.
- `brand/logo.png` (or any file named in `"logo"`).

To apply a new brand:

1. Edit `brand/brand.json` and/or replace the logo.
2. Run `python brand/apply.py` (`--check` exits 1 if generated files are stale, for CI).
3. Commit the generated files, redeploy, then `bench --site <site> migrate` and `bench build --app agileclix_erp`.

Never hardcode brand names, colours or logo paths in UI code: use `brand` from `@/brand` (web) or `get_brand()` / `--ac-*` CSS variables (Desk).

## Production deploy (Coolify on Hostinger VPS)

The full runbook is the header of `docker-compose.yml`. Key points:

- Only `frontend` needs a domain: `https://erp.agileclix.com:8080` (container port; public traffic is 443).
- Let Coolify generate `SERVICE_PASSWORD_64_ADMIN` and `SERVICE_PASSWORD_64_MARIADB`. Never change the MariaDB one after the first deploy.
- Redeploys are safe: `create-site` migrates an existing site and refuses to recreate it.
- Web UI (optional): domains for `web` (port 3000) and `gateway` (port 8000), plus `AGILECLIX_GATEWAY_PUBLIC_URL`, `AGILECLIX_HEADLESS_URL`, `AGILECLIX_CORS_ORIGINS`. `NEXT_PUBLIC_*` values are build arguments, so change them and redeploy (rebuild).

### Backups

All business data lives in the `db-data` and `sites` volumes. In Coolify, add a **Scheduled Task** on the `backend` service:

- Command: `bench --site erp.agileclix.com backup --with-files`
- Frequency: daily (e.g. `0 2 * * *`)

Backups land in `sites/erp.agileclix.com/private/backups/`. Copy them off the VPS regularly (e.g. S3 or another server); a backup on the same disk does not survive losing the VPS.
