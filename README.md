# BookTrack GitHub Pages

1. Replace your Apps Script `Code.gs` with `AppsScript/Code.gs`.
2. Deploy a new version of the same Web App.
3. Upload `index.html`, `styles.css`, `scripts.js` to the GitHub repository root.
4. GitHub → Settings → Pages → Deploy from branch → `main` → `/ (root)`.

Configured backend:
https://script.google.com/macros/s/AKfycbxopgCq_WpG20EFqppbpOi9Soea91IhWyEnwnqeFao8J8QWE2C5Bf13mQSyoXuibvyJLg/exec

Architecture:
GitHub Pages → JSONP API → Google Apps Script → Google Sheets
