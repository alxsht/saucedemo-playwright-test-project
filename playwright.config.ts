import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry'
  },

  retries: isCI ? 2 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],

  projects: isCI
    ? [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } }
      ]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
      ]
});
