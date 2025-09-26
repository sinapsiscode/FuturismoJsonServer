#!/bin/bash
echo "Limpiando caché y reiniciando..."
rm -rf node_modules/.vite
rm -rf dist
pkill -f "vite"
npm run dev