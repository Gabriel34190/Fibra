import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Force all imports of "scheduler" (notamment framer-motion)
      // à utiliser la version racine compatible (0.23.2)
      scheduler: resolve(__dirname, 'node_modules/scheduler/index.js')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts'],
          'vendor-three': ['three'],
          'vendor-three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'vendor-tone': ['tone']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'recharts', 'scheduler'],
    exclude: ['three', 'tone', '@react-three/fiber', '@react-three/drei']
  }
})
