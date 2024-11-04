import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export function defineTest(name: string, environment?: "node" | "happy-dom") {
  return defineConfig({
    plugins: [tsConfigPaths()],
    test: {
      name,
      environment,
      testTimeout: 30000,
    },
  });
}
