// App launcher: /desk/agileclix-apps[/<app>] shows each app's modules as cards.
// Modules come from frappe.boot.app_data (already filtered to what this user may open);
// descriptions come from frappe.boot.agileclix_launcher (agileclix_erp/launcher.py).

frappe.pages["agileclix-apps"].on_page_load = function (wrapper) {
	const page = frappe.ui.make_app_page({ parent: wrapper, title: __("Apps"), single_column: true });
	wrapper.agileclix_launcher = new AgileClixLauncher(page);
};

frappe.pages["agileclix-apps"].on_page_show = function (wrapper) {
	wrapper.agileclix_launcher.render();
};

class AgileClixLauncher {
	constructor(page) {
		this.page = page;
		this.$body = $('<div class="ac-launcher"></div>').appendTo(page.main);
	}

	get config() {
		return frappe.boot.agileclix_launcher || { apps: [], app_summaries: {}, modules: {} };
	}

	apps_to_show() {
		const requested = frappe.get_route()[1];
		const launcher_apps = (frappe.boot.app_data || []).filter(
			(app) => this.config.apps.includes(app.app_name) && (app.dock || []).length
		);
		const match = launcher_apps.filter((app) => app.app_name === requested);
		return match.length ? match : launcher_apps;
	}

	render() {
		const apps = this.apps_to_show();
		this.entries = [];
		this.page.set_title(apps.length === 1 ? apps[0].app_title : __("Apps"));

		this.$body.html(`
			<div class="ac-launcher-toolbar">
				<input type="search" class="form-control ac-launcher-search"
					placeholder="${__("Search modules…")}" aria-label="${__("Search modules")}">
			</div>
			${apps.map((app) => this.app_section(app)).join("")}
			<p class="ac-launcher-empty text-muted" hidden>${__("No modules match your search.")}</p>
		`);

		this.$body.find(".ac-launcher-card").on("click", (e) => this.open(e.currentTarget.dataset.index));
		this.$body.find(".ac-launcher-search").on("input", (e) => this.filter(e.target.value));
	}

	app_section(app) {
		const esc = frappe.utils.escape_html;
		const summary = this.config.app_summaries[app.app_name] || "";
		const cards = (app.dock || [])
			.map((entry) => {
				this.entries.push(entry);
				return this.card(entry, this.entries.length - 1);
			})
			.join("");

		return `
			<section class="ac-launcher-app">
				<header class="ac-launcher-app-head">
					${app.app_logo_url ? `<img src="${esc(app.app_logo_url)}" alt="" class="ac-launcher-app-logo">` : ""}
					<div>
						<h2 class="ac-launcher-app-title">${esc(app.app_title)}</h2>
						${summary ? `<p class="ac-launcher-app-summary">${esc(summary)}</p>` : ""}
					</div>
				</header>
				<div class="ac-launcher-grid">${cards}</div>
			</section>`;
	}

	card(entry, index) {
		const esc = frappe.utils.escape_html;
		const info = this.config.modules[entry.link_to] || this.config.modules[entry.title] || {};
		const title = __(entry.title || entry.link_to);
		const features = (info.features || []).map((f) => `<li>${esc(__(f))}</li>`).join("");
		const search_text = [title, info.description || "", ...(info.features || [])].join(" ").toLowerCase();

		return `
			<button type="button" class="ac-launcher-card" data-index="${index}" data-search="${esc(search_text)}">
				<span class="ac-launcher-card-icon">${this.icon(entry.icon)}</span>
				<span class="ac-launcher-card-title">${esc(title)}</span>
				${info.description ? `<span class="ac-launcher-card-desc">${esc(__(info.description))}</span>` : ""}
				${features ? `<ul class="ac-launcher-card-features">${features}</ul>` : ""}
				<span class="ac-launcher-card-open">${__("Open")} →</span>
			</button>`;
	}

	icon(name) {
		try {
			return name ? frappe.utils.icon(name, "lg") : "";
		} catch {
			return "";
		}
	}

	route_for(entry) {
		const sidebar = frappe.app && frappe.app.sidebar;
		const module = entry.link_type === "Sidebar" ? entry.link_to : entry.module;
		if (sidebar && typeof sidebar.dock_entry_route === "function") {
			const route = sidebar.dock_entry_route({ ...entry, module });
			if (route) return route;
		}
		return `/desk/${frappe.router.slug(entry.link_to || entry.title)}`;
	}

	open(index) {
		const entry = this.entries[Number(index)];
		if (entry) frappe.set_route(this.route_for(entry));
	}

	filter(query) {
		const q = (query || "").trim().toLowerCase();
		let visible = 0;
		this.$body.find(".ac-launcher-card").each((_, card) => {
			const show = !q || card.dataset.search.includes(q);
			card.hidden = !show;
			visible += show ? 1 : 0;
		});
		this.$body.find(".ac-launcher-app").each((_, section) => {
			section.hidden = !$(section).find(".ac-launcher-card:not([hidden])").length;
		});
		this.$body.find(".ac-launcher-empty").prop("hidden", visible > 0);
	}
}
