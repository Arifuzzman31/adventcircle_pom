
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');

test.describe('AdventCircle Login Tests', () => {

  test('Login with valid credentials (positive test)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');

    // Expect to land on dashboard/home after login
    await expect(page).toHaveURL(/dashboard|home|feeds/);
  });

  test('Login with wrong password (negative test)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('ratulsikder.dev@gmail.com', 'WrongPass123');

    // Expect error message
    await expect(page.locator('.ant-form-item-explain-error')).toHaveText(/invalid/i);
  });

  test('Login with wrong email (negative test)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wrongemail@example.com', 'Ratul@104!');

    await expect(page.locator('.ant-form-item-explain-error')).toHaveText(/invalid/i);
  });

  test('Login with empty fields (negative test)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');

    // Expect required field validation
    await expect(page.locator('#identifier_help')).toHaveText(/required/i);
    await expect(page.locator('#password_help')).toHaveText(/required/i);
  });

});
test('Non-Registered Email', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('notexists@example.com', 'Ratul@104!');
  await expect(page.locator('.ant-form-item-explain-error')).toContainText(/invalid/i);
});
test('SQL Injection Attempt', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("' OR '1'='1", 'anything');
  await expect(page.locator('.ant-form-item-explain-error')).toHaveText(/invalid/i);
});
test('Cross-Site Script (XSS) Attempt', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('<script>alert("hack")</script>', 'test123');
  await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();
});
test('Password Exceeds Max Length', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const longPass = 'a'.repeat(300);
  await loginPage.goto();
  await loginPage.login('ratulsikder.dev@gmail.com', longPass);
  await expect(page.locator('.ant-form-item-explain-error')).toBeVisible();
});