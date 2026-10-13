# ERPNext / Frappe version pin (production)

**Decision:** Pin **v16.50.x** for Docker images and custom Frappe apps until a coordinated v17 upgrade.

| Artifact | Pin |
|----------|-----|
| Base image | `frappe/erpnext:v16.50.0` |
| Custom apps | Compatible with Frappe v16 / ERPNext v16.50 |
| Source tree `erpnext/` | Upstream **17.0.0-dev** — reference only; **not** copied into the production image |

**Rationale:** Coolify production already runs v16.50.0. Copying v17 `erpnext/` into the image broke `bench build`. Headless SaaS work proceeds against the **pinned runtime**, not the dev tree.

**Upgrade path:** Branch `release/erpnext-v16.50`, bump image tag, run full regression + mandatory E2E before moving to v17.
