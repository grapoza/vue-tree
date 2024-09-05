import { coverageConfigDefaults, defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],
  test: {
    coverage: {
      include: ["src/**/*"],
      exclude: ["src/stories/**/*", "src/**/*.spec.*", ...coverageConfigDefaults.exclude],
      all: true,
      thresholds: {
        statements: 90,
      },
    },
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
  },
});