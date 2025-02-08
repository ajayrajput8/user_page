import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

/*import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [commonjs()],
      external: [
        'firebase',
        'firebase/firestore',
        'firebase/auth',
        'firebase/app'
      ]
    },
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth','firebase/firestore'],
    exclude: ['firebase'], // Optional, if issues persist
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

 https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    include: ["firebase/firestore"],
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ["firebase"]
    }
  }
});

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["firebase/firestore"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // Separates dependencies
          }
        },
      },
    },
  },
});*/

