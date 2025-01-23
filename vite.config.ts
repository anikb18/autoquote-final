import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: ['36129237-bfd4-4359-bb23-1a4fa1241306.lovableproject.com', 'localhost'],
    // Add middleware to handle client-side routing
    middlewares: [
      (req: IncomingMessage, res: ServerResponse, next: () => void) => {
        // Redirect all requests that aren't files to index.html
        if (!req.url?.includes('.')) {
          req.url = '/index.html';
        }
        next();
      }
    ]
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
}));