const { test, expect } = require('@playwright/test');

test('Login Check', async ({ page }) => {
  console.log('🔍 Testing login...');
  
  await page.goto('https://adventcircle.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
  await page.getByRole('textbox', { name: '* Password' }).click();
  await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait and check if login worked
  await page.waitForTimeout(5000);
  
  // Take screenshot
  await page.screenshot({ path: 'login-check-result.png' });
  
  // Check if we can find the share button (indicates successful login)
  try {
    await page.getByText('Share your thoughts, prayers').waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Login successful - Share button found');
  } catch (error) {
    console.log('❌ Login failed - Share button not found');
    console.log('Current URL:', page.url());
    throw error;
  }
});
