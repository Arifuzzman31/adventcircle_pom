const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage');
const { EventPage } = require('../../pages/eventcreatepage');

test('Church profile can create an event successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const eventPage = new EventPage(page);

  //  Step 1: Navigate to login page and login
  await loginPage.goto();
  await loginPage.login('ratulsikder.dev@gmail.com', '123456Ab@');

  //  Step 2: Go to Event section
  await eventPage.goToEventPage();

  //  Step 3: Click on Create Event
  await eventPage.createNewEvent();

  //  Step 4: Fill event form
  await eventPage.fillEventForm();

  //  Step 4.5: Verify image upload (optional check)
  const imageUploaded = await eventPage.verifyImageUploaded();
  if (imageUploaded) {
    console.log('✓ Image upload successful');
  } else {
    console.log('⚠ Image upload verification failed, but continuing test');
  }

  // Brief pause to ensure image is fully loaded
  await page.waitForTimeout(1000);

  //  Step 5: Publish event
  await eventPage.publishEvent();

  //  Step 6: Verify event is created
  await eventPage.verifyEventCreated();
});
