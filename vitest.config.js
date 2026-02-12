/**
 * CONFIGURATION DE TEST VITEST
 * Alternative légère à Jest avec support natif ESM
 *
 * Installation:
 * npm install --save-dev vitest @vitest/ui happy-dom
 *
 * Usage:
 * npm test              # Run tests once
 * npm run test:watch   # Watch mode
 * npm run test:ui      # Visual UI
 */

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.js',
        '**/*.spec.js',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
