#!/bin/bash
echo "🧹 Limpiando cache de Vite y reiniciando..."

# Detener procesos de Vite
echo "⏹️  Deteniendo procesos de Vite..."
pkill -f vite || true

# Limpiar cachés
echo "🗑️  Eliminando cachés..."
rm -rf node_modules/.vite
rm -rf dist
rm -rf .parcel-cache

# Opcional: reinstalar dependencias de headlessui
echo "📦 Reinstalando dependencias problemáticas..."
npm uninstall @headlessui/react
npm install @headlessui/react

echo "🚀 Iniciando servidor..."
npm run dev