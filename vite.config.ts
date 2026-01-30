// vite.config.js - FIXED VERSION
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  // FIX: Either remove the alias or make it correct
  resolve: {
    alias: {
      // Remove this if you don't use @ alias
      // '@': path.resolve(__dirname, './src'),
      
      // OR fix it to include assets
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'), // Add this
    },
  },
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog', 
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-icons',
            '@radix-ui/react-label',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            'lucide-react',
            'framer-motion'
          ],
          'utils-vendor': ['axios', 'jspdf', 'xlsx'],
          'charts-maps': ['recharts', 'leaflet', 'react-leaflet'],
          'editors-tables': ['@tiptap/react', 'jspdf-autotable'],
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})