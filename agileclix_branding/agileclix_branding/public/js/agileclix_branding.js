(function () {
	const LOGO = "/assets/agileclix_branding/images/agileclix-logo.png";
	const APP_NAME = "AgileClix ERP";

	function swapLogos(root) {
		const scope = root || document;
		scope.querySelectorAll(
			".app-logo img, .navbar-brand img, .sidebar-brand img, .page-card-head img, .brand-logo img"
		).forEach((img) => {
			if (!img.src.includes("agileclix-logo")) {
				img.src = LOGO;
				img.alt = APP_NAME;
			}
		});
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
		if (document.title.includes("ERPNext")) {
			document.title = document.title.replace(/ERPNext/g, APP_NAME);
		}
	}

	function apply() {
		swapLogos(document);
		setFavicon();
		setTitle();
	}

	if (typeof frappe !== "undefined" && frappe.ready) {
		frappe.ready(() => {
			apply();
			if (frappe.router && frappe.router.on) {
				frappe.router.on("change", () => requestAnimationFrame(apply));
			}
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", apply);
	} else {
		apply();
	}
})();
