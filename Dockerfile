# AgileClix ERP — v16.50.0 pin (see docs/architecture/VERSION_PIN.md).
# Custom Frappe apps only; no COPY of erpnext/ source tree.
FROM frappe/erpnext:v16.50.0

USER frappe
WORKDIR /home/frappe/frappe-bench

COPY --chown=frappe:frappe agileclix_branding /home/frappe/frappe-bench/apps/agileclix_branding
COPY --chown=frappe:frappe frappe_apps/agileclix_erp /home/frappe/frappe-bench/apps/agileclix_erp

# Copying is not enough: bench needs the apps importable and their public/ folders
# linked under assets/, otherwise every bench command fails and /assets/<app>/ 404s.
RUN for app in agileclix_branding agileclix_erp; do \
		env/bin/pip install --no-cache-dir --quiet -e "apps/${app}" \
		&& ln -sfn "/home/frappe/frappe-bench/apps/${app}/${app}/public" "assets/${app}"; \
	done
