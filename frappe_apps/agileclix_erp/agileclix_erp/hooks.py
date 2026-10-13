app_name = "agileclix_erp"
app_title = "AgileClix ERP"
app_publisher = "ZentoriLabs"
app_description = "AgileClix ERP platform extensions, branding, and gateway APIs for ERPNext."
app_email = "hello@agileclix.com"
app_license = "MIT"

required_apps = ["erpnext"]

app_include_css = "/assets/agileclix_erp/css/agileclix_desk.css"
app_include_js = "agileclix_branding.js"

boot_session = "agileclix_erp.boot.enrich_boot_session"
after_install = ["agileclix_erp.boot.sync_branding_settings"]
after_migrate = ["agileclix_erp.boot.sync_branding_settings"]

website_context = {
	"favicon": "/assets/agileclix_erp/images/agileclix-logo.png",
	"splash_image": "/assets/agileclix_erp/images/agileclix-logo.png",
}
