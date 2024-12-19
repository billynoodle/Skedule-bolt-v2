import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/pdfjs-dist/build/pdf.worker.js',
          dest: 'public/assets'
        },
        {
          src: 'node_modules/pdfjs-dist/cmaps/*',
          dest: 'public/assets/cmaps'
        },
        {
          src: 'node_modules/pdfjs-dist/standard_fonts/*',
          dest: 'public/assets/standard_fonts'
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  optimizeDeps: {
    include: ['fabric']
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist'],
          react: ['react', 'react-dom'],
          fabric: ['fabric'],
          vendor: [
            'react-pdf',
            'react-zoom-pan-pinch',
            'react-dropzone'
          ]
        }
      }
    }
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  }
});