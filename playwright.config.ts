import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.spec\.ts/,

  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  retries: isCI ? 2 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['allure-playwright']
  ],

  reportSlowTests: { max: 5, threshold: 15_000 },

  projects: isCI
    ? [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } }]
    : [
      { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
      { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'webkit', use: { ...devices['Desktop Safari'] } }
    ]
});
