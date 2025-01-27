import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "http";

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "36129237-bfd4-4359-bb23-1a4fa1241306.lovableproject.com",
      "localhost",
    ],
    middlewares: [
      (req: IncomingMessage, _res: ServerResponse, next: () => void) => {
        if (!req.url?.includes(".")) {
          req.url = "/index.html";
        }
        next();
      },
    ],
  },

  build: {
    target: "esnext",
    modulePreload: true,
    minify: "esbuild",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-avatar",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          "vendor-charts": ["recharts"],
          "vendor-i18n": ["i18next", "react-i18next"],
          "vendor-utils": [
            "clsx",
            "tailwind-merge",
            "class-variance-authority",
          ],
          "vendor-icons": ["react-icons", "lucide-react"],
          "vendor-auth": ["@clerk/clerk-react", "@supabase/supabase-js"],
        },
      },
    },
  },

  // Add CSS configuration for Tailwind and PostCSS
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
}));
