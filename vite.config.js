import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react";
          }

          if (id.includes("node_modules/zustand")) {
            return "state";
          }

          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }

          if (id.includes("node_modules/recharts")) {
            return "recharts-core";
          }

          if (id.includes("node_modules/victory-vendor")) {
            return "charts-vendor";
          }

          if (id.includes("node_modules/react-smooth")) {
            return "charts-motion";
          }

          if (id.includes("node_modules/d3-")) {
            return "charts-d3";
          }

          if (id.includes("node_modules/lodash")) {
            return "charts-utils";
          }
        },
      },
    },
  },
});
