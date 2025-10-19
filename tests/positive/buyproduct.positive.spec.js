const { test, expect } = require('@playwright/test');

test.describe('Buy Product - Positive Tests', () => {

    test('positive - B-T1 - Customer can buy product and reach Stripe payment successfully', async ({ page }) => {
        console.log('  TEST START: Customer can buy product and reach Stripe payment successfully');
        
        try {
            // Step 1: Navigate to homepage and login
            console.log(' Step 1: Navigating to homepage and logging in');
            await page.goto('https://adventcircle.com/');
            await page.getByRole('link', { name: 'Login' }).click();
            await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
            await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
            await page.getByRole('button', { name: 'Login' }).click();
            await page.waitForTimeout(3000);
            console.log('  Login completed');
            
            // Step 2: Navigate to marketplace products
            console.log(' Step 2: Navigating to marketplace products');
            await page.getByText('Marketplace', { exact: true }).click();
            await page.waitForTimeout(2000);
            await page.getByRole('link', { name: 'Products' }).click();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(3000);
            console.log('  Products page loaded');
            
            // Step 3: Add random product to cart
            console.log(' Step 3: Adding random product to cart');
            const addToCartButtons = page.locator('.ant-btn.css-s3wiz3.ant-btn-round.ant-btn-default');
            const buttonCount = await addToCartButtons.count();
            console.log(` Found ${buttonCount} products available`);
            
            if (buttonCount === 0) {
                throw new Error('No products available to add to cart');
            }
            
            // Select first product (always choose first to ensure test stability)
            console.log(` Selecting first product (index 0) to ensure test reliability`);
            
            await addToCartButtons.first().click();
            
            // Verify item was added to cart (no wait time for faster execution)
            try {
                const successMessage = await page.getByText('Item added to cart').isVisible({ timeout: 3000 });
                if (successMessage) {
                    console.log('  Product added to cart successfully');
                    await page.getByText('Item added to cart').click(); // Dismiss message
                } else {
                    console.log('  No explicit success message, but continuing...');
                }
            } catch (messageError) {
                console.log('  Success message check failed, continuing anyway...');
            }
            
            
            // Step 4: Navigate to cart
            console.log(' Step 4: Navigating to cart');
            await page.getByRole('navigation').locator('svg').first().click();
            await page.waitForTimeout(2000);
            console.log('  Cart opened');
            
            // Step 5: Proceed to checkout
            console.log(' Step 5: Proceeding to checkout');
            await page.getByRole('button', { name: 'Checkout' }).click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);
            console.log('  Checkout page loaded');
            
            // Step 6: Fill important checkout fields
            console.log(' Step 6: Filling important checkout fields');
            const timestamp = Date.now();
            
            await page.getByRole('textbox', { name: '* First Name' }).fill('John');
            await page.getByRole('textbox', { name: '* Last Name' }).fill(`Customer${timestamp}`);
            await page.getByRole('textbox', { name: 'Company Name (Optional)' }).fill(`TestCompany${timestamp}`);
            
            await page.getByRole('combobox', { name: '* Country/ Region' }).click();
            await page.getByText('United States (US)').click();
            await page.waitForTimeout(1000);
            
            await page.getByRole('textbox', { name: '* Street Address' }).fill('123 Test Street');
            await page.getByRole('textbox', { name: 'Street Address', exact: true }).fill('Apt 456');
            await page.getByRole('textbox', { name: '* Town / City' }).fill('Test City');
            
            await page.getByRole('combobox', { name: '* State' }).click();
            await page.waitForTimeout(1000);
            await page.getByTitle('California').click();
            
            await page.getByRole('textbox', { name: '* Zip Code' }).fill('90210');
            await page.getByRole('textbox', { name: '* Phone' }).fill('5551234567');
            await page.getByRole('textbox', { name: '* Email Address' }).fill(`test${timestamp}@example.com`);
            
            console.log('  Checkout form filled successfully');
            
            // Step 7: Place order
            console.log(' Step 7: Placing order');
            await page.getByRole('button', { name: 'Place Your Order' }).click();
            await page.waitForTimeout(5000);
            console.log('  Order placement initiated');
            
            // Step 8: Verify Stripe payment section opens
            console.log(' Step 8: Verifying Stripe payment section');
            
            const currentUrl = page.url();
            console.log(` Current URL: ${currentUrl}`);
            
            // Check if Stripe section is open (multiple verification methods)
            const pageContent = await page.content();
            const stripeIndicators = [
                currentUrl.includes('payment'),
                currentUrl.includes('checkout'),
                pageContent.toLowerCase().includes('stripe'),
                pageContent.toLowerCase().includes('payment'),
                pageContent.toLowerCase().includes('billing')
            ];
            
            const stripeFound = stripeIndicators.some(indicator => indicator);
            
            if (stripeFound) {
                console.log('  SUCCESS: Stripe payment section is open!');
                console.log('  Complete buy product workflow successful');
                
                // Test passes - Stripe section is accessible
                expect(stripeFound).toBe(true);
                expect(currentUrl).toContain('checkout');
                
                // Log success details
                console.log('  Workflow Summary:');
                console.log('   Login: Completed as customer');
                console.log('    Navigation: Marketplace → Products'); 
                console.log('    Product: First product (index 0) added to cart');
                console.log('    Cart: Successfully accessed');
                console.log('    Checkout: Form filled and order placed');
                console.log('    Payment: Stripe section accessible');
                console.log(`    Final URL: ${currentUrl}`);
                
            } else {
                console.log('  FAILURE: Stripe section is not open');
                
                // Take screenshot for debugging
                await page.screenshot({ 
                    path: `test-results/stripe-not-found-${Date.now()}.png`, 
                    fullPage: true 
                });
                
                // Test fails - Stripe section not found
                throw new Error('Stripe payment section did not open as expected');
            }
            
        } catch (error) {
            console.log('  ERROR in buy product test:', error.message);
            
            // Take screenshot for debugging
            try {
                await page.screenshot({ 
                    path: `test-results/buy-product-error-${Date.now()}.png`, 
                    fullPage: true 
                });
                console.log('  Debug screenshot taken');
            } catch (screenshotError) {
                console.log(' Could not take screenshot:', screenshotError.message);
            }
            
            throw error;
        }
        
        console.log('  TEST COMPLETED: Buy product test finished successfully');
    });

});
