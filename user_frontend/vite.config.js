// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/postcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable fast refresh
      fastRefresh: true,
      // Include .jsx files
      include: "**/*.{jsx,tsx}",
    })
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    port: 5173, // Use 5173 for Docker consistency
    host: '0.0.0.0', // Enable network access for Docker
    open: false, // Disable auto-open browser for Docker
    
    // Enable SPA routing - serve index.html for all non-API routes
    historyApiFallback: {
      // Don't apply history fallback to API routes
      rewrites: [
        { from: /^\/api\/.*$/, to: function(context) {
          return context.parsedUrl.pathname;
        }},
        { from: /^\/v1\/.*$/, to: function(context) {
          return context.parsedUrl.pathname;
        }}
      ]
    },
    
    hmr: {
      overlay: true, // Show errors in overlay
      port: 5173
    },
    watch: {
      usePolling: true, // Force polling for file changes in Docker
      interval: 100, // Check every 100ms
    },
    proxy: {
      '/api': {
        target: 'http://user-backend:8000', // Use Docker service name
        changeOrigin: true,
      },
      // Proxy other backend routes
      '/v1': {
        target: 'http://user-backend:8000',
        changeOrigin: true,
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
  build: {
    // Ensure proper handling in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react']
        }
      }
    }
  }
})