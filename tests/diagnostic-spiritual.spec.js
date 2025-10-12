const { test, expect } = require('@playwright/test');

test('Diagnostic - Spiritual Resources Page', async ({ page }) => {
  console.log('🔍 Starting Spiritual Resources Diagnostic');
  
  try {
    // Step 1: Login
    await page.goto('https://adventcircle.com/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Login completed');
    
    // Step 2: Look for "See All" links
    console.log('🔍 Looking for "See All" links...');
    const seeAllLinks = await page.getByRole('link', { name: 'See All' }).count();
    console.log(`Found ${seeAllLinks} "See All" links`);
    
    for (let i = 0; i < seeAllLinks; i++) {
      try {
        const link = page.getByRole('link', { name: 'See All' }).nth(i);
        const href = await link.getAttribute('href');
        const text = await link.textContent();
        console.log(`See All ${i}: "${text}" - Href: "${href}"`);
      } catch (error) {
        console.log(`See All ${i}: Could not read details`);
      }
    }
    
    // Step 3: Try clicking the third "See All" link (nth(2))
    console.log('🔍 Trying to click "See All" nth(2)...');
    try {
      await page.getByRole('link', { name: 'See All' }).nth(2).click();
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(2000);
      
      console.log('Current URL after clicking See All:', page.url());
      
      // Look for "Start Reading" links
      const startReadingLinks = await page.getByRole('link', { name: 'Start Reading →' }).count();
      console.log(`Found ${startReadingLinks} "Start Reading →" links`);
      
      for (let i = 0; i < Math.min(startReadingLinks, 5); i++) {
        try {
          const link = page.getByRole('link', { name: 'Start Reading →' }).nth(i);
          const href = await link.getAttribute('href');
          console.log(`Start Reading ${i}: Href: "${href}"`);
        } catch (error) {
          console.log(`Start Reading ${i}: Could not read href`);
        }
      }
      
    } catch (error) {
      console.log('❌ Failed to click See All nth(2):', error.message);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'spiritual-resources-diagnostic.png', fullPage: true });
    console.log('📸 Screenshot saved');
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    try {
      await page.screenshot({ path: 'spiritual-diagnostic-error.png', fullPage: true });
    } catch (screenshotError) {
      console.log('Could not take error screenshot');
    }
    throw error;
  }
});
