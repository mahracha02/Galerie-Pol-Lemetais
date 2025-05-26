import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/actualites/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/actualites': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/expositions/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/expositions/api/edit/:id': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/evenements/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      },
      '/oeuvres/api/edit/:id': {
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
      '/contacts/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    }
  },
  optimizeDeps: {
    include: ['@heroicons/react'],
  },
});
