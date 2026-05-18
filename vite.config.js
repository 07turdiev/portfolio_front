import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Gzip hajmi hisoblashni o'chirish — build vaqtini qisqartiradi
    reportCompressedSize: false,
    // Modulli skript — eski brauzerlar uchun shim qilinmaydi, build tezroq
    target: 'esnext',
    // Source map ishlab chiqarmaslik (production uchun)
    sourcemap: false,
    // Chunklarga ajratish — bitta katta fayl o'rniga bir nechta kichik
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'vue-i18n'],
          'vendor-axios': ['axios']
        }
      }
    },
    // 1MB gacha bo'lgan chunklarga ogohlantirish chiqarmaslik
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
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
