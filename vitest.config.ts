import * as path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    css: {
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    deps: {
      // 使用 identity-obj-proxy 模拟 CSS modules
      inline: [/\.module\.less$/],
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    jsx: 'transform',
  },
})
