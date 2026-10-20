import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Next.js imports the CSS above itself; stop Font Awesome injecting a second copy at runtime.
config.autoAddCss = false;
