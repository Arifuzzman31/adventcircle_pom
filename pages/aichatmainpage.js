class AichatMainPage {
    constructor(page) {
      this.page = page;
      this.chatNavLink = page.getByRole('link').filter({ hasText: /^$/ }).nth(1);
      this.talkToPastorLink = page.getByRole('link', { name: 'Talk To Pastor Ai' });
      this.chatInput = page.getByRole('textbox', { name: "Ask Anything... I'm here to" });
      this.sendBtn = page.getByRole('img', { name: 'btn' });
      this.responseArea = page.locator('.px-4.md\\:px-40');
 
      this.suggestedQuestion = page.locator('.suggested-question'); // Update with real selector if needed
    }
  
    async openChat() {
      await this.chatNavLink.click();
      await this.page.goto('https://adventcircle.com/chat');
      await this.talkToPastorLink.click();
    }
  
    async waitForChatPageToLoad() {
      await this.chatInput.waitFor({ state: 'visible', timeout: 10000 });
    }
  
    async askQuestion(question) {
      await this.chatInput.fill(question);
      await this.sendBtn.click();
      // Wait a moment for the question to be processed
      await this.page.waitForTimeout(2000); 
    }
  
    async clickSuggestedQuestion(index = 0) {
      await this.suggestedQuestion.nth(index).click();
    }
  
    async getResponseText() {
      // Wait for response with multiple strategies
      try {
        // First try the main response area
        await this.responseArea.waitFor({ state: 'visible', timeout: 20000 });
        const response = await this.responseArea.textContent();
        if (response && response.trim().length > 10) {
          return response; 
        }
      } catch (error) {
        console.log('Main response area not found, trying alternative selectors...');
      }
      
      // Try alternative selectors for response
      const alternativeSelectors = [
        '.chat-response',
        '.bot-message',
        '.ai-response', 
        '[data-testid="bot-response"]',
        '.message-content',
        '.chat-bubble',
        '.response-text'
      ];
      
      for (const selector of alternativeSelectors) {
        try {
          const element = this.page.locator(selector).last();
          await element.waitFor({ state: 'visible', timeout: 5000 });
          const text = await element.textContent();
          if (text && text.trim().length > 10) {
            return text;
          }
        } catch (error) {
          continue;
        }
      }
      
      // If no specific response found, get all visible text from page
      console.log('Trying to get any visible response text...');
      await this.page.waitForTimeout(3000); // Wait a bit more for response
      const allText = await this.page.textContent();
      return allText || 'No response found';
    }
  
}

module.exports = { AichatMainPage };