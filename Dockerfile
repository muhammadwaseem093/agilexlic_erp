# AgileClix ERP — extends official ERPNext image with this fork (branding + app code).
FROM frappe/erpnext:v16.50.0

USER frappe
WORKDIR /home/frappe/frappe-bench

COPY --chown=frappe:frappe . /home/frappe/frappe-bench/apps/erpnext

RUN bench build --app erpnext && bench clear-cache
