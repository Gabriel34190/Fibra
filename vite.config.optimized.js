import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Optimized Vite configuration with code-splitting and performance improvements
 * 
 * Features:
 * - Manual chunk splitting for better caching
 * - Lazy loading of heavy libraries (Three.js, TensorFlow.js)
 * - Optimized output formatting
 * - Source map for production debugging
 */

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        // Manual chunks for better caching and lazy loading
        manualChunks: {
          // Vendor libraries
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-ui': ['lucide-react'],
          'vendor-recharts': ['recharts'],
          
          // Heavy libraries - lazy load
          'vendor-three': ['three'],
          'vendor-three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'vendor-tone': ['tone'],
          
          // Large component groups
          'components-3d': [
            './src/components/Spiral3D.jsx',
            './src/components/FibonacciEmergenceSimulator.jsx',
          ],
          'components-music': [
            './src/components/MusicGenerator.jsx',
            './src/components/FibonacciComposer.jsx',
          ],
          'components-visualization': [
            './src/components/FibonacciFractalGenerator.jsx',
            './src/components/FibonacciSearchVisualizer.jsx',
            './src/components/FibonacciTrader.jsx',
          ],
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 600,
    
    // CSS optimization
    cssCodeSplit: true,
  },

  // Development server
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173,
    },
  },

  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'recharts',
    ],
    exclude: [
      'three',
      'tone',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
})
