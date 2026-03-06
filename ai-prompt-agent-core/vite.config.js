import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  plugins: [react()],
  server: {
    port: 3000,
    open: '/',
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        pro: resolve(__dirname, 'pro.html'),
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@engine': '/src/engine',
      '@store': '/src/store',
      '@styles': '/src/styles',
      '@templates': '/templates'
    }
  }
});
