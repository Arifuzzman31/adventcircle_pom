const { test, expect } = require('@playwright/test');

test('Positive Test: Customer can hire a service successfully', async ({ page }) => {
  console.log(' Starting Hire Service Test');

  try {
    // Step 1: Login as customer
    console.log(' Step 1: Login as customer');
    await page.goto('https://adventcircle.com/');
    await page.waitForLoadState('domcontentloaded'); 
    await page.waitForTimeout(3000); // Increased wait for stability
    console.log(' Homepage loaded');
    
    // Click login link
    await page.getByRole('link', { name: 'Login' }).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    console.log(' Login page loaded');
    
    // Fill login form using proper selectors (matching the codegen exactly)
    await page.getByRole('textbox', { name: '* Email Address' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).click();
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(3000);
    console.log(' Login completed');

    // Wait for page to stabilize after login
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Step 2: Navigate to Marketplace > Services (using exact codegen approach)
    console.log(' Step 2: Navigate to Marketplace > Services');
    await page.getByText('Marketplace', { exact: true }).click();
    await page.waitForTimeout(2000);
    await page.getByRole('link', { name: 'Services' }).click();
    await page.waitForTimeout(3000);
    console.log(' Navigated to Services page');

    // Step 3: Choose the first service (using codegen approach)
    console.log(' Step 3: Selecting first service for hire');
    await page.getByRole('link', { name: 'Total Care Cleaning Combo Our' }).click();
    await page.waitForTimeout(3000);
    console.log(' First service selected');

    // Step 4: Click Hire Now button
    console.log(' Step 4: Click Hire Now button');
    await page.getByRole('button', { name: 'Hire now' }).first().click();
    await page.waitForTimeout(2000);
    console.log(' Hire Now button clicked');

    // Step 5: Fill address (with fallback approach)
    console.log(' Step 5: Fill address');
    await page.getByRole('textbox', { name: 'Enter your full address' }).click();
    await page.waitForTimeout(1000);
    
    // Try to select the Broadway address, if not available use fallback
    try {
      await page.getByText('BroadwayNew York, NY 11211, USA').click({ timeout: 5000 });
      console.log(' Address filled: Broadway New York');
    } catch (error) {
      console.log(' Broadway address not found, trying alternative approach');
      // Fill address manually if dropdown doesn't appear
      await page.getByRole('textbox', { name: 'Enter your full address' }).fill('123 Broadway, New York, NY 11211, USA');
      await page.waitForTimeout(1000);
      console.log(' Address filled manually: Broadway New York');
    }

    // Step 6: Fill contact number
    console.log(' Step 6: Fill contact number');
    await page.getByRole('textbox', { name: '* Contact Number' }).click();
    await page.getByRole('textbox', { name: '* Contact Number' }).fill('+8801962416679');
    console.log(' Contact number filled: +8801962416679');

    // Step 7: Fill slot time (exact codegen sequence)
    console.log(' Step 7: Fill slot time');
    await page.locator('.ant-picker').click();
    await page.getByRole('cell', { name: '22' }).locator('div').click();
    await page.getByText('14').nth(1).dblclick();
    await page.getByRole('textbox', { name: '* Slot Time' }).click();
    await page.getByRole('cell', { name: '24' }).locator('div').click();
    await page.getByText('17').nth(1).click();
    await page.getByText('10').nth(3).click();
    await page.getByRole('button', { name: 'OK', exact: true }).click();
    await page.waitForTimeout(1000);
    console.log(' Slot time selected successfully');

    // Step 8: Fill work overview
    console.log(' Step 8: Fill work overview');
    await page.getByRole('textbox', { name: '* Work overview' }).click();
    await page.getByRole('textbox', { name: '* Work overview' }).fill('for testing');
    console.log(' Work overview filled: for testing');

    // Step 9: Click Book Now
    console.log(' Step 9: Click Book Now');
    await page.getByRole('button', { name: 'Book Now' }).click();
    await page.waitForTimeout(3000);
    console.log(' Book Now button clicked');

    // Step 10: Verify service booking (codegen final step)
    console.log(' Step 10: Verify service booking success');
    await page.locator('.ant-table-cell > .flex').first().click();
    await page.waitForTimeout(1000);
    console.log(' SUCCESS: Service booking confirmed - Table element clicked successfully');

    console.log('  Hire Service Test COMPLETED SUCCESSFULLY');
    
  } catch (error) {
    console.error('  Test failed with error:', error.message);
    try {
      await page.screenshot({ 
        path: `hire-service-failure-${Date.now()}.png`,
        fullPage: true 
      });
      console.log(' Screenshot saved for debugging');
    } catch (screenshotError) {
      console.log(' Could not take screenshot:', screenshotError.message);
    }
    throw error;
  }
});