import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // needed inside Codespaces / StackBlitz so the preview URL works
    port: 5173,
    // Any request starting with /api is forwarded to Express.
    // That's why client code can call fetch('/api/resources') with no full URL.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
