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
