UPGRADED MEDIADROP PRO

GitHub Pages hosts the frontend only. It cannot run a server-side backend.
This package adds an optional Cloudflare Worker backend for direct public media URLs.

Steps:
1. Replace your GitHub Pages files with index.html, style.css, script.js and config.js.
2. Deploy worker/src/index.js as a Cloudflare Worker.
3. Put the Worker URL into config.js as window.MEDIADROP_API.
4. Commit config.js to GitHub.

The backend does not bypass login, DRM, paywalls, anti-bot systems or access controls. Use only media you are authorized to download.
