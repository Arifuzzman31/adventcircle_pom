const { test, expect } = require('@playwright/test');

test('Codegen Spiritual Resource Test', async ({ page }) => {
  console.log('🚀 Starting Codegen Spiritual Resource Test');
  
  try {
    // Follow exact codegen pattern
    await page.goto('https://adventcircle.com/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).click();
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    console.log('✅ Login completed');
    await page.waitForTimeout(3000);
    
    // Navigate to spiritual resources
    await page.getByText('Spiritual ResourcesSee All').click();
    await page.getByRole('link', { name: 'See All' }).nth(2).click();
    console.log('✅ Navigated to Spiritual Resources');
    await page.waitForTimeout(2000);
    
    // Click Holy Bible
    await page.getByRole('link', { name: 'Start Reading →' }).first().click();
    console.log('✅ Holy Bible opened');
    await page.waitForTimeout(3000);
    
    // Holy Bible navigation
    const currentUrl1 = page.url();
    console.log('Holy Bible URL before navigation:', currentUrl1);
    
    await page.getByRole('button').nth(2).click();
    await page.waitForTimeout(500);
    
    try {
      await page.locator('.fixed.top-1\\/2').click();
      await page.locator('.fixed.top-1\\/2').click();
      await page.locator('.fixed.top-1\\/2').click();
      console.log('✅ Fixed top buttons clicked');
    } catch (error) {
      console.log('Fixed top buttons not available');
    }
    
    await page.getByRole('button').nth(2).click();
    await page.getByRole('button').nth(2).click();
    await page.getByRole('button').nth(2).click();
    await page.getByRole('button').nth(2).click();
    await page.getByRole('button').nth(2).click();
    
    await page.waitForTimeout(1000);
    const newUrl1 = page.url();
    console.log('Holy Bible URL after navigation:', newUrl1);
    const holyBibleChanged = currentUrl1 !== newUrl1;
    console.log('Holy Bible navigation successful:', holyBibleChanged);
    
    // Navigate back to spiritual resources
    await page.goto('https://adventcircle.com/spiritual-resources');
    console.log('✅ Back to Spiritual Resources');
    await page.waitForTimeout(2000);
    
    // Click Advent Hymnal
    await page.getByRole('link', { name: 'Start Reading →' }).nth(2).click();
    console.log('✅ Advent Hymnal opened');
    await page.waitForTimeout(3000);
    
    // Advent Hymnal navigation
    const currentUrl2 = page.url();
    console.log('Advent Hymnal URL before page 2:', currentUrl2);
    
    await page.getByText('2', { exact: true }).click();
    await page.waitForTimeout(2000);
    
    const newUrl2 = page.url();
    console.log('Advent Hymnal URL after page 2:', newUrl2);
    const adventHymnalChanged = currentUrl2 !== newUrl2;
    console.log('Advent Hymnal navigation successful:', adventHymnalChanged);
    
    // Take screenshot
    await page.screenshot({ path: 'codegen-spiritual-success.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
    // Verification
    console.log('Final Results:');
    console.log('- Holy Bible navigation:', holyBibleChanged);
    console.log('- Advent Hymnal navigation:', adventHymnalChanged);
    
    // Test passes if at least one navigation worked
    const testPassed = holyBibleChanged || adventHymnalChanged;
    expect(testPassed).toBeTruthy();
    
    console.log('🎉 Codegen Spiritual Resource Test PASSED');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    try {
      await page.screenshot({ path: `codegen-spiritual-failure-${Date.now()}.png`, fullPage: true });
    } catch (screenshotError) {
      console.log('Could not take failure screenshot');
    }
    
    throw error;
  }
});
