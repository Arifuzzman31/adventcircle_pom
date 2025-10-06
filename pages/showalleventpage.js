const { expect } = require('@playwright/test');

class ShowAllEvent {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;

      // Locators
      this.seeAllLink = page.getByRole('link', { name: 'See All' }).first();
      this.eventLink = page.getByRole('link', { name: 'for testing purpose Oct 6th,' }).nth(1);
      this.eventHeading = page.getByRole('heading', { name: 'for testing purpose' });
      this.interestedHeading = page.getByRole('heading', { name: 'Interested:' });
      this.eventDateHeading = page.getByRole('heading', { name: 'Event Date:' });
      this.eventTimeHeading = page.getByRole('heading', { name: 'Event Time:' });
      this.eventScheduleHeading = page.getByRole('heading', { name: 'Event Schedule' });
      this.contactHeading = page.getByRole('heading', { name: 'Contact' });
      this.addressHeading = page.getByRole('heading', { name: 'Address' });
      this.starInterestedButton = page.getByRole('button', { name: 'star Interested' });
    }
  
    async goToSeeAll() {
      await this.seeAllLink.click();
    }
  
    async selectEvent() {
      await this.eventLink.click();
    }
  
    async verifyEventDetails() {
      // Assert that each heading is visible
      await expect(this.eventHeading).toBeVisible();
      await expect(this.interestedHeading).toBeVisible();
      await expect(this.eventDateHeading).toBeVisible();
      await expect(this.eventTimeHeading).toBeVisible();
      await expect(this.eventScheduleHeading).toBeVisible();
      await expect(this.contactHeading).toBeVisible();
      await expect(this.addressHeading).toBeVisible();
    }
  
    async markInterested() {
      await expect(this.starInterestedButton).toBeVisible();
      await this.starInterestedButton.click();
    }
  }
  
  module.exports = { ShowAllEvent };
  