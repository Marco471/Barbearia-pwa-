import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // força atualização automática
      devOptions: {
        enabled: true,
      },
      workbox: {
        // cache strategies
      },
    }),
  ],
});
