const { test, expect } = require('@playwright/test');
const { ShowAllEvent } = require('../../pages/showalleventpage');
const { LoginPage } = require('../../pages/loginpage');

test('Positive test: user can view event details and mark interested', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const showAllEvent = new ShowAllEvent(page);

  // Go to login page and login
  await loginPage.goto();
  await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');

  // Navigate to See All events
  await showAllEvent.goToSeeAll();

  // Select the specific event
  await showAllEvent.selectEvent();

  // Verify event details
  await showAllEvent.verifyEventDetails();

  // Mark as interested
  await showAllEvent.markInterested();
});
