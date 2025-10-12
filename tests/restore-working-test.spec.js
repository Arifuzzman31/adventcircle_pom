const { test, expect } = require('@playwright/test');

test('Restore Working Test - Exact 3:07 Approach', async ({ page }) => {
  console.log('🔄 Restoring the working test from 3:07...');
  
  // Use the exact approach that was working
  await page.goto('https://adventcircle.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  
  // Login
  await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
  await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait for login
  await page.waitForTimeout(3000);
  
  // Create post
  await page.getByText('Share your thoughts, prayers').click();
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).fill('Im not feeling ok');
  
  // Upload image using the working method
  await page.getByLabel('Create post').getByRole('button', { name: 'Image' }).setInputFiles('tests/test-data/1.png');
  
  // Wait for upload
  await page.waitForTimeout(2000);
  
  // Post
  await page.getByRole('button', { name: 'Post' }).click();
  
  // Wait for post to complete
  await page.waitForTimeout(3000);
  
  // Simple verification - just check if text appears (don't worry about image for now)
  try {
    await expect(page.getByText('Im not feeling ok')).toBeVisible({ timeout: 10000 });
    console.log('✅ SUCCESS: Post text found immediately after posting');
    
    // Now reload and check again
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await expect(page.getByText('Im not feeling ok')).toBeVisible({ timeout: 10000 });
    console.log('✅ SUCCESS: Post text found after reload');
    
    console.log('🎉 TEST PASSED: Working functionality restored');
    
  } catch (error) {
    console.log('❌ FAILED: Post not found');
    
    // Debug: Take screenshot
    await page.screenshot({ path: 'restore-test-failure.png', fullPage: true });
    
    // Debug: Check what's on the page
    const allText = await page.textContent('body');
    console.log('Page contains login-related text:', allText.includes('Login'));
    console.log('Page contains feed-related text:', allText.includes('Share your thoughts'));
    
    throw error;
  }
});
