import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3001',
    env: { REACT_APP_API_BASE: 'http://localhost:3001/test_support' },
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
  webServer: {
    command: "RAILS_ENV=test bin/rails server -p 3001",
    cwd: "../",
    port: 3001,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
