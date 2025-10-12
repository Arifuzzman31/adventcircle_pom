const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage'); 
const { DonatePage } = require('../../pages/donatepage');

test('Positive Test: User can donate successfully', async ({ page }) => {
  await page.goto('https://adventcircle.com/');

  // Navigate to login page first
  await page.getByRole('link', { name: 'Login' }).click();

  // Login
  const loginPage = new LoginPage(page);
  await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');

  // Donation
  const donatePage = new DonatePage(page);
  await donatePage.gotoDonate();
  await donatePage.fillDonationForm({
    firstName: 'Adam',
    lastName: 'Alfredo',
    email: 'niazsaya34@gmail.com',
    phone: '01956435623',
    country: 'Afghanistan',
    address: 'no address needed',
    amount: 200
  });

  // Verification - Test passes when Stripe payment form opens (no actual payment)
  // Check if Stripe iframe appears - this indicates the donation flow works correctly
  await expect(page.locator('iframe[name^="__privateStripeFrame"]').first()).toBeVisible({ timeout: 10000 });
  
  console.log(' Test passed: Donation flow completed successfully - Stripe payment form opened');
});
