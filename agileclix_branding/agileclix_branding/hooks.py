app_name = "agileclix_branding"
app_title = "AgileClix Branding"
app_publisher = "AgileClix"
app_description = "AgileClix branding for ERPNext desk, login, and website."
app_email = "hello@agileclix.com"
app_license = "MIT"

required_apps = ["erpnext"]

app_include_css = "/assets/agileclix_branding/css/agileclix_desk.css"
app_include_js = "agileclix_branding.js"

boot_session = "agileclix_branding.boot.enrich_boot_session"
after_install = ["agileclix_branding.boot.sync_branding_settings"]
after_migrate = ["agileclix_branding.boot.sync_branding_settings"]

website_context = {
	"favicon": "/assets/agileclix_branding/images/agileclix-logo.png",
	"splash_image": "/assets/agileclix_branding/images/agileclix-logo.png",
}
