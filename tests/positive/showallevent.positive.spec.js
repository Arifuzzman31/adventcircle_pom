const { test, expect } = require('@playwright/test');
const { ShowAllEvent } = require('../../pages/showalleventpage');
const { LoginPage } = require('../../pages/loginpage');

test('User can view any available event details and mark interested', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const showAllEvent = new ShowAllEvent(page);

  // Step 1: Login
  await loginPage.goto();
  await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');
  console.log('✅ Login completed');

  // Step 2: Navigate to See All events
  await showAllEvent.goToSeeAll();
  
  // Wait for events page to load
  await page.waitForTimeout(3000);

  // Step 3: Select an event
  await showAllEvent.selectEvent();
  
  // Wait for event details page to load
  await page.waitForTimeout(2000);

  // Step 4: Verify event details are displayed
  await showAllEvent.verifyEventDetails();

  // Step 5: Mark as interested
  await showAllEvent.markInterested();
  
  console.log('🎉 Test completed successfully');
});
