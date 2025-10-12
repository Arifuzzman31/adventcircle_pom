const { test, expect } = require('@playwright/test');

test('Simple Feed Test: Create post with image', async ({ page }) => {
  console.log('🚀 Starting simple feed test...');
  
  // Step 1: Login
  console.log('📝 Step 1: Login');
  await page.goto('https://adventcircle.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
  await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(3000);
  console.log('✅ Login completed');

  // Step 2: Click on the create post
  console.log('📝 Step 2: Click on create post');
  await page.getByText('Share your thoughts, prayers').click();
  console.log('✅ Create post screen appeared');

  // Step 3: Write a text
  console.log('📝 Step 3: Write text');
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).fill('Test post with image');
  console.log('✅ Text written');

  // Step 4: Click on image icon locator
  console.log('📝 Step 4: Click on image icon');
  const imageButton = page.getByLabel('Create post').getByRole('button', { name: 'Image' });
  
  // Step 5: Select a picture
  console.log('📝 Step 5: Select picture');
  await imageButton.setInputFiles('tests/test-data/1.png');
  console.log('✅ Picture selected');
  
  // Wait for image to process
  await page.waitForTimeout(2000);

  // Step 6: Click on submit
  console.log('📝 Step 6: Click submit');
  await page.getByRole('button', { name: 'Post' }).click();
  console.log('✅ Submit clicked');
  
  // Wait for submission
  await page.waitForTimeout(3000);

  // Verification: Check if submitted with image
  console.log('📝 Step 7: Verify submission with image');
  
  try {
    // Look for the post text
    await expect(page.getByText('Test post with image')).toBeVisible({ timeout: 10000 });
    console.log('✅ Post text found');
    
    // Look for any images in the feed (excluding avatars/profiles)
    const feedImages = page.locator('img').filter({ 
      hasNot: page.locator('[src*="avatar"], [src*="profile"], [src*="logo"]') 
    });
    
    // Check if we have feed images
    const imageCount = await feedImages.count();
    console.log(`📊 Found ${imageCount} feed images`);
    
    if (imageCount > 0) {
      // Verify at least one image is visible
      await expect(feedImages.first()).toBeVisible({ timeout: 5000 });
      console.log('✅ Image found in feed');
      
      console.log('🎉 TEST PASSED: Post submitted successfully with image');
    } else {
      console.log('❌ TEST FAILED: No images found in feed');
      throw new Error('Post submitted but no image found');
    }
    
  } catch (error) {
    console.log('❌ TEST FAILED: Post submission failed');
    console.log('Error:', error.message);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'simple-test-failure.png', fullPage: true });
    
    throw new Error('Test failed: Post not submitted with image');
  }
});
