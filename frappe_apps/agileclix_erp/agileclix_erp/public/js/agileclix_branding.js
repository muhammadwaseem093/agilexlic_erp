(function () {
	const LOGO = "/assets/agileclix_erp/images/agileclix-logo.png";
	const APP_NAME = "AgileClix ERP";
	const TAGLINE = "Work Smarter. Grow Faster.";
	const PUBLISHER = "ZentoriLabs";

	const REBRAND_MAP = {
		ERPNext: APP_NAME,
		"Frappe Framework": "AgileClix Platform",
		Framework: "AgileClix Platform",
		Frappe: "AgileClix",
	};

	const LOGO_SELECTORS =
		".app-logo img, .navbar-brand img, .sidebar-brand img, .page-card-head img, " +
		".brand-logo img, .navbar-home img, .desk-sidebar .app-logo img, " +
		".widget-app-icon img, .app-icon img, .standard-image, " +
		"img[src*='erpnext'], img[src*='frappe-framework'], img[src*='frappe.svg']";

	const TEXT_ROOTS = "header.navbar, .layout-main, .desk-sidebar, .list-sidebar, .page-head, .modal";

	let applyScheduled = false;

	function markBranded() {
		document.documentElement.classList.add("agileclix-branded");
		document.body.classList.add("agileclix-branded");
	}

	function swapLogos(root) {
		(root || document).querySelectorAll(LOGO_SELECTORS).forEach((img) => {
			if (!img.src || img.src.includes("agileclix-logo")) {
				return;
			}
			img.src = LOGO;
			img.alt = APP_NAME;
			img.style.objectFit = "contain";
		});
	}

	function rebrandLabels(root) {
		const scope = root || document;
		const selectors =
			".widget-title, .widget-head .title, .app-title, .desk-sidebar-item-label, " +
			".sidebar-item-label, .shortcut-widget-box .caption, .page-title, .title-text, " +
			".module-link, .onboard-spotlight .title";
		scope.querySelectorAll(selectors).forEach((el) => {
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

	function rebrandTextNodes(root) {
		if (!root) {
			return;
		}
		const skip = new Set(["SCRIPT", "STYLE", "TEXTAREA", "INPUT"]);
		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		let node;
		while ((node = walker.nextNode())) {
			const parent = node.parentElement;
			if (!parent || skip.has(parent.tagName)) {
				continue;
			}
			let value = node.nodeValue;
			if (!value || !value.trim()) {
				continue;
			}
			let changed = false;
			Object.keys(REBRAND_MAP).forEach((key) => {
				if (value.includes(key)) {
					value = value.split(key).join(REBRAND_MAP[key]);
					changed = true;
				}
			});
			if (changed) {
				node.nodeValue = value;
			}
		}
	}

	function brandAppTiles(root) {
		(root || document)
			.querySelectorAll(
				".shortcut-widget-box, .widget.shortcut, [data-app-name='erpnext'], [data-route^='erpnext']"
			)
			.forEach((tile) => {
				const img = tile.querySelector("img");
				if (img && !img.src.includes("agileclix-logo")) {
					img.src = LOGO;
					img.alt = APP_NAME;
				}
				const label = tile.querySelector(".widget-title, .caption, .ellipsis");
				if (label && label.textContent.trim() === "ERPNext") {
					label.textContent = APP_NAME;
				}
			});
	}

	function injectLauncherBadge() {
		const main = document.querySelector(".layout-main-section");
		if (!main || document.getElementById("agileclix-desk-badge")) {
			return;
		}
		const route = (window.location.pathname || "") + (window.location.hash || "");
		const onDeskHome =
			route === "/app" ||
			route.endsWith("/desk") ||
			route.includes("/desk/") &&
				!route.includes("/Form/") &&
				!route.includes("/List/");
		if (!onDeskHome) {
			return;
		}
		const badge = document.createElement("div");
		badge.id = "agileclix-desk-badge";
		badge.setAttribute("role", "status");
		badge.style.cssText =
			"padding:0.85rem 1.1rem;border-radius:12px;" +
			"background:linear-gradient(105deg,#0f172a 0%,#1e40af 100%);color:#f8fafc;" +
			"font-size:0.875rem;font-weight:500;display:flex;align-items:center;gap:0.85rem;";
		badge.innerHTML =
			'<img src="' +
			LOGO +
			'" alt="" style="height:32px;width:auto" />' +
			"<span><strong>" +
			APP_NAME +
			"</strong><br><span style='opacity:.85;font-size:.8rem'>" +
			TAGLINE +
			" · " +
			PUBLISHER +
			"</span></span>";
		main.prepend(badge);
	}

	function injectPageHeadAccent() {
		document.querySelectorAll(".page-head").forEach((head) => {
			if (head.dataset.agileclixStyled) {
				return;
			}
			head.dataset.agileclixStyled = "1";
			head.style.borderLeft = "4px solid #2563eb";
			head.style.paddingLeft = "0.75rem";
		});
	}

	function setFavicon() {
		document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']").forEach((link) => {
			link.href = LOGO;
		});
		if (!document.querySelector("link[rel='icon']")) {
			const link = document.createElement("link");
			link.rel = "icon";
			link.href = LOGO;
			document.head.appendChild(link);
		}
	}

	function setTitle() {
		let title = document.title || "";
		Object.keys(REBRAND_MAP).forEach((key) => {
			title = title.split(key).join(REBRAND_MAP[key]);
		});
		document.title = title;
	}

	function apply() {
		markBranded();
		swapLogos(document);
		brandAppTiles(document);
		rebrandLabels(document);
		document.querySelectorAll(TEXT_ROOTS).forEach((el) => rebrandTextNodes(el));
		injectLauncherBadge();
		injectPageHeadAccent();
		setFavicon();
		setTitle();
	}

	function scheduleApply() {
		if (applyScheduled) {
			return;
		}
		applyScheduled = true;
		requestAnimationFrame(() => {
			applyScheduled = false;
			apply();
		});
	}

	function observe() {
		const observer = new MutationObserver(() => scheduleApply());
		observer.observe(document.body, { childList: true, subtree: true });
	}

	if (typeof frappe !== "undefined" && frappe.ready) {
		frappe.ready(() => {
			apply();
			observe();
			if (frappe.boot) {
				frappe.boot.app_name = APP_NAME;
				if (frappe.boot.sysdefaults) {
					frappe.boot.sysdefaults.app_name = APP_NAME;
				}
			}
			if (frappe.router && frappe.router.on) {
				frappe.router.on("change", scheduleApply);
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
