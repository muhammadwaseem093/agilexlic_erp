# AgileClix ERP — v16.50.0 pin (see docs/architecture/VERSION_PIN.md).
# Custom Frappe apps only; no COPY of erpnext/ source tree.
FROM frappe/erpnext:v16.50.0

USER frappe
WORKDIR /home/frappe/frappe-bench

COPY --chown=frappe:frappe agileclix_branding /home/frappe/frappe-bench/apps/agileclix_branding
COPY --chown=frappe:frappe frappe_apps/agileclix_erp /home/frappe/frappe-bench/apps/agileclix_erp
