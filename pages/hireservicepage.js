class HireServicePage {
    constructor(page) {
        this.page = page;

        // Navigation elements
        this.marketplaceMenuItem = page.getByRole('menuitem', { name: 'Marketplace Icon Marketplace' });
        this.seeAllServicesLink = page.getByRole('link', { name: 'See All' }).nth(1);
        
        // Service elements
        this.hireNowButton = page.getByRole('button', { name: 'Hire now' }).first();
        
        // Contact form elements
        this.contactNumberField = page.getByRole('textbox', { name: '* Contact Number' });
        this.slotTimePicker = page.locator('.ant-picker');
        this.workOverviewField = page.getByRole('textbox', { name: '* Work overview' });
        this.bookNowButton = page.getByRole('button', { name: 'Book Now' });
        
        // Date picker elements
        this.dateCell15 = page.getByRole('cell', { name: '15' }).locator('div');
        this.timeOption04 = page.getByText('04').first();
        this.okButton = page.getByRole('button', { name: 'OK', exact: true });
        
        // Location permission elements
        this.allowLocationButton = page.getByRole('button', { name: 'Allow' });
        this.locationPermissionDialog = page.locator('text=/location|allow|permission/i');
        
        // Stripe verification
        this.stripeFrame = page.frameLocator('iframe[src*="stripe"]');
    }

    async handleLocationPermission() {
        console.log(' Checking for location permission prompt');
        
        try {
            // Wait for potential location permission dialog
            const locationPromptVisible = await this.locationPermissionDialog.isVisible({ timeout: 3000 });
            
            if (locationPromptVisible) {
                console.log(' Location permission prompt detected - clicking Allow');
                await this.allowLocationButton.click();
                await this.page.waitForTimeout(1000);
                console.log(' Location permission granted');
                return true;
            }
            
            // Check for browser's native location permission dialog
            const allowButton = await this.allowLocationButton.isVisible({ timeout: 2000 });
            if (allowButton) {
                console.log(' Browser location prompt detected - clicking Allow');
                await this.allowLocationButton.click();
                await this.page.waitForTimeout(1000);
                console.log(' Browser location permission granted');
                return true;
            }
            
            console.log(' No location permission prompt detected');
            return false;
            
        } catch (error) {
            console.log(' Error handling location permission:', error.message);
            return false;
        }
    }

    async navigateToAllServices() {
        console.log(' Navigating to Services via Marketplace');
        await this.marketplaceMenuItem.click();
        await this.page.waitForTimeout(1000);
        await this.seeAllServicesLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        console.log(' Navigated to services page');
    }

    async clickHireNowButton() {
        console.log(' Clicking Hire Now button (first service)');
        await this.hireNowButton.click();
        await this.page.waitForTimeout(1500);
        console.log(' Hire Now button clicked');
    }

    async fillContactForm(contactNumber = '+8801956438976', workOverview = 'for automation testing') {
        console.log(' Filling contact form');
        
        // Fill contact number
        await this.contactNumberField.click();
        await this.contactNumberField.fill(contactNumber);
        console.log(` Contact number filled: ${contactNumber}`);
        
        // Select slot time using ant-picker with improved logic
        console.log(' Starting date and time selection');
        await this.slotTimePicker.click();
        await this.page.waitForTimeout(2000); // Wait for date picker to fully open
        
        console.log(' Selecting date: 15th');
        await this.dateCell15.click();
        await this.page.waitForTimeout(1000);
        
        console.log(' Selecting time: 04:00');
        await this.timeOption04.click();
        await this.page.waitForTimeout(1000);
        
        console.log(' Confirming date/time selection');
        await this.okButton.click();
        await this.page.waitForTimeout(2000); // Wait for picker to close
        console.log(' Slot time selected (15th, 04:00)');
        
        // Fill work overview
        await this.workOverviewField.click();
        await this.workOverviewField.fill(workOverview);
        console.log(` Work overview filled: ${workOverview}`);
        
        // Click Book Now
        await this.bookNowButton.click();
        await this.page.waitForTimeout(2000);
        console.log(' Book Now button clicked');
        
        // Handle location permission prompt that may appear after booking
        await this.handleLocationPermission();
        
        // Wait a bit more for any processing
        await this.page.waitForTimeout(1000);
    }

    async fillSecondContactForm(phoneNumber = '+8801923895432', briefOverview = 'for testing purposse') {
        console.log(' Filling second contact form - NOT USED IN NEW WORKFLOW');
        // This method is kept for backwards compatibility but not used in the simplified workflow
        console.log(' This method is deprecated - new workflow only uses one service booking');
    }

    async verifyStripeWindow() {
        console.log(' Verifying Stripe window appearance');
        
        try {
            // Check for Stripe iframe
            const stripeFrameVisible = await this.page.locator('iframe[src*="stripe"]').isVisible({ timeout: 10000 });
            
            if (stripeFrameVisible) {
                console.log(' SUCCESS: Stripe window detected');
                return true;
            }
            
            // Alternative check for Stripe elements
            const stripeElements = await this.page.locator('div[class*="stripe"], div[id*="stripe"], iframe[name*="stripe"]').count();
            
            if (stripeElements > 0) {
                console.log(' SUCCESS: Stripe elements detected');
                return true;
            }
            
            // Check for payment-related text
            const paymentText = await this.page.locator('text=/payment|checkout|card|billing/i').isVisible({ timeout: 5000 });
            
            if (paymentText) {
                console.log(' SUCCESS: Payment-related content detected');
                return true;
            }
            
            console.log(' No Stripe window or payment elements found');
            return false;
            
        } catch (error) {
            console.log(' Error during Stripe verification:', error.message);
            return false;
        }
    }

    async completeHireServiceWorkflow() {
        console.log(' Starting complete hire service workflow');
        
        try {
            // Step 1: Navigate to services via marketplace
            await this.navigateToAllServices();
            
            // Step 2: Click hire now for first service
            await this.clickHireNowButton();
            
            // Step 3: Fill contact form
            await this.fillContactForm();
            
            // Step 4: Verify Stripe window
            const stripeSuccess = await this.verifyStripeWindow();
            
            if (stripeSuccess) {
                console.log(' SUCCESS: Hire service workflow completed successfully');
                return true;
            } else {
                console.log(' Workflow completed but Stripe verification failed');
                return false;
            }
            
        } catch (error) {
            console.log(' Error in hire service workflow:', error.message);
            throw error;
        }
    }
}

module.exports = { HireServicePage };