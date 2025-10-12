const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginpage');

test('Inspect DOM structure for image upload', async ({ page }) => {
  await page.goto('https://adventcircle.com/');

  // Navigate to login page first
  await page.getByRole('link', { name: 'Login' }).click();

  // Login
  const loginPage = new LoginPage(page);
  await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');

  // Click on share your thoughts
  await page.getByText('Share your thoughts, prayers').click();
  
  // Fill some text
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).fill('Test post for DOM inspection');

  // Take screenshot before clicking image button
  await page.screenshot({ path: 'dom-before-image-click.png', fullPage: true });

  // Click on image button and inspect what happens
  console.log('🔍 Looking for image button...');
  
  // Try different selectors for the image button
  const imageButtonSelectors = [
    'button[aria-label*="Image"]',
    'button:has-text("Image")',
    '[role="button"]:has-text("Image")',
    '.ant-btn:has-text("Image")',
    'button[title*="Image"]'
  ];

  let imageButton = null;
  for (const selector of imageButtonSelectors) {
    const elements = await page.locator(selector).all();
    if (elements.length > 0) {
      console.log(`Found ${elements.length} elements with selector: ${selector}`);
      imageButton = elements[0];
      break;
    }
  }

  if (imageButton) {
    await imageButton.click();
    console.log('✅ Clicked image button');
    
    // Wait a moment for any UI changes
    await page.waitForTimeout(1000);
    
    // Take screenshot after clicking image button
    await page.screenshot({ path: 'dom-after-image-click.png', fullPage: true });
    
    // Look for file input
    const fileInputs = await page.locator('input[type="file"]').all();
    console.log(`Found ${fileInputs.length} file inputs`);
    
    if (fileInputs.length > 0) {
      // Upload a file
      await fileInputs[0].setInputFiles('tests/test-data/1.png');
      console.log('✅ File uploaded');
      
      // Wait for processing
      await page.waitForTimeout(3000);
      
      // Take screenshot after file upload
      await page.screenshot({ path: 'dom-after-file-upload.png', fullPage: true });
      
      // Inspect the DOM for any changes
      const uploadContainers = await page.locator('[class*="upload"], [class*="preview"], [class*="image"]').all();
      console.log(`Found ${uploadContainers.length} upload/preview containers`);
      
      // Look for any images that might have been created
      const allImages = await page.locator('img').all();
      console.log(`Found ${allImages.length} total images on page`);
      
      for (let i = 0; i < allImages.length; i++) {
        const src = await allImages[i].getAttribute('src');
        const alt = await allImages[i].getAttribute('alt');
        const isVisible = await allImages[i].isVisible();
        if (src && (src.includes('blob:') || src.includes('data:') || src.includes('1.png'))) {
          console.log(`🖼️ Potential uploaded image ${i}: src="${src}", alt="${alt}", visible=${isVisible}`);
        }
      }
    }
  } else {
    console.log('❌ Image button not found');
  }

  // Get the full HTML of the post creation area for analysis
  const postArea = await page.locator('[class*="post"], [class*="create"], [class*="share"]').first();
  if (await postArea.count() > 0) {
    const html = await postArea.innerHTML();
    console.log('📄 Post area HTML structure:');
    console.log(html.substring(0, 1000) + '...');
  }
});
