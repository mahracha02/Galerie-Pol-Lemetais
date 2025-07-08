import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/test/',
  plugins: [react()],
  server: {
    proxy: {
      '^/([^/]+)(/admin)?/api(/.*)?$': {
        target: 'https://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: ['@heroicons/react'],
  },
});
