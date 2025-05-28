
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    open: true,
    cors: true,
    allowedHosts: ["2e8370d3-b660-4738-bd39-8e1a61f42791.lovableproject.com"],
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress the /*#__PURE__*/ comment warnings
        if (warning.code === 'INVALID_ANNOTATION') return;
        warn(warning);
      },
      output: {
        manualChunks: {
          // Split large dependencies into separate chunks to reduce memory usage
          'tomo-sdk': ['@tomo-inc/tomo-web-sdk'],
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-dialog', '@radix-ui/react-popover'],
        }
      }
    },
    // Increase memory limit for build process
    target: 'esnext',
    minify: mode === 'production',
    sourcemap: mode === 'development',
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      '@tomo-inc/tomo-web-sdk',
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: ['@tomo-inc/tomo-web-sdk']
  },
  define: {
    global: 'globalThis',
  }
}));
