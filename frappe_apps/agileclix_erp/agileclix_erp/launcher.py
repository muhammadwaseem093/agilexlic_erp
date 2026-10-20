# Copyright (c) ZentoriLabs
"""Content for the app launcher (/desk/agileclix-apps): what each module is for and its key features.

Keyed by the module (sidebar) name an app's dock exposes. Modules missing here still show on the
launcher with their title only, so a newly installed app never breaks it.
"""

LAUNCHER_ROUTE = "/desk/agileclix-apps"

# Apps whose tile opens the launcher instead of dropping straight into a module.
LAUNCHER_APPS = ("erpnext", "frappe")

APP_SUMMARIES = {
	"erpnext": "Run the business end to end: sales, purchasing, inventory, production and accounting.",
	"frappe": "Configure and extend the system: users, data, email, workflows, printing and integrations.",
}

MODULE_INFO = {
	# ---- ERP ----
	"Setup": {
		"description": "Company structure and the defaults every other module depends on.",
		"features": ["Companies", "Users & roles", "Global defaults", "Module settings"],
	},
	"Accounts": {
		"description": "Bookkeeping, invoicing, payments and financial reporting.",
		"features": ["Chart of accounts", "Sales & purchase invoices", "Payments & bank reconciliation", "Financial statements"],
	},
	"Selling": {
		"description": "From quotation to sales order, with customers, pricing and sales partners.",
		"features": ["Quotations", "Sales orders", "Customers & territories", "Price lists & pricing rules"],
	},
	"Buying": {
		"description": "Source suppliers, compare quotations and raise purchase orders.",
		"features": ["Suppliers", "Requests for quotation", "Purchase orders", "Supplier scorecards"],
	},
	"Stock": {
		"description": "Track items across warehouses with full valuation and traceability.",
		"features": ["Items & warehouses", "Stock entries & transfers", "Batches & serial numbers", "Reorder levels"],
	},
	"Manufacturing": {
		"description": "Plan and run production from bill of materials to finished goods.",
		"features": ["Bills of materials", "Work orders & job cards", "Production planning", "Workstations & routings"],
	},
	"Projects": {
		"description": "Plan work, track time and bill customers for project delivery.",
		"features": ["Projects & tasks", "Timesheets", "Gantt view", "Project billing"],
	},
	"Assets": {
		"description": "Manage fixed assets through purchase, depreciation, maintenance and disposal.",
		"features": ["Asset register", "Depreciation schedules", "Maintenance & repairs", "Asset movement"],
	},
	"Quality": {
		"description": "Define quality goals and procedures, and act on non-conformance.",
		"features": ["Quality goals", "Procedures", "Inspections", "Non-conformance & reviews"],
	},
	"CRM": {
		"description": "Capture leads and grow them into opportunities and customers.",
		"features": ["Leads", "Opportunities", "Campaigns", "Contracts & appointments"],
	},
	"Support": {
		"description": "Resolve customer issues on time with service levels and warranty tracking.",
		"features": ["Issues", "Service level agreements", "Warranty claims", "Maintenance visits"],
	},
	"Portal": {
		"description": "Self-service web access for customers and suppliers.",
		"features": ["Customer portal", "Supplier portal", "Orders & invoices online", "Portal settings"],
	},
	# ---- Platform ----
	"Build": {
		"description": "Create and customise forms, fields, reports and scripts without code changes.",
		"features": ["DocTypes", "Customize form", "Report builder", "Client & server scripts"],
	},
	"Users": {
		"description": "Manage who can sign in and what they are allowed to do.",
		"features": ["Users", "Roles & role permissions", "User permissions", "Login activity"],
	},
	"Email": {
		"description": "Connect mailboxes and automate outgoing communication.",
		"features": ["Email accounts", "Templates", "Email queue", "Notifications & digests"],
	},
	"Website": {
		"description": "Publish web pages, forms and a blog on your own domain.",
		"features": ["Web pages", "Web forms", "Blog", "Website settings"],
	},
	"Data": {
		"description": "Move data in and out, and keep it clean.",
		"features": ["Data import", "Data export", "Bulk update", "Deleted documents"],
	},
	"Workflow": {
		"description": "Add approval steps and state transitions to any document.",
		"features": ["Workflows", "Workflow states & actions", "Approval rules", "Assignment rules"],
	},
	"Printing": {
		"description": "Design how documents look when printed or sent as PDF.",
		"features": ["Print formats", "Letterheads", "Print format builder", "Print settings"],
	},
	"Integrations": {
		"description": "Connect external services through APIs, webhooks and sign-in providers.",
		"features": ["Webhooks", "OAuth & social login", "API keys", "Connected apps"],
	},
	"Contacts": {
		"description": "Shared address book of people and addresses linked to your records.",
		"features": ["Contacts", "Addresses", "Contact groups", "Linked documents"],
	},
	"Automation": {
		"description": "Let the system do repetitive work on a schedule or trigger.",
		"features": ["Auto repeat", "Assignment rules", "Scheduled jobs", "Milestone tracking"],
	},
	"Geo": {
		"description": "Countries, currencies and location data used across the system.",
		"features": ["Countries", "Currencies", "Address templates", "Geolocation settings"],
	},
	"System": {
		"description": "System-wide settings, health and maintenance tools.",
		"features": ["System settings", "Background jobs", "Error logs", "Backups"],
	},
}


def enrich_launcher_boot(bootinfo) -> None:
	"""Point launcher apps at the launcher page and ship module descriptions to the client."""
	for app in getattr(bootinfo, "app_data", None) or []:
		if isinstance(app, dict) and app.get("app_name") in LAUNCHER_APPS and app.get("dock"):
			app["app_route"] = f"{LAUNCHER_ROUTE}/{app['app_name']}"

	bootinfo.agileclix_launcher = {
		"route": LAUNCHER_ROUTE,
		"apps": list(LAUNCHER_APPS),
		"app_summaries": APP_SUMMARIES,
		"modules": MODULE_INFO,
	}
