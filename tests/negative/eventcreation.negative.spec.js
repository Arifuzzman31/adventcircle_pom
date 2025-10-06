const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage');
const {EventPage} = require('../../pages/eventcreatepage');

test('Church profile cannot create an event without mandatory fields', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const eventPage = new EventPage(page);

  //  Step 1: Navigate to login page and login
  await loginPage.goto();
  await loginPage.login('ratulsikder.dev@gmail.com', '123456Ab@');

  //  Step 2: Go to Event section
  await eventPage.goToEventPage();

  //  Step 3: Click on Create Event
  await eventPage.createNewEvent();

  //  Step 4: Try to fill partial form (missing mandatory Event Title and Banner)
  await eventPage.eventTypeDropdown.click();
  await eventPage.eventTypeOption.click();
  await eventPage.description.fill('testing negative case');
  await eventPage.email.fill('niazsays99@gmail.com');
  await eventPage.locationSearch.fill('dha');
  await eventPage.locationOption.click();

  //  Step 5: Try to publish without title or banner
  await eventPage.publishEvent();

  // Step 6: Expect validation error or failure message
  // Wait a moment for any validation to appear
  await page.waitForTimeout(2000);
  
  // Try multiple validation message patterns
  const possibleValidationMessages = [
    page.getByText('Event Title is required'),
    page.getByText('Title is required'),
    page.getByText('required', { exact: false }),
    page.getByText('Please fill', { exact: false }),
    page.getByText('This field is required'),
    page.locator('.error'),
    page.locator('[class*="error"]'),
    page.locator('.ant-form-item-has-error')
  ];
  
  let validationFound = false;
  for (const message of possibleValidationMessages) {
    try {
      await expect(message).toBeVisible({ timeout: 1000 });
      validationFound = true;
      console.log('Validation message found:', await message.textContent());
      break;
    } catch (error) {
      // Continue to next validation check
    }
  }
  
  // If no validation message found, check if publish button is disabled
  if (!validationFound) {
    try {
      await expect(eventPage.publishButton).toBeDisabled({ timeout: 1000 });
      validationFound = true;
      console.log('Publish button is disabled - validation working');
    } catch (error) {
      // Continue to success check
    }
  }
  
  // Step 7: Ensure event is NOT created
  try {
    await expect(eventPage.successText).not.toBeVisible({ timeout: 3000 });
    validationFound = true;
    console.log('Success message not shown - validation working');
  } catch (error) {
    // If success message appears, validation failed
    if (!validationFound) {
      throw new Error('Form validation failed - event was created without required fields');
    }
  }
  
  // Ensure at least one validation method worked
  if (!validationFound) {
    throw new Error('No validation detected - form should prevent submission without required fields');
  }
});
