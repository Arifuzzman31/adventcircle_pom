const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    headless: false,
    baseURL: 'https://adventcircle.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  }
});
