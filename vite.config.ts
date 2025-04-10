import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.ttf'], // Include font files as assets
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

});
