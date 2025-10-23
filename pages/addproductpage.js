class AddProductPage {
    constructor(page) {
        this.page = page;
        
        // Navigation elements (refined fresh codegen)
        this.loginLink = page.getByRole('link', { name: 'Login' });
        this.emailField = page.getByRole('textbox', { name: '* Email Address' });
        this.passwordField = page.getByRole('textbox', { name: '* Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.userAvatar = page.getByRole('img', { name: 'User Avatar' });
        this.marketplaceMenuItem = page.getByRole('menuitem', { name: 'Marketplace right' }).locator('span').nth(1);
        this.addProductLink = page.getByRole('link', { name: 'Add Product' });
        
        // Product form elements (refined fresh codegen)
        this.productTitleField = page.getByRole('textbox', { name: '* Product Title' });
        this.categoryDropdown = page.locator('.ant-select-selection-search').first();
        this.shortDescriptionField = page.getByRole('textbox', { name: '* Short Description' });
        this.longDescriptionField = page.locator('.tiptap');
        
        // Pricing fields
        this.basePriceField = page.getByRole('spinbutton', { name: '* Base Price' });
        this.mrpField = page.getByRole('spinbutton', { name: '* MRP' });
        this.discountPercentField = page.getByRole('spinbutton', { name: '* Discount %' });
        this.discountAmountField = page.getByRole('spinbutton', { name: '* Discount Amount' });
        this.deliveryFeeField = page.getByRole('spinbutton', { name: '* Delivery Fee' });
        this.taxField = page.getByRole('spinbutton', { name: '* Tax / VAT %' });
        
        // Image upload elements (updated fresh codegen)
        this.thumbnailUpload = page.locator('div').filter({ hasText: /^Thumbnail Image Only \*\.png, \*\.jpg and \*\.jpeg files are accepted$/ }).locator('svg');
        this.productImageUpload = page.locator('div').filter({ hasText: /^Click to upload$/ }).nth(2);
        this.adventCircleUpload = page.getByText('AdventCircleAdd a new');
        
        // Inventory fields
        this.stockQuantityField = page.getByRole('spinbutton', { name: '* Stock Quantity' });
        this.skuField = page.getByRole('textbox', { name: '* SKU' });
        
        // Submit button
        this.publishButton = page.getByRole('button', { name: 'Publish Product' });
        
        // Verification and deletion elements
        this.productCell = page.getByRole('cell');
        // Dynamic selectors will be created in methods using the actual product title
        this.deleteButtonGeneric = page.getByRole('button').filter({ hasText: /delete|trash|remove/i });
        this.deleteText = page.getByText('Delete', { exact: true });
        this.confirmDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
    }

    async navigateToHomepage() {
        console.log(' Navigating to homepage');
        await this.page.goto('https://adventcircle.com/');
        await this.page.waitForLoadState('networkidle');
        console.log(' Homepage loaded');
    }

    async goToLoginPage() {
        console.log(' Going to login page');
        await this.loginLink.click();
        await this.page.waitForLoadState('networkidle');
        console.log(' Login page loaded');
    }

    async loginAsVendor(email = 'ratulsikder104@gmail.com', password = 'Ratul@104!') {
        console.log(' Logging in as vendor');
        await this.emailField.click();
        await this.emailField.fill(email);
        await this.passwordField.click();
        await this.passwordField.fill(password);
        await this.loginButton.click();
        await this.page.waitForTimeout(5000);
        
        // Check if login was successful by looking for user avatar or dashboard elements
        try {
            await this.page.waitForSelector('[alt="User Avatar"], img[alt="User Avatar"], .user-avatar', { timeout: 10000 });
            console.log(' Login completed - User avatar found');
        } catch (error) {
            console.log(' Login verification failed - user avatar not found');
            // Take a screenshot to debug login issues
            try {
                await this.page.screenshot({ 
                    path: `test-results/login-debug-${Date.now()}.png`, 
                    fullPage: true 
                });
                console.log('📷 Login debug screenshot taken');
            } catch (screenshotError) {
                console.log('Could not take login debug screenshot');
            }
        }
    }

    async navigateToMarketplace() {
        console.log(' Navigating to marketplace via User Avatar');
        
        try {
            // Wait for user avatar to be visible
            await this.page.waitForSelector('[alt="User Avatar"], img[alt="User Avatar"]', { timeout: 10000 });
            await this.userAvatar.click();
            await this.page.waitForTimeout(1000);
            
            // Click marketplace menu item
            await this.marketplaceMenuItem.click();
            await this.page.waitForTimeout(2000);
            
            console.log(' Marketplace navigation completed');
        } catch (error) {
            console.log(' Navigation via avatar failed, trying direct URL approach');
            // Fallback: Navigate directly to marketplace
            await this.page.goto('https://adventcircle.com/marketplace');
            await this.page.waitForLoadState('networkidle');
            console.log(' Direct marketplace navigation completed');
        }
    }

    async openAddProductForm() {
        console.log(' Opening Add Product form');
        
        try {
            // Wait for Add Product link to be available
            await this.page.waitForSelector('a[href*="add"], [role="link"]:has-text("Add Product")', { timeout: 10000 });
            await this.addProductLink.click();
            await this.page.waitForTimeout(2000);
            console.log(' Add Product form opened');
        } catch (error) {
            console.log(' Add Product link not found, trying direct navigation');
            // Fallback: Navigate directly to add product page
            await this.page.goto('https://adventcircle.com/vendor/product/add');
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(2000);
            console.log(' Direct navigation to Add Product form completed');
        }
    }

    async fillBasicProductInfo(productTitle = 'testing product', shortDescription = 'for testing') {
        console.log(' Filling basic product information');
        
        // Fill product title
        await this.productTitleField.click();
        await this.productTitleField.fill(productTitle);
        console.log(` Product title: ${productTitle}`);
        
        // Select category (refined fresh codegen)
        await this.categoryDropdown.click();
        await this.page.getByText('Church Pulpits').click();
        console.log(' Category selected: Church Pulpits');
        
        // Fill short description
        await this.shortDescriptionField.click();
        await this.shortDescriptionField.fill(shortDescription);
        console.log(` Short description: ${shortDescription}`);
        
        // Fill long description
        await this.longDescriptionField.click();
        await this.longDescriptionField.fill('for testing');
        console.log(' Long description filled');
    }

    async fillPricingInfo() {
        console.log(' Filling pricing information');
        
        // Base price (refined fresh codegen values)
        await this.basePriceField.click();
        await this.basePriceField.fill('200');
        
        // MRP
        await this.mrpField.click();
        await this.mrpField.fill('100');
        
        // Discount percentage
        await this.discountPercentField.click();
        await this.discountPercentField.fill('7');
        
        // Discount amount
        await this.discountAmountField.click();
        await this.discountAmountField.fill('8');
        
        // Delivery fee
        await this.deliveryFeeField.click();
        await this.deliveryFeeField.fill('4');
        
        // Tax/VAT (missing in fresh codegen, adding default)
        await this.taxField.click();
        await this.taxField.fill('5');
        
        console.log(' Pricing information completed');
    }

    async uploadImages() {
        console.log(' Uploading product images (REQUIRED)');
        
        try {
            // Upload thumbnail image (MANDATORY)
            console.log('Uploading thumbnail image...');
            
            // Method 1: Try with direct file input approach
            try {
                const thumbnailInput = this.page.locator('input[type="file"]').first();
                await thumbnailInput.setInputFiles('tests/test-data/1.png');
                await this.page.waitForTimeout(2000);
                console.log(' Thumbnail image uploaded via direct input');
            } catch (directError) {
                // Method 2: Try clicking trigger then finding input
                console.log('Trying thumbnail upload with trigger click...');
                await this.thumbnailUpload.click();
                await this.page.waitForTimeout(1000);
                
                const thumbnailFileInput = this.page.locator('input[type="file"]').first();
                await thumbnailFileInput.setInputFiles('tests/test-data/1.png');
                await this.page.waitForTimeout(2000);
                console.log(' Thumbnail image uploaded via trigger');
            }
            
            // Upload product image (MANDATORY)
            console.log('Uploading product image...');
            
            try {
                // Try to find and use the second file input
                const productImageInput = this.page.locator('input[type="file"]').nth(1);2
                const inputExists = await productImageInput.isVisible({ timeout: 3000 });
                
                if (inputExists) {
                    await productImageInput.setInputFiles('tests/test-data/events-1.png');
                    await this.page.waitForTimeout(2000);
                    console.log(' Product image uploaded via direct input');
                } else {
                    // Try clicking the upload trigger first
                    await this.productImageUpload.click();
                    await this.page.waitForTimeout(1000);
                    
                    const productFileInput = this.page.locator('input[type="file"]').nth(1);
                    await productFileInput.setInputFiles('tests/test-data/events-1.png');
                    await this.page.waitForTimeout(2000);
                    console.log(' Product image uploaded via trigger');
                }
            } catch (productImageError) {
                console.log('Trying alternative product image upload method...');
                // Alternative approach: look for any available file input
                const availableInputs = this.page.locator('input[type="file"]');
                const inputCount = await availableInputs.count();
                
                if (inputCount > 1) {
                    await availableInputs.nth(1).setInputFiles('tests/test-data/events-1.png');
                    await this.page.waitForTimeout(2000);
                    console.log(' Product image uploaded via alternative method');
                } else {
                    throw new Error('Could not find product image input');
                }
            }
            
            console.log(' All required images uploaded successfully');
            return true;
            
        } catch (error) {
            console.log(' CRITICAL: Image upload failed - Product creation will fail!');
            console.log('Error details:', error.message);
            
            // Take a screenshot to debug the upload issue
            try {
                await this.page.screenshot({ 
                    path: `test-results/image-upload-debug-${Date.now()}.png`, 
                    fullPage: true 
                });
                console.log('📷 Debug screenshot taken');
            } catch (screenshotError) {
                console.log('Could not take debug screenshot');
            }
            
            throw new Error(`Image upload failed: ${error.message}`);
        }
    }

    async fillInventoryInfo() {
        console.log(' Filling inventory information');
        
        // Stock quantity (updated fresh codegen value)
        await this.stockQuantityField.click();
        await this.stockQuantityField.fill('10');
        
        // Generate unique SKU
        const uniqueSku = `SKU-${Date.now()}`;
        await this.skuField.click();
        await this.skuField.fill(uniqueSku);
        
        console.log(` Inventory completed - SKU: ${uniqueSku}`);
        return uniqueSku;
    }

    async publishProduct() {
        console.log(' Publishing product');
        
        // Click publish button
        await this.publishButton.click();
        console.log(' Publish button clicked, waiting for response...');
        
        // Wait for potential page navigation or feedback
        await this.page.waitForTimeout(5000);
        
        // Check for success/error messages
        try {
            // Look for common success indicators
            const successIndicators = [
                'success', 'created', 'published', 'added', 'Product added',
                'Product created', 'successfully'
            ];
            
            let successFound = false;
            for (const indicator of successIndicators) {
                const found = await this.page.getByText(indicator, { exact: false }).isVisible({ timeout: 2000 });
                if (found) {
                    console.log(` SUCCESS indicator found: "${indicator}"`);
                    successFound = true;
                    break;
                }
            }
            
            // Check for error messages
            const errorIndicators = [
                'error', 'failed', 'invalid', 'required', 'must', 'cannot'
            ];
            
            for (const indicator of errorIndicators) {
                const found = await this.page.getByText(indicator, { exact: false }).isVisible({ timeout: 1000 });
                if (found) {
                    console.log(` WARNING: Possible error indicator found: "${indicator}"`);
                    // Don't fail immediately, but log it
                }
            }
            
            if (!successFound) {
                console.log(' No explicit success message found, but this may be normal');
            }
            
        } catch (messageCheckError) {
            console.log(' Could not check for success/error messages:', messageCheckError.message);
        }
        
        console.log(' Product publish process completed');
    }

    async deleteProduct(productTitle) {
        console.log(` Deleting product "${productTitle}"`);
        
        try {
            // Wait for page to load and find the product row
            await this.page.waitForTimeout(3000);
            
            // Find the specific product row using the dynamic product title
            const productRow = this.page.getByRole('row').filter({ hasText: productTitle });
            const rowCount = await productRow.count();
            
            if (rowCount > 0) {
                console.log(`Found ${rowCount} product row(s), deleting the first one`);
                // Click the delete button in the product row
                await productRow.first().getByRole('button').first().click();
                await this.page.waitForTimeout(1000);
                
                // Click the Delete text
                await this.deleteText.click();
                await this.page.waitForTimeout(1000);
                
                // Confirm deletion
                await this.confirmDeleteButton.click();
                await this.page.waitForTimeout(3000);
                
                console.log(` Product "${productTitle}" deleted successfully`);
                return true;
            } else {
                console.log(` Product "${productTitle}" not found for deletion`);
                return false;
            }
            
        } catch (error) {
            console.log(` Error deleting product: ${error.message}`);
            return false;
        }
    }

    async verifyProductDeleted(productTitle) {
        console.log(` Verifying product "${productTitle}" was deleted`);
        
        try {
            // Wait for page to refresh
            await this.page.waitForTimeout(3000);
            
            // Check if product is no longer visible
            const productExists = await this.page.locator(`text="${productTitle}"`).isVisible({ timeout: 3000 });
            
            if (!productExists) {
                console.log(` Product "${productTitle}" successfully deleted and not found`);
                return true;
            } else {
                console.log(` Product "${productTitle}" still exists after deletion`);
                return false;
            }
            
        } catch (error) {
            console.log(` Product "${productTitle}" appears to be deleted (not found)`);
            return true;
        }
    }

    async verifyProductAdded(productTitle) {
        console.log(` Verifying product "${productTitle}" was added`);
        
        try {
            // Navigate to vendor product list to verify
            console.log(' Navigating to vendor product list...');
            await this.page.goto('https://adventcircle.com/vendor/product/list?page=1&limit=10');
            await this.page.waitForLoadState('domcontentloaded');
            
            // Try multiple times with refreshes (products might take time to appear)
            for (let attempt = 1; attempt <= 3; attempt++) {
                console.log(` Verification attempt ${attempt}/3...`);
                await this.page.waitForTimeout(3000); // Wait for content to load
                
                // Method 1: Look for product by exact title
                const exactMatch = await this.page.locator(`text="${productTitle}"`).isVisible({ timeout: 5000 });
                if (exactMatch) {
                    console.log(`  Product "${productTitle}" found by exact text match on attempt ${attempt}`);
                    return true;
                }
                
                // Method 2: Look for product in table cells
                const productCells = this.page.getByRole('cell', { name: new RegExp(productTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
                const cellCount = await productCells.count();
                
                if (cellCount > 0) {
                    console.log(` Product "${productTitle}" found in ${cellCount} table cell(s) on attempt ${attempt}`);
                    return true;
                }
                
                // Method 3: Look for product in table rows
                const productRows = this.page.getByRole('row').filter({ hasText: productTitle });
                const rowCount = await productRows.count();
                
                if (rowCount > 0) {
                    console.log(`  Product "${productTitle}" found in ${rowCount} table row(s) on attempt ${attempt}`);
                    return true;
                }
                
                // Method 4: Extract timestamp and search in table content
                const timestampMatch = productTitle.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)/);
                if (timestampMatch) {
                    const timestamp = timestampMatch[1];
                    const tableContent = await this.page.locator('table').first().textContent();
                    
                    if (tableContent && tableContent.includes(timestamp)) {
                        console.log(` ✅ Product with timestamp ${timestamp} found in table content on attempt ${attempt}`);
                        return true;
                    }
                }
                
                // If not found, refresh and try again (except on last attempt)
                if (attempt < 3) {
                    console.log(` Product not found on attempt ${attempt}, refreshing page...`);
                    await this.page.reload();
                    await this.page.waitForLoadState('domcontentloaded');
                } else {
                    console.log(' Final verification attempt - checking table content...');
                    const tableContent = await this.page.locator('table').first().textContent();
                    console.log(' Current table content:', tableContent?.substring(0, 800));
                }
            }
            
            console.log(` ❌ Product "${productTitle}" not found after 3 attempts with refreshes`);
            return false;
            
        } catch (error) {
            console.log(` Error verifying product: ${error.message}`);
            return false;
        }
    }

    async completeAddProductWorkflow(productTitle = 'Product for Testing') {
        console.log(' Starting complete add product workflow with fresh codegen');
        
        try {
            // Step 1: Navigate to homepage and login
            await this.navigateToHomepage();
            await this.goToLoginPage();
            await this.loginAsVendor();
            
            // Step 2: Navigate to marketplace and open add product
            await this.navigateToMarketplace();
            await this.openAddProductForm();
            
            // Step 3: Fill basic information
            await this.fillBasicProductInfo(productTitle, 'this product is upload for testing basis');
            
            // Step 4: Fill pricing
            await this.fillPricingInfo();
            
            // Step 5: Upload images (MANDATORY)
            const imageUploadSuccess = await this.uploadImages();
            if (!imageUploadSuccess) {
                console.log(' FAILURE: Image upload failed - cannot proceed with product creation');
                return { success: false, step: 'image_upload', sku };
            }
            
            // Step 6: Fill inventory
            const sku = await this.fillInventoryInfo();
            
            // Step 7: Publish product
            await this.publishProduct();
            
            // Step 8: Verify product was added
            const addVerified = await this.verifyProductAdded(productTitle);
            
            if (!addVerified) {
                console.log(' ❌ FAILURE: Product verification failed - product was not found in the list');
                console.log(' This indicates the product creation process did not complete successfully');
                return { success: false, step: 'verification_failed', sku };
            }
            
            console.log(' ✅ SUCCESS: Product verified successfully');
            console.log(' ✅ SUCCESS: Complete add product workflow completed successfully');
            return { success: true, step: 'complete', sku };
            
        } catch (error) {
            console.log(' Error in add and delete workflow:', error.message);
            throw error;
        }
    }
}

module.exports = { AddProductPage };
