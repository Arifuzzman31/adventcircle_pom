class AichatMainPage {
    constructor(page) {
      this.page = page;
      // Multiple selectors for chat navigation
      this.chatNavLink = page.getByRole('link').filter({ hasText: /^$/ }).nth(1);
      this.chatNavLinkAlt = page.getByRole('link', { name: 'Chat' });
      this.chatNavLinkAlt2 = page.locator('a[href*="chat"]');
      
      this.talkToPastorLink = page.getByRole('link', { name: 'Talk To Pastor Ai' });
      this.chatInput = page.getByPlaceholder("Ask Anything... I'm here to help");
      this.sendBtn = page.locator('button[type="submit"], .send-button, button:has(svg)');
      this.responseArea = page.locator('.chat-response, .ai-response, .bot-message, .message-content');
 
      this.suggestedQuestion = page.locator('.suggested-question'); // Update with real selector if needed
    }
  
    async openChat() {
      console.log('🔄 Starting chat navigation...');
      
      // Handle potential toaster notifications
      try {
        await this.page.waitForTimeout(2000);
        const toaster = this.page.locator('#_rht_toaster, .toaster, [class*="toast"]');
        if (await toaster.isVisible({ timeout: 1000 })) {
          console.log(' Toaster notification detected, waiting for it to disappear...');
          await toaster.waitFor({ state: 'hidden', timeout: 5000 });
        }
      } catch (e) {
        // Continue if no toaster found
      }
      
      // Try multiple approaches to navigate to chat
      try {
        console.log('Trying primary chat nav link...');
        await this.chatNavLink.click({ timeout: 5000 });
        console.log('✓ Chat nav link clicked successfully');
      } catch (error) {
        console.log(' Chat nav link click failed:', error.message);
        console.log('Trying fallback navigation...');
        
        // Fallback: Direct navigation to chat page
        await this.page.goto('https://adventcircle.com/chat');
        console.log('✓ Direct navigation to chat page');
      }
      
      // Wait for page to load
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);
      
      // Click Talk to Pastor AI link
      await this.clickTalkToPastorAI();
    }
    
    async clickTalkToPastorAI() {
      console.log('🔄 Looking for Talk to Pastor AI link...');
      
      try {
        await this.talkToPastorLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.talkToPastorLink.click();
        
        // Wait for AI chat interface to load
        await this.page.waitForURL('**/adv-ai/new**', { timeout: 10000 });
        console.log('✓ Navigated to AI chat interface');
      } catch (error) {
        console.log(' Talk to Pastor AI link not found or not clickable:', error.message);
        
        // Try direct navigation to AI chat page
        try {
          await this.page.goto('https://adventcircle.com/adv-ai/new', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
          });
          console.log('✓ Direct navigation to AI chat interface successful');
        } catch (navError) {
          console.log(' Direct navigation also failed:', navError.message);
        }
      }
    }
  
    async waitForChatPageToLoad() {
      console.log('🔄 Waiting for chat page to load...');
      
      try {
        await this.chatInput.waitFor({ state: 'visible', timeout: 15000 });
        console.log('✓ Chat input found and visible');
      } catch (error) {
        console.log(' Chat input not found, trying alternative selectors...');
        
        // Try alternative selectors for the chat input
        const alternativeSelectors = [
          'input[placeholder*="Ask Anything"]',
          'input[placeholder*="I\'m here to help"]',
          'textarea[placeholder*="Ask"]',
          'input[type="text"]',
          '.chat-input',
          '[data-testid="chat-input"]'
        ];
        
        for (const selector of alternativeSelectors) {
          try {
            const element = this.page.locator(selector).first();
            await element.waitFor({ state: 'visible', timeout: 3000 });
            console.log(`✓ Found chat input with selector: ${selector}`);
            // Update the chatInput reference
            this.chatInput = element;
            return;
          } catch (e) {
            continue;
          }
        }
        
        console.log('⚠️ No chat input found, but continuing...');
      }
    }
  
    async askQuestion(question) {
      console.log(`🔄 Asking question: "${question}"`);
      
      // Fill the question
      await this.chatInput.fill(question);
      await this.page.waitForTimeout(500);
      
      // Try to click send button with fallbacks
      try {
        await this.sendBtn.click();
        console.log('✓ Send button clicked');
      } catch (error) {
        console.log('⚠️ Send button not found, trying alternatives...');
        
        // Try alternative send methods
        const sendAlternatives = [
          () => this.page.getByRole('button', { name: 'Send' }).click(),
          () => this.page.locator('button[type="submit"]').click(),
          () => this.page.locator('.send-button').click(),
          () => this.page.keyboard.press('Enter')
        ];
        
        for (const sendMethod of sendAlternatives) {
          try {
            await sendMethod();
            console.log('✓ Question sent using alternative method');
            break;
          } catch (e) {
            continue;
          }
        }
      }
      
      // Wait for the question to be processed
      await this.page.waitForTimeout(3000); 
      console.log('✓ Question sent and processing...');
    }
  
    async clickSuggestedQuestion(index = 0) {
      await this.suggestedQuestion.nth(index).click();
    }
  
    async getResponseText() {
      console.log('🔄 Waiting for AI response...');
      
      // Wait longer for AI to process and respond
      await this.page.waitForTimeout(5000);
      
      // Try multiple strategies to find the response
      const responseStrategies = [
        // Strategy 1: Look for new content that appeared after sending question
        async () => {
          const chatArea = this.page.locator('.chat-area, .conversation, .messages');
          const messages = chatArea.locator('div, p, span').filter({ hasText: /\w{10,}/ });
          const lastMessage = messages.last();
          if (await lastMessage.isVisible({ timeout: 2000 })) {
            const text = await lastMessage.textContent();
            if (text && text.trim().length > 20 && !text.includes('Ask Anything')) {
              return text;
            }
          }
          return null;
        },
        
        // Strategy 2: Look for any text that contains Bible-related keywords
        async () => {
          const pageText = await this.page.textContent();
          const keywords = ['bible', 'scripture', 'god', 'jesus', 'christian', 'faith', 'salvation'];
          const lines = pageText.split('\n').filter(line => 
            line.trim().length > 20 && 
            keywords.some(keyword => line.toLowerCase().includes(keyword))
          );
          if (lines.length > 0) {
            return lines.join(' ').trim();
          }
          return null;
        },
        
        // Strategy 3: Look for any substantial text content that's not navigation
        async () => {
          const contentSelectors = [
            'p:not(:has(a)):not(:has(button))',
            'div:not(:has(a)):not(:has(button))',
            '.response',
            '.answer',
            '.content'
          ];
          
          for (const selector of contentSelectors) {
            try {
              const elements = this.page.locator(selector);
              const count = await elements.count();
              for (let i = 0; i < count; i++) {
                const text = await elements.nth(i).textContent();
                if (text && text.trim().length > 30 && 
                    !text.includes('Ask Anything') && 
                    !text.includes('New Chat') &&
                    !text.includes('Recent Chats')) {
                  return text;
                }
              }
            } catch (e) {
              continue;
            }
          }
          return null;
        }
      ];
      
      // Try each strategy
      for (let i = 0; i < responseStrategies.length; i++) {
        try {
          console.log(`Trying response strategy ${i + 1}...`);
          const result = await responseStrategies[i]();
          if (result) {
            console.log(`✓ Found response using strategy ${i + 1}`);
            return result;
          }
        } catch (error) {
          console.log(`Strategy ${i + 1} failed:`, error.message);
        }
      }
      
      // Final fallback: get all page text and filter
      console.log('Using fallback: getting all page text...');
      await this.page.waitForTimeout(3000);
      const allText = await this.page.textContent();
      
      // Filter out navigation and UI text
      const filteredText = allText
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.length > 20 && 
                 !trimmed.includes('New Chat') &&
                 !trimmed.includes('Recent Chats') &&
                 !trimmed.includes('Ask Anything') &&
                 !trimmed.includes('Suggested Questions');
        })
        .join(' ')
        .trim();
      
      return filteredText || 'No meaningful response found';
    }
  
}

module.exports = { AichatMainPage };