const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  
  /* Reporter configuration */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  
  use: {
    headless: false,
    baseURL: 'https://adventcircle.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
});