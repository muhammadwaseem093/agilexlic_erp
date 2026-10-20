app_name = "agileclix_erp"
app_title = "AgileClix ERP"
app_publisher = "ZentoriLabs"
app_description = "AgileClix ERP platform extensions, branding, and gateway APIs for ERPNext."
app_email = "hello@agileclix.com"
app_license = "MIT"

required_apps = ["erpnext"]

from agileclix_erp.brand import get_brand

_brand = get_brand()

# Brand tokens load first so the desk theme and branding script can read them.
app_include_css = [
	"/assets/agileclix_erp/css/agileclix_brand.css",
	"/assets/agileclix_erp/css/agileclix_desk.css",
	"/assets/agileclix_erp/css/agileclix_ui.css",
	"/assets/agileclix_erp/css/agileclix_loader.css",
	"/assets/agileclix_erp/css/agileclix_launcher.css",
]
app_include_js = ["/assets/agileclix_erp/js/agileclix_brand.js", "/assets/agileclix_erp/js/agileclix_branding.js"]

# Login & website (same theme as Desk)
web_include_css = app_include_css
web_include_js = app_include_js

boot_session = "agileclix_erp.boot.enrich_boot_session"
after_install = ["agileclix_erp.boot.sync_branding_settings"]
after_migrate = ["agileclix_erp.boot.sync_branding_settings"]

website_context = {
	"favicon": _brand["logoUrl"],
	"splash_image": _brand["logoUrl"],
}
