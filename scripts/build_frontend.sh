#!/bin/bash
set -e

echo "Building frontend…"

cd frontend
npm install
npm run build

echo "Cleaning Rails public/ folder…"

cd ..
rm -rf public/assets public/index.html public/*.js public/*.css public/*.map

echo "Copying new build into Rails public/…"

cp -r frontend/dist/* public/

echo "Frontend build complete."
