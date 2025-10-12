const { test, expect } = require('@playwright/test');

test('Text Only Post Test - No Image', async ({ page }) => {
  console.log('🚀 Testing text-only post creation...');
  
  // Login
  await page.goto('https://adventcircle.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
  await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(3000);
  console.log('✅ Login completed');

  // Create text-only post
  await page.getByText('Share your thoughts, prayers').click();
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).fill('Text only test post');
  console.log('✅ Text filled');
  
  // Post without image
  await page.getByRole('button', { name: 'Post' }).click();
  console.log('✅ Posted');
  
  // Wait and verify
  await page.waitForTimeout(3000);
  
  try {
    await expect(page.getByText('Text only test post')).toBeVisible({ timeout: 10000 });
    console.log('🎉 TEXT-ONLY TEST PASSED: Post created successfully');
  } catch (error) {
    console.log('❌ TEXT-ONLY TEST FAILED: Post not found');
    throw error;
  }
});
