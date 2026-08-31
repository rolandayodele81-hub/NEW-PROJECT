#!/bin/bash
# Rebuild js/bundle.js from the individual source files.
# Run this after editing any file in js/ (except bundle.js itself).
cat js/config.js js/data.js js/utils.js js/api.js js/permissions.js js/app.js > js/bundle.js
echo "bundle.js rebuilt ($(wc -l < js/bundle.js) lines)"

# Automatically update cache-busting version in HTML files
V=$(date +%s)
node -e "
const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/js\/bundle\.js(\?v=[0-9]+)?/g, 'js/bundle.js?v=$V');
  content = content.replace(/css\/style\.css(\?v=[0-9]+)?/g, 'css/style.css?v=$V');
  fs.writeFileSync(file, content);
}
"
echo "Cache-busting version ?v=$V applied to all HTML files."
