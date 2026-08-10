#!/bin/bash
# Rebuild js/bundle.js from the individual source files.
# Run this after editing any file in js/ (except bundle.js itself).
cat js/config.js js/data.js js/utils.js js/api.js js/permissions.js js/app.js > js/bundle.js
echo "bundle.js rebuilt ($(wc -l < js/bundle.js) lines)"
