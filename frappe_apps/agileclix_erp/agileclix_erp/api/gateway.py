"""Whitelisted endpoints for the AgileClix FastAPI gateway (v16 pin)."""

import frappe


@frappe.whitelist(allow_guest=True)
def ping() -> dict:
	return {
		"ok": True,
		"app": "agileclix_erp",
		"site": frappe.local.site,
		"version": frappe.get_attr("agileclix_erp.__version__"),
	}


@frappe.whitelist()
def session_context() -> dict:
	"""Minimal session payload for the headless UI (expand in Phase 3)."""
	user = frappe.session.user
	roles = frappe.get_roles(user) if user and user != "Guest" else []
	return {
		"user": user,
		"roles": roles,
		"branding": {
			"app_name": "AgileClix ERP",
			"publisher": "ZentoriLabs",
		},
	}
