class HireNowPage {
    constructor(page) {
        this.page = page;

        // Navigation elements
        this.marketplaceText = page.getByText('Marketplace', { exact: true });
        this.servicesLink = page.getByRole('link', { name: 'Services' });
        this.firstServiceLink = page.locator('a').filter({ hasText: /Total Care Cleaning|Service|Combo/ }).first();

        // Service elements
        this.hireNowButton = page.getByRole('button', { name: 'Hire now' }).first();
        
        // Address elements
        this.addressField = page.getByRole('textbox', { name: 'Enter your full address' });
        this.broadwayAddress = page.getByText('BroadwayNew York, NY 11211, USA');
        
        // Contact form elements
        this.contactNumberField = page.getByRole('textbox', { name: '* Contact Number' });
        this.workOverviewField = page.getByRole('textbox', { name: '* Work overview' });
        this.bookNowButton = page.getByRole('button', { name: 'Book Now' });

        // Date picker elements
        this.slotTimePicker = page.locator('.ant-picker');
        this.slotTimeField = page.getByRole('textbox', { name: '* Slot Time' });
        this.okButton = page.getByRole('button', { name: 'OK', exact: true });
        
        // Date cells
        this.dateCell22 = page.getByRole('cell', { name: '22' }).locator('div');
        this.dateCell24 = page.getByRole('cell', { name: '24' }).locator('div');
        
        // Time elements
        this.time14 = page.getByText('14').nth(1);
        this.time17 = page.getByText('17').nth(1);
        this.time10 = page.getByText('10').nth(3);

        // Verification elements
        this.serviceTableElement = page.locator('.ant-table-cell > .flex').first();
        this.successMessage = page.locator('text=/success|booked|confirmed|scheduled/i');
    }

    async navigateToServices() {
        console.log(' Navigating to Marketplace > Services');
        await this.marketplaceText.click();
        await this.page.waitForTimeout(1000);
        await this.servicesLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        console.log(' Navigated to Services page');
    }

    async selectFirstService() {
        console.log(' Selecting first service for hire');
        await this.firstServiceLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        console.log(' First service selected');
    }

    async clickHireNow() {
        console.log(' Clicking Hire Now button');
        await this.hireNowButton.click();
        await this.page.waitForTimeout(2000);
        console.log(' Hire Now button clicked');
    }

    async fillAddress() {
        console.log(' Filling address');
        await this.addressField.click();
        await this.page.waitForTimeout(1000);
        await this.broadwayAddress.click();
        await this.page.waitForTimeout(1000);
        console.log(' Address filled: Broadway New York');
    }

    async fillContactNumber(phoneNumber = '+8801962416679') {
        console.log(' Filling contact number');
        await this.contactNumberField.click();
        await this.contactNumberField.fill(phoneNumber);
        console.log(` Contact number filled: ${phoneNumber}`);
    }

    async selectSlotTime() {
        console.log(' Selecting slot time');
        
        // Open date picker
        await this.slotTimePicker.click();
        await this.page.waitForTimeout(1000);
        
        // Select date (22nd)
        await this.dateCell22.click();
        await this.page.waitForTimeout(500);
        
        // Select time (14:00)
        await this.time14.dblclick();
        await this.page.waitForTimeout(500);
        
        // Continue with time selection
        await this.slotTimeField.click();
        await this.dateCell24.click();
        await this.time17.click();
        await this.time10.click();
        
        // Confirm selection
        await this.okButton.click();
        await this.page.waitForTimeout(1000);
        console.log(' Slot time selected successfully');
    }

    async fillWorkOverview(overview = 'for testing') {
        console.log(' Filling work overview');
        await this.workOverviewField.click();
        await this.workOverviewField.fill(overview);
        console.log(` Work overview filled: ${overview}`);
    }

    async clickBookNow() {
        console.log(' Clicking Book Now');
        await this.bookNowButton.click();
        await this.page.waitForTimeout(3000);
        console.log(' Book Now button clicked');
    }

    async verifyServiceBooking() {
        console.log(' Verifying service booking success');
        
        const isServiceVisible = await this.serviceTableElement.isVisible({ timeout: 10000 });
        
        if (isServiceVisible) {
            console.log(' SUCCESS: Service booking confirmed - Service appears in booking table');
            await this.serviceTableElement.click();
            await this.page.waitForTimeout(1000);
            console.log(' Service booking element is clickable and accessible');
            return true;
        } else {
            // Alternative verification
            const isSuccessVisible = await this.successMessage.isVisible({ timeout: 2000 });
            if (isSuccessVisible) {
                console.log(' Alternative verification passed: Found success message');
                return true;
            }
            
            console.log(' WARNING: Could not verify service booking');
            return false;
        }
    }

    async completeHireServiceWorkflow(phoneNumber = '+8801962416679', overview = 'for testing') {
        console.log(' Starting complete hire service workflow');
        
        try {
            await this.navigateToServices();
            await this.selectFirstService();
            await this.clickHireNow();
            await this.fillAddress();
            await this.fillContactNumber(phoneNumber);
            await this.selectSlotTime();
            await this.fillWorkOverview(overview);
            await this.clickBookNow();
            const success = await this.verifyServiceBooking();
            
            if (success) {
                console.log(' SUCCESS: Hire service workflow completed successfully');
                return true;
            } else {
                console.log(' Workflow completed but verification failed');
                return false;
            }
            
        } catch (error) {
            console.log(' Error in hire service workflow:', error.message);
            throw error;
        }
    }
}

module.exports = { HireNowPage };
