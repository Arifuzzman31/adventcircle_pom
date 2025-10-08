const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage');
const { DonationPage } = require('../../pages/donationpage');
// Note: SITE_STRINGS import removed as it's TypeScript - using string directly

test.describe('Donation - Positive Tests', () => {
  let loginPage;
  let donationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    donationPage = new DonationPage(page);

    // Login as Church before each test
    await loginPage.goto();
    await loginPage.login('ratulsikder.dev@gmail.com', '123456Ab@');
    await donationPage.gotoDonations();
  });

  test('Church can create a donation', async ({ page }) => {
    // Create Donation with valid data
    await donationPage.createDonation(
      'test donation 1',
      'tests/test-data/1.png',
      '5000',
      '01945233245',
      'niaz@gmail.com',
      'testing testing'
    );
  });

});
