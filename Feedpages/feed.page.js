const path = require('path');

class FeedsPage {
  constructor(page) {
    this.page = page;
    this.postBox = page.getByText('Share your thoughts, prayers');
    this.textArea = page.getByRole('textbox', { name: 'Share your thoughts, prayers' });
    this.imageButton = page.getByRole('button', { name: 'picture Image' });
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
    
    // Click the image button first to activate the image upload
    await this.imageButton.click();
    
    // Wait for image file input to appear and use a specific selector
    const fileInput = this.page.locator('input[type="file"][accept="image/*"]');
    await fileInput.waitFor({ state: 'attached' });
    await fileInput.setInputFiles(imagePath);
    
    await this.postButton.click();
  }

  async likeFirstPost() {
    // Wait for the like button to be visible and clickable
    await this.likeButton.waitFor({ state: 'visible' });
    await this.likeButton.click();
  }

  async commentOnFirstPost(comment) {
    // Wait for comment box to be available
    await this.commentBox.waitFor({ state: 'visible' });
    await this.commentBox.click();
    await this.commentBox.fill(comment);
    
    // Wait for send button to be enabled
    await this.commentSend.waitFor({ state: 'visible' });
    await this.commentSend.click();
  }
}

module.exports = { FeedsPage };
