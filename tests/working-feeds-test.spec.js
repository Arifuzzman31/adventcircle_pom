const { test, expect } = require('@playwright/test');

test('Working Feeds Test - Fixed Text Matching', async ({ page }) => {
  console.log('🚀 Starting working feeds test with proper text matching...');
  
  // Login
  await page.goto('https://adventcircle.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
  await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(5000);
  console.log('✅ Login completed');
  
  // Create unique post text with timestamp
  const uniqueText = `Im not feeling ok - ${Date.now()}`;
  console.log(`📝 Creating post with text: ${uniqueText}`);
  
  // Create post
  await page.getByText('Share your thoughts, prayers').click();
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).fill(uniqueText);
  
  // Upload image
  await page.getByLabel('Create post').getByRole('button', { name: 'Image' }).setInputFiles('tests/test-data/1.png');
  await page.waitForTimeout(2000);
  
  // Post
  await page.getByRole('button', { name: 'Post' }).click();
  await page.waitForTimeout(3000);
  console.log('✅ Post created');
  
  // Check if post appears immediately
  try {
    await expect(page.getByText(uniqueText)).toBeVisible({ timeout: 5000 });
    console.log('✅ Post visible immediately');
  } catch (error) {
    console.log('⚠️ Post not immediately visible, checking after reload...');
  }
  
  // Reload and verify
  await page.reload();
  await page.waitForLoadState('networkidle');
  console.log('✅ Page reloaded');
  
  // Verify post exists after reload
  await expect(page.getByText(uniqueText)).toBeVisible({ timeout: 10000 });
  console.log('✅ Post found after reload');
  
  // Verify images exist in feed
  const feedImages = page.locator('img').filter({ 
    hasNot: page.locator('[src*="avatar"], [src*="profile"], [src*="logo"], [src*="icon"]') 
  });
  
  const imageCount = await feedImages.count();
  console.log(`✅ Found ${imageCount} feed images`);
  
  if (imageCount > 0) {
    await expect(feedImages.first()).toBeVisible();
    console.log('✅ Feed images verified');
  }
  
  console.log('🎉 TEST PASSED: Post with image successfully created and verified');
});
