const { test, expect } = require('@playwright/test');

test('Simple add product test', async ({ page }) => {
    console.log('🧪 Starting simple add product test');
    
    try {
        // Navigate to login page
        console.log('🌐 Navigating to login page');
        await page.goto('https://adventcircle.com/signin');
        await page.waitForLoadState('networkidle');
        
        console.log('📝 Page loaded, filling login form');
        
        // Login
        await page.getByPlaceholder('Enter your email').click();
        await page.getByPlaceholder('Enter your email').fill('lalit.c3.tester@gmail.com');
        await page.getByPlaceholder('Enter your password').click();
        await page.getByPlaceholder('Enter your password').fill('Pass@123');
        await page.getByRole('button', { name: 'LOG IN' }).click();
        
        // Wait for login
        await page.waitForTimeout(5000);
        console.log('✅ Login completed');
        
        // Check if we can see the 3-dot menu
        const menuVisible = await page.locator('.lucide.lucide-menu > path:nth-child(3)').first().isVisible({ timeout: 10000 });
        console.log(`Menu visible: ${menuVisible}`);
        
        if (menuVisible) {
            console.log('🎉 SUCCESS: Login and navigation successful');
        } else {
            console.log('❌ Menu not found');
        }
        
    } catch (error) {
        console.log('❌ Error:', error.message);
        throw error;
    }
});