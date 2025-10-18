class ServiceAddPage {
    constructor(page) {
        this.page = page;
        
        // Navigation elements - 
        this.userAvatar = page.getByRole('img', { name: 'User Avatar' });
        this.marketplaceText = page.getByText('Marketplace').nth(2);
        this.marketplaceMenuItem = page.getByRole('menuitem', { name: 'Marketplace right' }).locator('svg').nth(1);
        this.addServiceLink = page.getByRole('link', { name: 'Add Service' });
        
        // Form elements
        this.serviceTitleInput = page.getByRole('textbox', { name: '* Service Title' });
        this.serviceCategoryDropdown = page.getByRole('combobox', { name: '* Service Category' });
        this.shortDescriptionInput = page.getByRole('textbox', { name: '* Short Description' });
        this.descriptionEditor = page.locator('.tiptap');
        this.basePriceInput = page.getByRole('spinbutton', { name: '* Base Price' });
        this.discountInput = page.getByRole('spinbutton', { name: '* Discount %' });
        this.maxDiscountInput = page.getByRole('spinbutton', { name: '* Max Discount Amount' });
            this.taxInput = page.getByRole('spinbutton', { name: '* Tax' });
        this.chargeTypeDropdown = page.getByRole('combobox', { name: '* Charge Type' });
        
        // Key features
        this.keyFeature1Input = page.getByRole('textbox', { name: '* Key Feature 1' });
        this.keyFeature2Input = page.getByRole('textbox', { name: '* Key Feature 2' });
        this.keyFeature3Input = page.getByRole('textbox', { name: '* Key Feature 3' });
        
        // Image upload elements - more specific selectors
        this.thumbnailUpload = page.locator('div').filter({ hasText: /^Thumbnail Image Only \*\.png, \*\.jpg and \*\.jpeg files are accepted$/ });
        this.thumbnailUploadAlt = page.getByText('Only *.png, *.jpg and *.jpeg').first();
        this.serviceImageUpload = page.locator('div').filter({ hasText: /^Only \*\.png, \*\.jpg and \*\.jpeg files are accepted$/ }).nth(1);
        
        // Action buttons
        this.publishServiceButton = page.getByRole('button', { name: 'Publish Service' });
        
        // Verification elements
        this.serviceListCell = page.getByRole('cell', { name: 'Service for Testing Service' });
    }

    async verifyServiceAdded(uniqueTitle) {
        console.log(' Verifying service was added...');
        try {
            await this.page.waitForTimeout(2000);
            // Navigate to service list to verify
            console.log(' Navigating to service list...');
            await this.page.goto('https://adventcircle.com/vendor/service/list?page=1&limit=10');
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(2000);
            // Look for the unique service title
            console.log(` Searching for "${uniqueTitle}" in the list...`);
            const serviceSelector = `text="${uniqueTitle}"`;
            const element = this.page.locator(serviceSelector);
            const found = await element.isVisible({ timeout: 4000 });
            if (found) {
                console.log(` Service found using selector: ${serviceSelector}`);
                return true;
            } else {
                // Log all table content for debugging
                const tableContent = await this.page.locator('table, .ant-table').textContent();
                console.log(' Current table content:', tableContent?.substring(0, 500));
                const serviceCells = await this.page.locator('[role="cell"], td').allTextContents();
                console.log(' All table cells:', serviceCells.slice(0, 10));
                return false;
            }
        } catch (error) {
            console.log(' Error verifying service:', error.message);
            return false;
        }
    }

    async navigateToAddService() {
        console.log(' Navigating to marketplace...');
        
        // Updated navigation based on latest fresh codegen
        // Click user avatar once to open menu
        await this.userAvatar.click();
        await this.page.waitForTimeout(1000);
        
        // Click marketplace text
        await this.marketplaceText.click();
        await this.page.waitForTimeout(500);
        
        // Click marketplace menuitem svg
        await this.marketplaceMenuItem.click();
        await this.page.waitForTimeout(500);
        
        // Click add service link
        await this.addServiceLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        console.log(' Navigated to Add Service page');
    }

    async fillServiceTitle(title) {
        console.log(` Filling service title: ${title}`);
        await this.serviceTitleInput.click();
        await this.serviceTitleInput.fill(title);
    }

    async selectServiceCategory(category) {
        console.log(` Selecting service category: ${category}`);
        await this.serviceCategoryDropdown.click();
        await this.page.getByText(category).dblclick();
        await this.page.getByRole('main').getByTitle(category).click();
    }

    async fillShortDescription(description) {
        console.log(` Filling short description: ${description}`);
        await this.shortDescriptionInput.click();
        await this.shortDescriptionInput.fill(description);
    }

    async fillDetailedDescription(description) {
        console.log(` Filling detailed description: ${description}`);
        await this.page.locator('.flex > button:nth-child(3)').click();
        await this.page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
        await this.descriptionEditor.fill(description);
        await this.page.locator('.ant-btn.css-s3wiz3.ant-btn-primary.ant-btn-color-primary.ant-btn-variant-solid.ant-btn-sm').click();
    }

    async fillPricingDetails({ basePrice, discount, maxDiscount, tax }) {
        console.log(' Filling pricing details...');
        
        await this.basePriceInput.click();
        await this.basePriceInput.fill(basePrice.toString());
        
        await this.discountInput.click();
        await this.discountInput.fill(discount.toString());
        
        await this.maxDiscountInput.click();
        await this.maxDiscountInput.fill(maxDiscount.toString());
        
        await this.taxInput.click();
        await this.taxInput.fill(tax.toString());
    }

    async selectChargeType(chargeType) {
        console.log(` Selecting charge type: ${chargeType}`);
        await this.chargeTypeDropdown.click();
        await this.page.getByText(chargeType, { exact: true }).click();
    }

    async fillKeyFeatures({ feature1, feature2, feature3 }) {
        console.log(' Filling key features...');
        
        await this.keyFeature1Input.click();
        await this.keyFeature1Input.fill(feature1);
        
        if (feature2) {
            await this.keyFeature2Input.click();
            await this.keyFeature2Input.fill(feature2);
        }
        
        if (feature3) {
            await this.keyFeature3Input.click();
            await this.keyFeature3Input.fill(feature3);
        }
    }

    async uploadImages({ thumbnailImage, serviceImage }) {
        console.log(' Uploading images...');
        try {
            // --- THUMBNAIL UPLOAD (improved method) ---
            console.log(' Uploading thumbnail image...');
            
            // Method 1: Click the thumbnail upload area to activate file input
            await this.page.locator('div').filter({ hasText: /^Thumbnail Image Only \*\.png, \*\.jpg and \*\.jpeg files are accepted$/ }).locator('svg').click();
            await this.page.waitForTimeout(1000);
            
            // Find the file input that appears after clicking
            const fileInputs = await this.page.locator('input[type="file"]').all();
            console.log(` Found ${fileInputs.length} file inputs after clicking thumbnail area`);
            
            if (fileInputs.length > 0) {
                await fileInputs[0].setInputFiles(thumbnailImage);
                console.log('  Thumbnail uploaded successfully');
                await this.page.waitForTimeout(2000);
            } else {
                throw new Error('No file input found for thumbnail upload');
            }

            // --- SERVICE IMAGE UPLOAD ---
            console.log(' Uploading service image...');
            try {
                await this.serviceImageUpload.click();
                await this.page.waitForTimeout(1000);
                const updatedFileInputs = await this.page.locator('input[type="file"]').all();
                console.log(` Found ${updatedFileInputs.length} file inputs for service image`);
                
                if (updatedFileInputs.length > 1) {
                    await updatedFileInputs[1].setInputFiles(serviceImage);
                    console.log('  Service image uploaded via second file input');
                } else if (updatedFileInputs.length === 1) {
                    await updatedFileInputs[0].setInputFiles(serviceImage);
                    console.log('  Service image uploaded via first file input');
                }
                await this.page.waitForTimeout(2000);
            } catch (serviceImageError) {
                console.log('  Service image upload failed:', serviceImageError.message);
            }
            
            console.log('  Image upload process completed');
            return true;
            
        } catch (error) {
            console.log('  Overall image upload failed:', error.message);
            // Make the test fail if images can't be uploaded since they're required
            throw new Error(`Image upload failed: ${error.message}. Service cannot be created without images.`);
        }
    }

    async publishService() {
        console.log(' Publishing service...');
        
        // Check if publish button is enabled/clickable
        const isEnabled = await this.publishServiceButton.isEnabled();
        console.log(` Publish button enabled: ${isEnabled}`);
        
        if (isEnabled) {
            await this.publishServiceButton.click();
            await this.page.waitForTimeout(3000);
            
            // Check for success message or navigation
            try {
                await this.page.waitForSelector('.ant-message-success, [role="alert"], .success-message', { timeout: 5000 });
                console.log(' Success message detected');
            } catch (error) {
                console.log(' No success message detected');
            }
            
            // Check if we're redirected to service list
            const currentUrl = this.page.url();
            console.log(` Current URL after publish: ${currentUrl}`);
            
        } else {
            console.log(' Publish button is disabled - checking for missing required fields');
            
            // Check for validation errors
            const errorMessages = await this.page.locator('.ant-form-item-explain-error, .error-message, .field-error').allTextContents();
            if (errorMessages.length > 0) {
                console.log(' Validation errors found:', errorMessages);
            }
        }
    }

    async verifyServiceAdded(uniqueTitle) {
        console.log(' Verifying service was added...');
        try {
            await this.page.waitForTimeout(2000);
            // Navigate to service list to verify
            console.log(' Navigating to service list...');
            await this.page.goto('https://adventcircle.com/vendor/service/list?page=1&limit=10');
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(2000);
            // Look for the unique service title
            console.log(` Searching for "${uniqueTitle}" in the list...`);
            const serviceSelector = `text="${uniqueTitle}"`;
            const element = this.page.locator(serviceSelector);
            const found = await element.isVisible({ timeout: 4000 });
            if (found) {
                console.log(` Service found using selector: ${serviceSelector}`);
                return true;
            } else {
                // Log all table content for debugging
                const tableContent = await this.page.locator('table, .ant-table').textContent();
                console.log(' Current table content:', tableContent?.substring(0, 500));
                const serviceCells = await this.page.locator('[role="cell"], td').allTextContents();
                console.log(' All table cells:', serviceCells.slice(0, 10));
                return false;
            }
        } catch (error) {
            console.log(' Error verifying service:', error.message);
            return false;
        }
    }
}

module.exports = { ServiceAddPage };