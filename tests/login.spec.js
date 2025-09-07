
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('AdventCircle Login Test', () => {
  test('Login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login();

   
    await expect(page).toHaveURL(/dashboard|home|feeds/); 
    console.log("✅ Logged in successfully!");
  });
});
