import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  test: {
    coverage: {
      include: ["src/**/*"],
      exclude: ["src/stories/**/*", "src/**/*.spec.*"],
      all: true,
      statements: 90,
    },
    environment: 'jsdom',
    restoreMocks: true,
  },
})