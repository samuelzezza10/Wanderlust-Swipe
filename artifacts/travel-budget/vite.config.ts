import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;
const port = rawPort ? Number(rawPort) : 3001;

const basePath = process.env.BASE_PATH ?? '/';

// Expose `VITE_GOOGLE_API_KEY` (and ONLY that) to the client bundle for
// Maps/Places. We deliberately do NOT fall back to `GOOGLE_API_KEY`, because
// that variable is the server-side Gemini key and must never reach the client.
// To enable Maps/Places client-side, set `VITE_GOOGLE_API_KEY` explicitly:
//   - In Replit dev: add it as a separate Secret (a Maps-only, referrer-
//     restricted key from Google Cloud Console).
//   - In CI: as the `VITE_GOOGLE_API_KEY` GitHub Actions secret.
const googleApiKey = process.env.VITE_GOOGLE_API_KEY ?? "";

export default defineConfig({
  base: basePath,
  define: {
    "import.meta.env.VITE_GOOGLE_API_KEY": JSON.stringify(googleApiKey),
  },
  plugins: [
    react(),
    tailwindcss({ optimize: false }),
    // Only inject the Replit error overlay in development — keep the
    // production bundle clean for GitHub Pages / Cloudflare Pages exports.
    ...(process.env.NODE_ENV !== "production" ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
