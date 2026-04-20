import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8080',
      '/produtos': 'http://localhost:8080',
      '/pedidos': 'http://localhost:8080',
      '/pedido-itens': 'http://localhost:8080'
    }
  }
});