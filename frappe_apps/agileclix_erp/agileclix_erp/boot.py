# Copyright (c) ZentoriLabs

from agileclix_erp.brand import get_brand
from agileclix_erp.launcher import enrich_launcher_boot

_brand = get_brand()

AGILECLIX_APP_NAME = _brand["name"]
AGILECLIX_TAGLINE = _brand["tagline"]
AGILECLIX_LOGO_URL = _brand["logoUrl"]
AGILECLIX_PUBLISHER = _brand["publisher"]
AGILECLIX_PRIMARY = _brand["colors"]["light"]["primary"]

# Upstream app titles shown in the apps screen / switcher, mapped to brand names.
UPSTREAM_APP_TITLES = {
	"erpnext": AGILECLIX_APP_NAME,
	"frappe": _brand["platformName"],
}

# Help-menu links pointing at upstream vendor sites are dropped from the navbar.
UPSTREAM_LINK_MARKERS = tuple(_brand.get("upstreamLinkMarkers", ()))


def enrich_boot_session(bootinfo) -> None:
	import frappe

	bootinfo.app_logo_url = AGILECLIX_LOGO_URL
	bootinfo.agileclix_branding = {
		"app_name": AGILECLIX_APP_NAME,
		"tagline": AGILECLIX_TAGLINE,
		"logo_url": AGILECLIX_LOGO_URL,
		"publisher": AGILECLIX_PUBLISHER,
		"primary_color": AGILECLIX_PRIMARY,
		"headless_url": frappe.conf.get("agileclix_headless_url"),
	}
	if hasattr(bootinfo, "app_name"):
		bootinfo.app_name = AGILECLIX_APP_NAME

	navbar = getattr(bootinfo, "navbar_settings", None)
	if navbar and hasattr(navbar, "app_logo"):
		navbar.app_logo = AGILECLIX_LOGO_URL

	if isinstance(getattr(bootinfo, "navbar_settings", None), dict):
		bootinfo.navbar_settings["app_logo"] = AGILECLIX_LOGO_URL

	_rebrand_app_data(bootinfo)
	enrich_launcher_boot(bootinfo)

	if frappe.session.user != "Guest":
		sysdefaults = getattr(bootinfo, "sysdefaults", None)
		if sysdefaults is not None and hasattr(sysdefaults, "app_name"):
			sysdefaults.app_name = AGILECLIX_APP_NAME


def _rebrand_app_data(bootinfo) -> None:
	for app in getattr(bootinfo, "app_data", None) or []:
		if not isinstance(app, dict):
			continue
		title = UPSTREAM_APP_TITLES.get(app.get("app_name"))
		if title:
			app["app_title"] = title
			app["app_logo_url"] = AGILECLIX_LOGO_URL


def sync_branding_settings() -> None:
	import frappe

	if frappe.flags.in_uninstall:
		return

	try:
		_sync_branding_settings(AGILECLIX_LOGO_URL)
	except Exception:
		frappe.log_error(title="AgileClix ERP branding sync failed")


def _sync_branding_settings(logo: str) -> None:
	import frappe

	if frappe.db.exists("DocType", "Navbar Settings"):
		navbar = frappe.get_single("Navbar Settings")
		if navbar.get("app_logo") != logo:
			navbar.app_logo = logo
			navbar.flags.ignore_permissions = True
			navbar.save()

	if frappe.db.exists("DocType", "Website Settings"):
		website = frappe.get_single("Website Settings")
		changed = False
		if website.get("app_name") != AGILECLIX_APP_NAME:
			website.app_name = AGILECLIX_APP_NAME
			changed = True
		if website.get("splash_image") != logo:
			website.splash_image = logo
			changed = True
		if website.get("banner_image") != logo:
			website.banner_image = logo
			changed = True
		if changed:
			website.flags.ignore_permissions = True
			website.save()

	_set_single_fields(
		"Website Settings",
		{"footer_powered": AGILECLIX_APP_NAME, "brand_html": f'<img src="{logo}" alt="{AGILECLIX_APP_NAME}" style="height:28px">'},
	)
	_set_single_fields("System Settings", {"app_name": AGILECLIX_APP_NAME, "disable_standard_email_footer": 1})
	_prune_upstream_help_links()


def _set_single_fields(doctype: str, values: dict) -> None:
	"""Set only the fields this framework version actually has, without running full document validation."""
	import frappe

	if not frappe.db.exists("DocType", doctype):
		return
	meta = frappe.get_meta(doctype)
	for field, value in values.items():
		if meta.has_field(field) and frappe.db.get_single_value(doctype, field) != value:
			frappe.db.set_single_value(doctype, field, value)
	if "disable_standard_email_footer" in values:
		frappe.db.set_default("disable_standard_email_footer", values["disable_standard_email_footer"])


def _prune_upstream_help_links() -> None:
	import frappe

	if not frappe.db.exists("DocType", "Navbar Settings"):
		return
	navbar = frappe.get_single("Navbar Settings")
	items = navbar.get("help_dropdown") or []
	kept = [row for row in items if not any(m in (row.get("route") or "") for m in UPSTREAM_LINK_MARKERS)]
	if len(kept) != len(items):
		navbar.set("help_dropdown", kept)
		navbar.flags.ignore_permissions = True
		navbar.save()
