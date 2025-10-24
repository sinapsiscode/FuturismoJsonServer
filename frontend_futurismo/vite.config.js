import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  // Extract port from VITE_API_URL or use default
  const getProxyTarget = () => {
    if (env.VITE_API_URL) {
      // Extract base URL without /api suffix
      return env.VITE_API_URL.replace('/api', '')
    }
    // Fallback for development
    return 'http://localhost:4050'
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true,
      strictPort: false,
      hmr: {
        port: 5173
      },
      // Proxy para evitar problemas de CORS en desarrollo
      proxy: {
        '/api': {
          target: getProxyTarget(),
          changeOrigin: true,
          secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
})