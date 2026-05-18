import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // public/api/districts/*.json — frontend lokal SVG fayllari, proxy qilmaymiz
        bypass: (req) => {
          if (req.url.startsWith('/api/districts/') && req.url.endsWith('.json')) {
            return req.url
          }
        }
      },
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/docs': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
