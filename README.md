# BookTrack GitHub Pages — Corrected API Bridge

## Use these files
GitHub repository root:
- index.html
- styles.css
- scripts.js

Google Apps Script:
- AppsScript/Code.gs

## Backend URL
https://script.google.com/macros/s/AKfycbwKG4l3_5zTsjB5eb_RO8W9cpQwhWDyX5XzsKZM0b8HT3BW9k4bCWVAPtwy0Ge_UTWl9Q/exec

## Steps
1. Replace Apps Script `Code.gs` with `AppsScript/Code.gs`.
2. Save and deploy a NEW VERSION of the current Web App.
3. Upload only the new `scripts.js` to GitHub if `index.html` and `styles.css` are already correct.
4. Commit changes and wait for GitHub Pages to update.
5. Hard refresh the GitHub Pages site (Ctrl+Shift+R).

The corrected bridge uses a plain global JSONP callback name, which is compatible with the Apps Script `script.googleusercontent.com` redirect.
It also recalculates Progress from CurrentPage / TotalPages, so a date-formatted Progress column will not corrupt the frontend value.
