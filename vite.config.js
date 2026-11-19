// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/PaginaTriviaZ/',
  server: {
    proxy: {
      '/api': {
        // Si pruebas en local sin túnel, cambia esto a 'http://localhost:8080'
        target: 'https://residential-concentrations-determined-witnesses.trycloudflare.com ',
        changeOrigin: true,
        secure: false,
        headers: {
          'bypass-tunnel-reminder': 'true'
        }
      }
    }
  }
});