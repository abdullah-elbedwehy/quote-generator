import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      'matter-js': resolve(__dirname, 'node_modules/matter-js/build/matter.js')
    }
  },
  optimizeDeps: {
    include: ['matter-js']
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
