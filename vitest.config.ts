import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 95,
        functions: 100,
        statements: 95,
        branches: 90,
      },
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.test.ts",
        "vitest.config.ts",
        "src/data/*.json",
        "src/test/**",
      ],
    },
  },
});
