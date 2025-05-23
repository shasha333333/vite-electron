import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // 测试文件匹配模式
    include: [
      'electron/**/*.{test,spec}.{js,mjs,ts,jsx,tsx}',
      'electron/**/__tests__/**/*.{js,mjs,ts,jsx,tsx}'
    ],
    // 测试环境
    environment: 'node',
    // 全局测试超时时间（毫秒）
    testTimeout: 5000,
    // 是否在控制台显示测试覆盖率
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['electron/**/*.{js,mjs,ts}'],
      exclude: ['electron/**/*.d.ts', 'electron/**/*.test.{js,mjs,ts}']
    }
  }
}); 