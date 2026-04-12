import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    headless: true,
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
