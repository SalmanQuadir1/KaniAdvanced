import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/shopify/admin": {  // More specific proxy path
        target: "https://kashmir-loom.myshopify.com",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/shopify\/admin/, "/admin")
      }
    },
    // IMPORTANT: This handles SPA routing
    historyApiFallback: true
  },
  optimizeDeps: {
    include: ['jwt-decode']
  },
  plugins: [react()],
})