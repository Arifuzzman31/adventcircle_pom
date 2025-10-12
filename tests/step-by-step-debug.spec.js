const { test, expect } = require('@playwright/test');

test('Step by Step Debug - Check Each Step', async ({ page }) => {
  console.log('🔍 Starting step-by-step debugging...');
  
  try {
    // Step 1: Navigate
    console.log('Step 1: Navigate to site');
    await page.goto('https://adventcircle.com/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Site loaded successfully');
    
    // Take screenshot after loading
    await page.screenshot({ path: 'debug-step1-loaded.png' });
    
    // Step 2: Find and click login
    console.log('Step 2: Look for login link');
    const loginLink = page.getByRole('link', { name: 'Login' });
    await loginLink.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Login link found');
    
    await loginLink.click();
    await page.waitForTimeout(2000);
    console.log('✅ Login link clicked');
    
    // Take screenshot after login click
    await page.screenshot({ path: 'debug-step2-login-page.png' });
    
    // Step 3: Check login form
    console.log('Step 3: Check login form elements');
    const emailField = page.getByRole('textbox', { name: '* Email Address' });
    const passwordField = page.getByRole('textbox', { name: '* Password' });
    const loginButton = page.getByRole('button', { name: 'Login' });
    
    await emailField.waitFor({ state: 'visible', timeout: 5000 });
    await passwordField.waitFor({ state: 'visible', timeout: 5000 });
    await loginButton.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ All login form elements found');
    
    // Step 4: Fill credentials
    console.log('Step 4: Fill login credentials');
    await emailField.fill('ratulsikder104@gmail.com');
    await passwordField.fill('Ratul@104!');
    console.log('✅ Credentials filled');
    
    // Step 5: Submit login
    console.log('Step 5: Submit login');
    await loginButton.click();
    await page.waitForTimeout(5000);
    console.log('✅ Login submitted');
    
    // Take screenshot after login
    await page.screenshot({ path: 'debug-step5-after-login.png' });
    
    // Step 6: Check if we're logged in
    console.log('Step 6: Check login success');
    
    // Look for elements that indicate successful login
    const shareButton = page.getByText('Share your thoughts, prayers');
    
    try {
      await shareButton.waitFor({ state: 'visible', timeout: 10000 });
      console.log('✅ Login successful - found share button');
    } catch (error) {
      console.log('❌ Login may have failed - share button not found');
      
      // Check if we're still on login page
      const stillOnLogin = await page.getByRole('button', { name: 'Login' }).isVisible();
      if (stillOnLogin) {
        console.log('❌ Still on login page - credentials may be wrong');
      }
      
      // Check for error messages
      const errorMessages = await page.locator('[class*="error"], .error, .alert').all();
      if (errorMessages.length > 0) {
        for (let i = 0; i < errorMessages.length; i++) {
          const errorText = await errorMessages[i].textContent();
          console.log(`Error message ${i}: ${errorText}`);
        }
      }
      
      throw error;
    }
    
    console.log('🎉 All steps completed successfully up to login verification');
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
    
    // Take final screenshot
    await page.screenshot({ path: 'debug-final-failure.png', fullPage: true });
    
    throw error;
  }
});
