import { test, expect } from '@playwright/test';
const { LoginPage } = require('../../pages/loginpage');
import { DonationPage } from '../../pages/donationpage';
// Note: SITE_STRINGS import removed as it's TypeScript - using string directly

test.describe('Donation - Negative Tests', () => {
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

  test('Should show validation errors for blank mandatory fields', async ({ page }) => {
    // Open the form and try to submit with all fields blank
    await donationPage.openCreateDonationForm();
    await donationPage.submitFormAndExpectValidation();
    
    // Verify form is still visible (didn't submit) by checking key form elements
    await expect(donationPage.titleInput).toBeVisible();
    await expect(donationPage.goalAmountInput).toBeVisible();
    await expect(donationPage.phoneInput).toBeVisible();
    await expect(donationPage.detailsInput).toBeVisible();
    
    console.log(' Mandatory field validation working - form prevents submission with blank fields');
  });

  test('Should validate mandatory fields with asterisk indicators', async ({ page }) => {
    // Open the form and verify asterisk indicators
    await donationPage.openCreateDonationForm();
    await donationPage.verifyMandatoryFieldIndicators();
    
    console.log(' Asterisk indicators are correctly displayed for mandatory fields');
  });

  test('Should not allow submission with only title filled', async ({ page }) => {
    await donationPage.openCreateDonationForm();
    await donationPage.fillPartialForm('Partial Test Donation');
    await donationPage.submitFormAndExpectValidation();
    
    // Should still be on the form (not submitted)
    await expect(donationPage.titleInput).toBeVisible();
    await expect(donationPage.goalAmountInput).toBeVisible();
    
    console.log(' Form validation prevents submission with incomplete mandatory fields');
  });

  test('Should not allow submission with missing goal amount', async ({ page }) => {
    await donationPage.openCreateDonationForm();
    await donationPage.fillPartialForm('Test Donation Missing Goal', '', '01945233245', '', 'Testing missing goal amount');
    await donationPage.submitFormAndExpectValidation();
    
    // Should still be on the form
    await expect(donationPage.goalAmountInput).toBeVisible();
    
    console.log(' Form validation prevents submission without goal amount');
  });

  test('Should not allow submission with missing phone number', async ({ page }) => {
    await donationPage.openCreateDonationForm();
    await donationPage.fillPartialForm('Test Donation Missing Phone', '500', '', '', 'Testing missing phone number');
    await donationPage.submitFormAndExpectValidation();
    
    // Should still be on the form
    await expect(donationPage.phoneInput).toBeVisible();
    
    console.log(' Form validation prevents submission without phone number');
  });

  test('Should not allow submission with missing details', async ({ page }) => {
    await donationPage.openCreateDonationForm();
    await donationPage.fillPartialForm('Test Donation Missing Details', '750', '01945233245', '', '');
    await donationPage.submitFormAndExpectValidation();
    
    // Should still be on the form
    await expect(donationPage.detailsInput).toBeVisible();
    
    console.log(' Form validation prevents submission without details');
  });
});
