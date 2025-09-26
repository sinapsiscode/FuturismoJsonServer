#!/bin/bash

echo "🔧 Deteniendo procesos de Node..."
pkill -f node || true

echo "🗑️ Limpiando caché de Vite..."
rm -rf node_modules/.vite
rm -rf .vite

echo "🔄 Reiniciando el servidor de desarrollo..."
echo ""
echo "✅ Caché limpiado. Por favor ejecuta:"
echo "   npm start"
echo ""
echo "Si el problema persiste, ejecuta:"
echo "   npm start -- --force"