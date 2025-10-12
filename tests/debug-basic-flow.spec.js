const { test, expect } = require('@playwright/test');

test('Debug: Basic flow step by step', async ({ page }) => {
  console.log('🚀 Starting basic debug test...');
  
  try {
    // Step 1: Go to site
    console.log('📝 Step 1: Navigate to site');
    await page.goto('https://adventcircle.com/');
    console.log('✅ Site loaded');

    // Step 2: Click login
    console.log('📝 Step 2: Click login');
    await page.getByRole('link', { name: 'Login' }).click();
    console.log('✅ Login page opened');

    // Step 3: Fill credentials
    console.log('📝 Step 3: Fill credentials');
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    console.log('✅ Credentials filled');

    // Step 4: Click login button
    console.log('📝 Step 4: Click login button');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForTimeout(5000);
    console.log('✅ Login attempted');

    // Step 5: Try to find create post
    console.log('📝 Step 5: Look for create post');
    const shareButton = page.getByText('Share your thoughts, prayers');
    await shareButton.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Create post button found');

    // Step 6: Click create post
    console.log('📝 Step 6: Click create post');
    await shareButton.click();
    console.log('✅ Create post clicked');

    // Step 7: Fill text
    console.log('📝 Step 7: Fill text');
    const textbox = page.getByRole('textbox', { name: 'Share your thoughts, prayers' });
    await textbox.waitFor({ state: 'visible', timeout: 5000 });
    await textbox.fill('Im not feeling ok');
    console.log('✅ Text filled');

    // Step 8: Try image upload
    console.log('📝 Step 8: Try image upload');
    const imageButton = page.getByLabel('Create post').getByRole('button', { name: 'Image' });
    await imageButton.waitFor({ state: 'visible', timeout: 5000 });
    await imageButton.setInputFiles('tests/test-data/1.png');
    console.log('✅ Image upload attempted');
    
    await page.waitForTimeout(3000);

    // Step 9: Click post
    console.log('📝 Step 9: Click post');
    const postButton = page.getByRole('button', { name: 'Post' });
    await postButton.waitFor({ state: 'visible', timeout: 5000 });
    await postButton.click();
    console.log('✅ Post button clicked');
    
    await page.waitForTimeout(5000);

    // Step 10: Check if post exists before reload
    console.log('📝 Step 10: Check post before reload');
    try {
      await expect(page.getByText('Im not feeling ok')).toBeVisible({ timeout: 10000 });
      console.log('✅ Post visible before reload');
    } catch (error) {
      console.log('⚠️ Post not visible before reload');
    }

    // Step 11: Reload
    console.log('📝 Step 11: Reload page');
    await page.reload();
    await page.waitForLoadState('networkidle');
    console.log('✅ Page reloaded');

    // Step 12: Final verification
    console.log('📝 Step 12: Final verification');
    await expect(page.getByText('Im not feeling ok')).toBeVisible({ timeout: 15000 });
    console.log('✅ Post found after reload');

    console.log('🎉 ALL STEPS COMPLETED SUCCESSFULLY');

  } catch (error) {
    console.log('❌ Test failed at step:', error.message);
    
    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-failure.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-failure.png');
    
    throw error;
  }
});
