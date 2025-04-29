import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),

  ],
  server: {
    proxy: {
      '/expositions/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/expositions/api/:api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/evenements/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/artistes/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/oeuvres/api/artiste': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/oeuvres/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  },
  optimizeDeps: {
    include: ['@heroicons/react'],
  },
})
