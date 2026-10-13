# Copyright (c) AgileClix

AGILECLIX_APP_NAME = "AgileClix ERP"
AGILECLIX_TAGLINE = "Work Smarter. Grow Faster."
AGILECLIX_LOGO_URL = "/assets/agileclix_branding/images/agileclix-logo.png"


def enrich_boot_session(bootinfo) -> None:
	import frappe

	bootinfo.app_logo_url = AGILECLIX_LOGO_URL
	bootinfo.agileclix_branding = {
		"app_name": AGILECLIX_APP_NAME,
		"tagline": AGILECLIX_TAGLINE,
		"logo_url": AGILECLIX_LOGO_URL,
	}

	navbar = getattr(bootinfo, "navbar_settings", None)
	if navbar and hasattr(navbar, "app_logo"):
		navbar.app_logo = AGILECLIX_LOGO_URL

	if isinstance(getattr(bootinfo, "navbar_settings", None), dict):
		bootinfo.navbar_settings["app_logo"] = AGILECLIX_LOGO_URL

	if frappe.session.user != "Guest":
		sysdefaults = getattr(bootinfo, "sysdefaults", None)
		if sysdefaults is not None and hasattr(sysdefaults, "app_name"):
			sysdefaults.app_name = AGILECLIX_APP_NAME


def sync_branding_settings() -> None:
	import frappe

	if frappe.flags.in_install or frappe.flags.in_uninstall:
		return

	logo = AGILECLIX_LOGO_URL

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
