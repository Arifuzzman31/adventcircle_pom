const { test, expect } = require('@playwright/test');
const { AddProductPage } = require('../../pages/addproductpage');

test.describe('Add Product - Positive Tests', () => {

    test('positive - P-T1 - Vendor can add product successfully using page object', async ({ page }) => {
        console.log(' TEST START: Vendor can add product successfully using page object');
        
        // Initialize page object
        const addProductPage = new AddProductPage(page);
        
        try {
            // Generate unique product data with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const uniqueProductTitle = `Product for Testing ${timestamp}`;
            console.log(' Testing with product: ' + uniqueProductTitle);
            
            // Execute complete add product workflow using page object
            const result = await addProductPage.completeAddProductWorkflow(uniqueProductTitle);
            
            // Verify the workflow was successful (result should have success: true)
            expect(result.success).toBe(true);
            expect(result.sku).toBeDefined();
            
            console.log(' SUCCESS: Product added successfully with images!');
            console.log(' Product Details:');
            console.log('   - Title: ' + uniqueProductTitle);
            console.log('   - SKU: ' + result.sku);
            console.log('   - Category: Church Pulpits');
            console.log('   - Base Price: $200 (MRP: $100)');
            console.log('   - Stock: 10 units');
            console.log('   - Images: Thumbnail + Product Image Uploaded');
            console.log('   - Status: Product Creation Successful');
            
        } catch (error) {
            console.log(' Test failed with error:', error.message);
            
            // Take screenshot for debugging
            try {
                await page.screenshot({ 
                    path: 'test-results/addproduct-delete-pageobject-failure-' + Date.now() + '.png', 
                    fullPage: true 
                });
            } catch (screenshotError) {
                console.log(' Could not take screenshot:', screenshotError.message);
            }
            
            throw error;
        }

        console.log('  TEST COMPLETED: Add product test with page object finished');
    });

});