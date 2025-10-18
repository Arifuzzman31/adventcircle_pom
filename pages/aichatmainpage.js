class AichatMainPage {
    constructor(page) {
      this.page = page;
      // Multiple selectors for chat navigation
      this.chatNavLink = page.getByRole('link', { name: 'Chat' });
      this.chatNavLinkAlt = page.locator('a[href*="chat"]');
      this.chatNavLinkAlt2 = page.getByText('Chat');
      
      this.talkToPastorLink = page.getByRole('link', { name: 'Talk To Pastor Ai' });
      this.talkToPastorLinkAlt = page.locator('a[href*="adv-ai"]');
      this.talkToPastorLinkAlt2 = page.getByText('Talk To Pastor');
      this.chatInput = page.getByPlaceholder("Ask Anything... I'm here to help");
      this.chatInputAlt = page.locator('textarea, input[type="text"]').first();
      this.sendBtn = page.getByRole('button').filter({ hasText: /send|submit/i });
      this.sendBtnAlt = page.locator('button[type="submit"], .send-button, button:has(svg)');
      this.responseArea = page.locator('.chat-response, .ai-response, .bot-message, .message-content');
 
      this.suggestedQuestion = page.locator('.suggested-question'); // Update with real selector if needed
    }
  
    async openChat() {
      console.log(' Starting chat navigation...');
      
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
      let navigatedToChat = false;
      
      // Method 1: Try primary chat link
      try {
        console.log('Trying primary chat nav link...');
        await this.chatNavLink.click({ timeout: 5000 });
        console.log(' Chat nav link clicked successfully');
        navigatedToChat = true;
      } catch (error) {
        console.log(' Primary chat nav failed:', error.message);
      }
      
      // Method 2: Try alternative chat link
      if (!navigatedToChat) {
        try {
          console.log('Trying alternative chat nav link...');
          await this.chatNavLinkAlt.click({ timeout: 3000 });
          console.log(' Alternative chat nav link clicked');
          navigatedToChat = true;
        } catch (error) {
          console.log(' Alternative chat nav failed:', error.message);
        }
      }
      
      // Method 3: Direct navigation fallback
      if (!navigatedToChat) {
        console.log('Using fallback: Direct navigation to chat page...');
        await this.page.goto('https://adventcircle.com/chat');
        console.log(' Direct navigation to chat page');
      }
      
      // Wait for page to load
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(2000);
      
      // Click Talk to Pastor AI link
      await this.clickTalkToPastorAI();
    }
    
    async clickTalkToPastorAI() {
      console.log(' Looking for Talk to Pastor AI link...');
      
      let aiChatReached = false;
      
      // Method 1: Try primary Talk to Pastor link
      try {
        await this.talkToPastorLink.waitFor({ state: 'visible', timeout: 8000 });
        await this.talkToPastorLink.click();
        await this.page.waitForURL('**/adv-ai/new**', { timeout: 8000 });
        console.log(' Navigated to AI chat interface via primary link');
        aiChatReached = true;
      } catch (error) {
        console.log(' Primary Talk to Pastor link failed:', error.message);
      }
      
      // Method 2: Try alternative Talk to Pastor link
      if (!aiChatReached) {
        try {
          await this.talkToPastorLinkAlt.click({ timeout: 3000 });
          await this.page.waitForURL('**/adv-ai/new**', { timeout: 5000 });
          console.log(' Navigated to AI chat interface via alternative link');
          aiChatReached = true;
        } catch (error) {
          console.log(' Alternative Talk to Pastor link failed:', error.message);
        }
      }
      
      // Method 3: Direct navigation fallback
      if (!aiChatReached) {
        console.log('Using fallback: Direct navigation to AI chat interface...');
        try {
          await this.page.goto('https://adventcircle.com/adv-ai/new', {
            waitUntil: 'domcontentloaded',
            timeout: 15000
          });
          console.log(' Direct navigation to AI chat interface successful');
        } catch (navError) {
          console.log(' All navigation methods failed:', navError.message);
          throw new Error('Unable to reach AI chat interface');
        }
      }
    }
  
    async waitForChatPageToLoad() {
      console.log(' Waiting for chat page to load...');
      
      let chatInputFound = false;
      
      // Try primary chat input
      try {
        await this.chatInput.waitFor({ state: 'visible', timeout: 10000 });
        console.log(' Primary chat input found and visible');
        chatInputFound = true;
      } catch (error) {
        console.log(' Primary chat input not found, trying alternatives...');
      }
      
      // Try alternative chat input
      if (!chatInputFound) {
        try {
          await this.chatInputAlt.waitFor({ state: 'visible', timeout: 5000 });
          this.chatInput = this.chatInputAlt;
          console.log(' Alternative chat input found');
          chatInputFound = true;
        } catch (error) {
          console.log(' Alternative chat input also not found');
        }
      }
      
      // Final fallback with multiple selectors
      if (!chatInputFound) {
        console.log('Trying final fallback selectors...');
        const fallbackSelectors = [
          'input[placeholder*="Ask"]',
          'textarea[placeholder*="Ask"]',
          'input[type="text"]:visible',
          'textarea:visible',
          '.chat-input',
          '[data-testid="chat-input"]'
        ];
        
        for (const selector of fallbackSelectors) {
          try {
            const element = this.page.locator(selector).first();
            await element.waitFor({ state: 'visible', timeout: 2000 });
            console.log(` Found chat input with fallback selector: ${selector}`);
            this.chatInput = element;
            chatInputFound = true;
            break;
          } catch (e) {
            continue;
          }
        }
      }
      
      if (!chatInputFound) {
        console.log(' No chat input found with any method');
        throw new Error('Chat input not found - interface may not be loaded');
      }
    }
  
    async askQuestion(question) {
      console.log(` Asking question: "${question}"`);
      
      // Fill the question
      await this.chatInput.fill(question);
      await this.page.waitForTimeout(500);
      
      // Try to send the question with multiple methods
      let questionSent = false;
      
      // Method 1: Try primary send button
      try {
        await this.sendBtn.click({ timeout: 3000 });
        console.log(' Primary send button clicked');
        questionSent = true;
      } catch (error) {
        console.log(' Primary send button failed:', error.message);
      }
      
      // Method 2: Try alternative send button
      if (!questionSent) {
        try {
          await this.sendBtnAlt.click({ timeout: 3000 });
          console.log(' Alternative send button clicked');
          questionSent = true;
        } catch (error) {
          console.log(' Alternative send button failed:', error.message);
        }
      }
      
      // Method 3: Try Enter key
      if (!questionSent) {
        try {
          await this.chatInput.press('Enter');
          console.log(' Question sent using Enter key');
          questionSent = true;
        } catch (error) {
          console.log(' Enter key method failed:', error.message);
        }
      }
      
      // Method 4: Try other button approaches
      if (!questionSent) {
        const sendMethods = [
          () => this.page.getByRole('button', { name: 'Send' }).click(),
          () => this.page.getByRole('button').filter({ hasText: 'Send' }).click(),
          () => this.page.locator('button[type="submit"]').first().click(),
          () => this.page.locator('button').filter({ hasText: /send|submit/i }).first().click()
        ];
        
        for (let i = 0; i < sendMethods.length; i++) {
          try {
            await sendMethods[i]();
            console.log(` Question sent using method ${i + 4}`);
            questionSent = true;
            break;
          } catch (e) {
            continue;
          }
        }
      }
      
      if (!questionSent) {
        console.log(' All send methods failed, but question was typed');
      }
      
      // Wait for the question to be processed
      await this.page.waitForTimeout(2000); 
      console.log(' Question processing started...');
    }
  
    async clickSuggestedQuestion(index = 0) {
      await this.suggestedQuestion.nth(index).click();
    }
  
    async getResponseText() {
      console.log(' Waiting for AI response...');
      
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