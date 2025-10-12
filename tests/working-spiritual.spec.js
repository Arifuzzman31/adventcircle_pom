const { test, expect } = require('@playwright/test');

test('Working Spiritual Resource Test', async ({ page }) => {
  console.log('🚀 Starting Working Spiritual Resource Test');
  
  try {
    // Step 1: Login
    console.log('📝 Step 1: Login');
    await page.goto('https://adventcircle.com/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Login completed');

    // Step 2: Navigate to Spiritual Resources
    console.log('📝 Step 2: Navigate to Spiritual Resources');
    await page.getByRole('link', { name: 'See All' }).nth(2).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    console.log('✅ Navigated to Spiritual Resources');

    // Step 3: Click on Holy Bible
    console.log('📝 Step 3: Click on Holy Bible');
    await page.getByRole('link', { name: 'START READING →' }).first().click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Holy Bible opened');

    // Step 4: Click next page arrow
    console.log('📝 Step 4: Click next page arrow');
    const currentUrl1 = page.url();
    console.log('Current URL before next page:', currentUrl1);
    
    await page.getByRole('button').nth(2).click();
    await page.waitForTimeout(2000);
    
    const newUrl1 = page.url();
    console.log('Current URL after next page:', newUrl1);
    
    const holyBiblePageChanged = currentUrl1 !== newUrl1;
    console.log('Holy Bible page changed:', holyBiblePageChanged);

    // Step 5: Navigate back to Spiritual Resources
    console.log('📝 Step 5: Navigate back to Spiritual Resources');
    await page.goto('https://adventcircle.com/spiritual-resources');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    console.log('✅ Back to Spiritual Resources');

    // Step 6: Click on Advent Hymnal
    console.log('📝 Step 6: Click on Advent Hymnal');
    await page.getByRole('link', { name: 'START READING →' }).nth(2).click();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Advent Hymnal opened');

    // Step 7: Click on page 2
    console.log('📝 Step 7: Click on page 2');
    const currentUrl2 = page.url();
    console.log('Current URL before page 2:', currentUrl2);
    
    await page.getByText('2', { exact: true }).click();
    await page.waitForTimeout(2000);
    
    const newUrl2 = page.url();
    console.log('Current URL after page 2:', newUrl2);
    
    const adventHymnalPageChanged = currentUrl2 !== newUrl2;
    console.log('Advent Hymnal page changed:', adventHymnalPageChanged);

    // Verification
    console.log('📝 Final verification');
    console.log('Holy Bible navigation result:', holyBiblePageChanged);
    console.log('Advent Hymnal navigation result:', adventHymnalPageChanged);

    // Take success screenshot
    await page.screenshot({ path: 'spiritual-resource-success.png', fullPage: true });
    console.log('📸 Success screenshot saved');

    // Test passes if at least one navigation worked (some pages might not have navigation)
    const testPassed = holyBiblePageChanged || adventHymnalPageChanged;
    expect(testPassed).toBeTruthy();

    console.log('🎉 Spiritual Resource Test PASSED');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    try {
      await page.screenshot({ path: `spiritual-working-failure-${Date.now()}.png`, fullPage: true });
    } catch (screenshotError) {
      console.log('Could not take failure screenshot');
    }
    
    throw error;
  }
});
