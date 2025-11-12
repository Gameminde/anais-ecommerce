import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'
import { VitePWA } from 'vite-plugin-pwa'
import { imagetools } from 'vite-imagetools'

const isProd = process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(),
    imagetools(),
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'ANAIS - Elegant Modest Fashion',
        short_name: 'ANAIS',
        description: 'Elegant modest fashion for the modern Algerian woman',
        theme_color: '#8B5A3C',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'pwa-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk - core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Router chunk
          if (id.includes('node_modules/react-router-dom')) {
            return 'router';
          }
          // UI libraries chunk
          if (id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/@radix-ui') ||
              id.includes('node_modules/framer-motion')) {
            return 'ui-libs';
          }
          // Supabase chunk
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          // Utils chunk
          if (id.includes('node_modules/i18next') ||
              id.includes('node_modules/react-i18next')) {
            return 'i18n';
          }
          // Large vendor libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
})

