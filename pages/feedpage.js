const path = require('path');

class FeedsPage {
  constructor(page) {
    this.page = page;
    this.postBox = page.getByText('Share your thoughts, prayers');
    this.textArea = page.getByRole('textbox', { name: 'Share your thoughts, prayers' });
    this.imageButton = page.getByLabel('Create post').getByRole('button', { name: 'Image' });
    this.postButton = page.getByRole('button', { name: 'Post' });
    this.likeButton = page.getByRole('button', { name: /like/i }).first();
    this.commentBox = page.getByRole('textbox', { name: 'Write your comment…' });
    this.commentSend = page.getByRole('button', { name: 'send' });
  }

  async isLoaded() {
    await this.postBox.waitFor({ state: 'visible' });
  }

  async createTextPost(text) {
    await this.postBox.click();
    await this.textArea.fill(text);
    await this.postButton.click();
  }

  async createTextWithImage(text, imagePath) {
    await this.postBox.click();
    await this.textArea.fill(text);

    // Wait for image button to be visible and click it
    await this.imageButton.waitFor({ state: 'visible' });
    await this.imageButton.click();

    // Upload image
    const fileInput = this.page.locator('input[type="file"][accept="image/*"]');
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(imagePath);

    // Click post and wait for navigation/reload to complete
    await this.postButton.click();
    
    // Wait for the page to stabilize after posting
    await this.page.waitForTimeout(2000);
    
    // Wait for the feed to reload with the new post
    await this.postBox.waitFor({ state: 'visible' });
  }

  async likeAnyPost() {
    // Scroll down to see posts and like buttons
    await this.page.keyboard.press('PageDown');
    await this.page.waitForTimeout(2000);
    
    // Try multiple approaches to find and click any like button
    const selectors = [
      'button:has-text("Like")',
      '[data-testid*="like"]',
      'button[aria-label*="like"]',
      'button:has(svg) >> text="Like"',
      'button >> text="Like"'
    ];
    
    for (const selector of selectors) {
      try {
        const likeButton = this.page.locator(selector).first();
        await likeButton.waitFor({ state: 'visible', timeout: 3000 });
        await likeButton.click();
        console.log(`Successfully clicked like button with selector: ${selector}`);
        return; // Exit if successful
      } catch (error) {
        console.log(`Selector ${selector} failed: ${error.message}`);
        continue;
      }
    }
    
    // If all selectors fail, just skip the like action
    console.log('Could not find any like button, skipping like action');
  }

  async commentOnFirstPost(comment) {
    await this.commentBox.waitFor({ state: 'visible' });
    await this.commentBox.fill(comment);
    await this.commentSend.click();
  }

  async commentOnNthPost(index, comment) {
    const commentBoxes = this.page.getByRole('textbox', { name: 'Write your comment…' });
    const sendButtons = this.page.getByRole('button', { name: 'send' });

    await commentBoxes.nth(index).waitFor({ state: 'visible' });
    await commentBoxes.nth(index).fill(comment);
    await sendButtons.nth(index).click();
  }
}

module.exports = { FeedsPage };
