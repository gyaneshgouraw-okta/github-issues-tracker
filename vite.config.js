import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ReactCompilerConfig from './react-compiler.config.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]]
      }
    })
  ],
  base: './', // This sets the base path for the application, useful for deployment in subdirectories
  
  // Optimization settings for React 19
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['styled-components'],
          github: ['@octokit/rest']
        }
      }
    },
    // Enable source maps for better debugging
    sourcemap: true,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000
  },
  
  // Development optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'styled-components']
  }
})
