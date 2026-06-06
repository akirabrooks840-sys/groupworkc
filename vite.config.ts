import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "./src/server.ts" },
    }),
    viteReact(),
    nitro({
      config: {
        preset: isVercel ? "vercel" : undefined,
      },
    }),
  ],
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: "./src/server.ts",
        },
      },
    },
  },
  build: {
    target: "es2022",
  },
});
