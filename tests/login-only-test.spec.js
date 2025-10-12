const { test, expect } = require('@playwright/test');

test('Login Only Test', async ({ page }) => {
  console.log('🔍 Testing login only...');
  
  try {
    await page.goto('https://adventcircle.com/');
    console.log('✅ Site loaded');
    
    await page.getByRole('link', { name: 'Login' }).click();
    console.log('✅ Login page opened');
    
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    console.log('✅ Credentials filled');
    
    await page.getByRole('button', { name: 'Login' }).click();
    console.log('✅ Login button clicked');
    
    await page.waitForTimeout(5000);
    
    // Check if we're logged in by looking for the share button
    const shareButton = page.getByText('Share your thoughts, prayers');
    await shareButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Share button found - login successful');
    
    // Take screenshot of successful login
    await page.screenshot({ path: 'login-success.png' });
    
    console.log('🎉 LOGIN TEST PASSED');
    
  } catch (error) {
    console.log('❌ LOGIN TEST FAILED:', error.message);
    
    // Take screenshot of failure
    await page.screenshot({ path: 'login-failure.png' });
    
    // Check what's on the page
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    const url = page.url();
    console.log('Current URL:', url);
    
    throw error;
  }
});
