(function () {
	const LOGO = "/assets/agileclix_branding/images/agileclix-logo.png";
	const APP_NAME = "AgileClix ERP";
	const TAGLINE = "Work Smarter. Grow Faster.";
	const REBRAND_MAP = {
		ERPNext: APP_NAME,
		Frappe Framework: "AgileClix Platform",
		Framework: "AgileClix Platform",
	};

	const LOGO_SELECTORS =
		".app-logo img, .navbar-brand img, .sidebar-brand img, .page-card-head img, " +
		".brand-logo img, .navbar-home img, .desk-sidebar .app-logo img, " +
		".widget-app-icon img, .app-icon img, img[src*='erpnext'], img[src*='frappe-framework']";

	function swapLogos(root) {
		const scope = root || document;
		scope.querySelectorAll(LOGO_SELECTORS).forEach((img) => {
			if (!img.src || img.src.includes("agileclix-logo")) {
				return;
			}
			img.src = LOGO;
			img.alt = APP_NAME;
			img.style.objectFit = "contain";
		});
	}

	function rebrandText(root) {
		const scope = root || document;
		const textSelectors =
			".widget-title, .widget-head .title, .app-title, .desk-sidebar-item-label, " +
			".sidebar-item-label, .shortcut-widget-box .caption, h4, h5, .page-title";
		scope.querySelectorAll(textSelectors).forEach((el) => {
			const raw = (el.textContent || "").trim();
			if (REBRAND_MAP[raw]) {
				el.textContent = REBRAND_MAP[raw];
			}
		});
		scope.querySelectorAll("[title]").forEach((el) => {
			const title = el.getAttribute("title");
			if (title && REBRAND_MAP[title]) {
				el.setAttribute("title", REBRAND_MAP[title]);
			}
		});
	}

	function injectLauncherBadge() {
		const main = document.querySelector(".layout-main-section");
		if (!main || document.getElementById("agileclix-desk-badge")) {
			return;
		}
		const path = window.location.pathname || "";
		if (!path.includes("/desk") && path !== "/app") {
			return;
		}
		const badge = document.createElement("div");
		badge.id = "agileclix-desk-badge";
		badge.setAttribute("role", "status");
		badge.style.cssText =
			"margin:0 0 1.25rem;padding:0.75rem 1rem;border-radius:10px;" +
			"background:linear-gradient(90deg,#0f172a,#1e293b);color:#f8fafc;" +
			"font-size:0.875rem;font-weight:500;display:flex;align-items:center;gap:0.75rem;";
		badge.innerHTML =
			'<img src="' +
			LOGO +
			'" alt="" style="height:28px;width:auto" />' +
			"<span><strong>" +
			APP_NAME +
			"</strong> · " +
			TAGLINE +
			"</span>";
		main.prepend(badge);
	}

	function setFavicon() {
		let link = document.querySelector("link[rel='icon']");
		if (!link) {
			link = document.createElement("link");
			link.rel = "icon";
			document.head.appendChild(link);
		}
		link.href = LOGO;
	}

	function setTitle() {
		let title = document.title || "";
		Object.keys(REBRAND_MAP).forEach((key) => {
			title = title.split(key).join(REBRAND_MAP[key]);
		});
		if (!title.includes(APP_NAME) && title.includes("Desk")) {
			title = title.replace(/Desk/i, APP_NAME + " Desk");
		}
		document.title = title;
	}

	function apply() {
		swapLogos(document);
		rebrandText(document);
		injectLauncherBadge();
		setFavicon();
		setTitle();
	}

	function observe() {
		const observer = new MutationObserver(() => {
			requestAnimationFrame(apply);
		});
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (typeof frappe !== "undefined" && frappe.ready) {
		frappe.ready(() => {
			apply();
			observe();
			if (frappe.boot && frappe.boot.agileclix_branding) {
				frappe.boot.app_name = APP_NAME;
			}
			if (frappe.router && frappe.router.on) {
				frappe.router.on("change", () => requestAnimationFrame(apply));
			}
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			apply();
			observe();
		});
	} else {
		apply();
		observe();
	}
})();
