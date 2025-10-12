const { test, expect } = require('@playwright/test');

test('Debug Image Upload Only', async ({ page }) => {
  console.log('🔍 Testing image upload only...');
  
  // Login
  await page.goto('https://adventcircle.com/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
  await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(3000);
  console.log('✅ Login completed');

  // Create post
  await page.getByText('Share your thoughts, prayers').click();
  await page.getByRole('textbox', { name: 'Share your thoughts, prayers' }).fill('Test image upload');
  console.log('✅ Post creation started');

  // Take screenshot before image upload
  await page.screenshot({ path: 'debug-before-image.png' });

  // Try different image upload approaches
  console.log('🔍 Trying different image upload methods...');
  
  try {
    // Method 1: Original approach
    console.log('Method 1: Original selector');
    const imageButton1 = page.getByLabel('Create post').getByRole('button', { name: 'Image' });
    await imageButton1.waitFor({ state: 'visible', timeout: 3000 });
    await imageButton1.setInputFiles('tests/test-data/1.png');
    console.log('✅ Method 1 worked');
  } catch (error) {
    console.log('❌ Method 1 failed:', error.message);
    
    try {
      // Method 2: Simple button selector
      console.log('Method 2: Simple button selector');
      const imageButton2 = page.locator('button:has-text("Image")').first();
      await imageButton2.waitFor({ state: 'visible', timeout: 3000 });
      await imageButton2.setInputFiles('tests/test-data/1.png');
      console.log('✅ Method 2 worked');
    } catch (error2) {
      console.log('❌ Method 2 failed:', error2.message);
      
      try {
        // Method 3: File input directly
        console.log('Method 3: Direct file input');
        const fileInput = page.locator('input[type="file"]').first();
        await fileInput.setInputFiles('tests/test-data/1.png');
        console.log('✅ Method 3 worked');
      } catch (error3) {
        console.log('❌ Method 3 failed:', error3.message);
        
        // Method 4: Check what buttons are available
        console.log('Method 4: Debug available buttons');
        const allButtons = await page.locator('button').all();
        console.log(`Found ${allButtons.length} buttons`);
        
        for (let i = 0; i < Math.min(allButtons.length, 10); i++) {
          const buttonText = await allButtons[i].textContent();
          const isVisible = await allButtons[i].isVisible();
          console.log(`Button ${i}: "${buttonText}", visible: ${isVisible}`);
        }
        
        throw new Error('All image upload methods failed');
      }
    }
  }
  
  console.log('🎉 Image upload test completed');
});
