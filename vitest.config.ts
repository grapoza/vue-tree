import { configDefaults, defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],
  test: {
    coverage: {
      include: ["src/**/*"],
      exclude: ["src/stories/**/*", "src/**/*.spec.*", ...configDefaults.exclude],
      all: true,
      statements: 90,
    },
    environment: "jsdom",
    globals: true,
    restoreMocks: true,
  },
});