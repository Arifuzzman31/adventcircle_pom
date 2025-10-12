const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage');
const { AisuggestedPage } = require('../../pages/aichatsuggestedpage');

test('Suggested question flow with recent chat verification', async ({ page }) => {
  // Set longer timeout for this test
  test.setTimeout(120000); // 2 minutes
  const login = new LoginPage(page);
  const chat = new AisuggestedPage(page);

  // Step 1: Login
  await login.goto();
  await login.login('ratulsikder104@gmail.com', 'Ratul@104!');
  console.log(' Step 1: Login successful');

  // Step 2: Go to Talk to Pastor AI
  try {
    await chat.openChat();
    await chat.waitForChatPageToLoad();
    console.log(' Step 2: Navigated to Talk to Pastor AI');
  } catch (error) {
    console.log(' Navigation issue, retrying...', error.message);
    // Retry with direct navigation
    await page.goto('https://adventcircle.com/chat', { waitUntil: 'domcontentloaded' });
    await chat.waitForChatPageToLoad();
    console.log(' Step 2: Navigated to Talk to Pastor AI (via fallback)');
  }

  // Step 3: Choose one suggested question
  const suggestedQuestion = 'Who is Jesus Christ?';
  await chat.clickSuggestedQuestion(suggestedQuestion);
  console.log(' Step 3: Selected suggested question:', suggestedQuestion);

  // Step 4: Click send button
  await chat.clickSendButton();
  console.log(' Step 4: Clicked send button');

  // Step 5: Check if bot gives response (no validation needed)
  const response = await chat.getResponseText();
  expect(response).toBeTruthy();
  expect(response.trim().length).toBeGreaterThan(0);
  console.log(' Step 5: Bot responded (response length:', response.trim().length, 'characters)');

  // Step 6: Verify chat is added to recent history
  await chat.clickRecentChat();
  console.log(' Step 6: Verified chat was added to recent history');

  console.log('\n Test completed successfully!');
});
