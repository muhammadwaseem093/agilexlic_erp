# AgileClix: copy branding app into the official ERPNext image (no pip / bench at build time).
# Asset build runs in the configurator service when the sites volume is available.
FROM frappe/erpnext:v16.50.0

USER frappe
WORKDIR /home/frappe/frappe-bench

COPY --chown=frappe:frappe agileclix_branding /home/frappe/frappe-bench/apps/agileclix_branding
