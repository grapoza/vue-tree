import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    Vue(),
  ],
  test: {
    coverage: {
      include: ["src/**/*"],
      all: true,
      statements: 90,
    },
    environment: 'jsdom',
    restoreMocks: true,
  },
})