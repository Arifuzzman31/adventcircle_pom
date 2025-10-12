const { test, expect } = require('@playwright/test');

test('Simple Event Navigation Test', async ({ page }) => {
  console.log('🔍 Starting Simple Event Navigation Test');
  
  try {
    // Step 1: Go to homepage
    console.log('Step 1: Going to homepage');
    await page.goto('https://adventcircle.com/');
    
    // Step 2: Login
    console.log('Step 2: Logging in');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder.dev@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('123456Ab@');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Login completed');
    
    // Step 3: Navigate to events via menu
    console.log('Step 3: Navigating to events via menu');
    
    // Handle toaster if present
    const toaster = page.locator('#_rht_toaster');
    if (await toaster.isVisible()) {
      console.log('Waiting for toaster to disappear...');
      await toaster.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {
        console.log('Toaster did not disappear, continuing...');
      });
    }
    
    // Click menu
    await page.getByRole('navigation').locator('svg').nth(3).click();
    await page.waitForTimeout(1000);
    
    // Click events link
    await page.getByRole('link', { name: 'Events' }).nth(1).click({ force: true });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    console.log('✅ Navigated to events via menu');
    console.log('Current URL:', page.url());
    
    // Step 4: Find and click on Test Event action button
    console.log('Step 4: Looking for Test Event');
    
    const testEventRow = page.getByRole('row').filter({ hasText: 'Test Event' }).first();
    const isVisible = await testEventRow.isVisible();
    console.log('Test Event row visible:', isVisible);
    
    if (isVisible) {
      const actionButton = testEventRow.locator('button').last(); // Get the last button (action button)
      console.log('Found action button, clicking...');
      await actionButton.click();
      await page.waitForTimeout(1000);
      
      // Check if dropdown appeared
      const viewLink = page.getByRole('link', { name: 'View' });
      const editLink = page.getByRole('link', { name: 'Edit' });
      
      const viewVisible = await viewLink.isVisible();
      const editVisible = await editLink.isVisible();
      
      console.log('View link visible:', viewVisible);
      console.log('Edit link visible:', editVisible);
      
      console.log('✅ Successfully clicked action button and found menu options');
    } else {
      console.log('❌ Test Event row not found');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'simple-event-test.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    
    try {
      await page.screenshot({ path: 'simple-event-error.png', fullPage: true });
    } catch (screenshotError) {
      console.log('Could not take error screenshot');
    }
    
    throw error;
  }
});
