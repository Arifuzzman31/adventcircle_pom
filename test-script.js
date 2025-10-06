const { chromium } = require('playwright');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to Google...');
  await page.goto('https://www.google.com');
  console.log('Page title:', await page.title());
  
  await page.screenshot({ path: 'google.png' });
  console.log('Screenshot saved to google.png');
  
  await browser.close();
  console.log('Test completed successfully');
})().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
