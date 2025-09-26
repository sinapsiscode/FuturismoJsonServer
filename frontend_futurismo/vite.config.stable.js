import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración más estable para WSL2
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})