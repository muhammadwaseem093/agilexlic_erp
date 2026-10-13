# AgileClix: layer branding app on official ERPNext (keeps upstream v16.50 erpnext intact).
FROM frappe/erpnext:v16.50.0

USER frappe
WORKDIR /home/frappe/frappe-bench

COPY --chown=frappe:frappe agileclix_branding /home/frappe/frappe-bench/apps/agileclix_branding

RUN ./env/bin/pip install --no-cache-dir -e ./apps/agileclix_branding \
	&& bench build --app agileclix_branding \
	&& bench clear-cache
