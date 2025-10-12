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

  await donatePage.fillStripeForm({
    cardNumber: '4242 4242 4242 4242',
    expiry: '01 / 27',
    cvc: '123'
  });

  await donatePage.submitDonation();

  // Verification
  await expect(page.locator('text=Thank you for your donation')).toBeVisible();
});
