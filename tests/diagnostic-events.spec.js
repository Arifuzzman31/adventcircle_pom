const { test, expect } = require('@playwright/test');

test('Diagnostic - Check Events Page', async ({ page }) => {
  console.log('🔍 Starting Events Page Diagnostic');
  
  try {
    // Login first
    await page.goto('https://adventcircle.com/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder.dev@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('123456Ab@');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    console.log('✅ Login completed');
    
    // Navigate to events - try direct URL first
    await page.goto('https://adventcircle.com/church/events/list?page=1&limit=10');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    console.log('✅ Navigated to events page');
    console.log('Current URL:', page.url());
    
    // Check what events are available
    const allRows = await page.getByRole('row').count();
    console.log(`Found ${allRows} rows total`);
    
    // List all rows
    for (let i = 0; i < Math.min(allRows, 10); i++) {
      try {
        const row = page.getByRole('row').nth(i);
        const rowText = await row.textContent();
        console.log(`Row ${i}: ${rowText?.slice(0, 100)}...`);
      } catch (error) {
        console.log(`Row ${i}: Could not read text`);
      }
    }
    
    // Check for specific event patterns
    const testEventRows = await page.getByRole('row').filter({ hasText: 'Test Event' }).count();
    console.log(`Found ${testEventRows} rows containing 'Test Event'`);
    
    const eventRows = await page.getByRole('row').filter({ hasText: 'Event' }).count();
    console.log(`Found ${eventRows} rows containing 'Event'`);
    
    // Check for action buttons
    const actionButtons = await page.getByRole('button').count();
    console.log(`Found ${actionButtons} buttons total`);
    
    // Take screenshot for visual inspection
    await page.screenshot({ path: 'events-page-diagnostic.png', fullPage: true });
    console.log('📸 Screenshot saved as events-page-diagnostic.png');
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    try {
      await page.screenshot({ path: 'diagnostic-error.png', fullPage: true });
    } catch (screenshotError) {
      console.log('Could not take error screenshot');
    }
    throw error;
  }
});
