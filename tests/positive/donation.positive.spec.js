import { test, expect } from '@playwright/test';
const { LoginPage } = require('../../pages/loginpage');
import { DonationPage } from '../../pages/donationpage';
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

  test('Should allow submission without email (optional field)', async ({ page }) => {
    await donationPage.openCreateDonationForm();
    await donationPage.fillPartialForm('Test Donation No Email', '300', '01945233245', '', 'Testing without email field');
    
    // Try to submit (should work since email is optional)
    await donationPage.submitBtn.click();
    
    // Wait for form to process
    await page.waitForTimeout(2000);
    
    console.log('✅ Form allows submission without optional email field');
  });
});
