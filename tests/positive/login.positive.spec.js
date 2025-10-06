const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage');

test.describe('AdventCircle Login Tests - Positive Tests', () => {

  test('Login with valid credentials (positive test)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');

    // Expect to land on dashboard/home after login
    await expect(page).toHaveURL(/dashboard|home|feeds/);
  });

});
