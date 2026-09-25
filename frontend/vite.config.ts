import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_NAME || "/",
  optimizeDeps: {
    include: ["lottie-react"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 👇 ADD THIS
  test: {
    environment: "jsdom",
    setupFiles: "./src/setup-tests.ts",
    globals: true,
  },
});
