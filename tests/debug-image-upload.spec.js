const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginpage');
const { FeedsPage } = require('../pages/feedpage');

test('Debug: Image upload issue investigation', async ({ page }) => {
  console.log('🚀 Starting image upload debug test...');
  
  await page.goto('https://adventcircle.com/');

  // Navigate to login page first
  await page.getByRole('link', { name: 'Login' }).click();

  // Login using existing login page
  const loginPage = new LoginPage(page);
  await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');

  // Initialize feeds page
  const feedsPage = new FeedsPage(page);

  // Click on share your thoughts, prayers, or anything
  console.log('📝 Clicking share thoughts...');
  await feedsPage.clickShareThoughts();

  // Write a text
  console.log('✍️ Filling post text...');
  await feedsPage.fillPostText('DEBUG: Testing image upload functionality');

  // Take a screenshot before image upload
  await page.screenshot({ path: 'debug-before-upload.png', fullPage: true });
  console.log('📸 Screenshot taken before upload');

  // Click on media and select a picture
  console.log('🖼️ Starting image upload...');
  const testImagePath = 'tests/test-data/1.png';
  
  try {
    await feedsPage.uploadImage(testImagePath);
    console.log('✅ Image upload completed successfully');
  } catch (error) {
    console.log('❌ Image upload failed:', error.message);
  }

  // Take a screenshot after image upload
  await page.screenshot({ path: 'debug-after-upload.png', fullPage: true });
  console.log('📸 Screenshot taken after upload');

  // Wait a bit more to see if image appears
  await page.waitForTimeout(3000);

  // Check the DOM for any image-related elements
  console.log('🔍 Checking DOM for image elements...');
  
  // Check for file input value
  const fileInputs = await page.locator('input[type="file"]').all();
  console.log(`Found ${fileInputs.length} file inputs`);
  
  for (let i = 0; i < fileInputs.length; i++) {
    const files = await fileInputs[i].inputValue();
    const isVisible = await fileInputs[i].isVisible();
    console.log(`File input ${i}: value="${files}", visible=${isVisible}`);
  }

  // Check for any preview containers
  const previewContainers = await page.locator('[class*="preview"], [class*="upload"], .ant-upload').all();
  console.log(`Found ${previewContainers.length} preview/upload containers`);
  
  for (let i = 0; i < Math.min(previewContainers.length, 5); i++) {
    const className = await previewContainers[i].getAttribute('class');
    const isVisible = await previewContainers[i].isVisible();
    console.log(`Container ${i}: class="${className}", visible=${isVisible}`);
  }

  // Click on post anyway to see what happens
  console.log('📤 Clicking post button...');
  await feedsPage.clickPost();

  // Take a screenshot after posting
  await page.screenshot({ path: 'debug-after-post.png', fullPage: true });
  console.log('📸 Screenshot taken after posting');

  // Try to verify the post text (this should work)
  try {
    await feedsPage.verifyPostText('DEBUG: Testing image upload functionality');
    console.log('✅ Post text verification successful');
  } catch (error) {
    console.log('❌ Post text verification failed:', error.message);
  }

  // Try to verify the posted image (this is where the issue likely is)
  try {
    await feedsPage.verifyPostedImage();
    console.log('✅ Posted image verification successful');
  } catch (error) {
    console.log('❌ Posted image verification failed:', error.message);
  }

  console.log('🏁 Debug test completed');
});
