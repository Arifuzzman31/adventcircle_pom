const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { FeedsPage } = require('../Feedpages/feed.page');
const path = require('path');

test('Post with text, image, like, and comment', async ({ page }) => {
  // Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('ratulsikder104@gmail.com', 'Ratul@104!');

  // Open Feeds page
  const feedsPage = new FeedsPage(page);
  await feedsPage.isLoaded();

  // Post text + image
  await feedsPage.createTextWithImage(
    "ok ok alright",
    path.resolve(__dirname, 'test-data/1.png') // relative to Tests folder
  );

  // Like first post
  await feedsPage.likeFirstPost();

  // Comment on first post
  await feedsPage.commentOnFirstPost("yes well said ");

  // Assertions
  await expect(page.locator('text=ok ok alright')).toBeVisible();
  await expect(page.locator('text=yes well said')).toBeVisible();
});
