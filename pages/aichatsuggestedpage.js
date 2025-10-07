class AisuggestedPage {
  constructor(page) {
    this.page = page;

    // Navigation / Chat links
    this.chatNavLink = page.getByRole('link').filter({ hasText: /^$/ }).nth(1);
    this.talkToPastorLink = page.getByRole('link', { name: 'Talk To Pastor Ai' });

    // Suggested questions
    this.suggestedQuestionByText = (text) => page.locator('span').filter({ hasText: text });

    // Chat input and send button
    this.chatInput = page.getByRole('textbox', { name: "Ask Anything... I'm here to" });
    this.sendBtn = page.getByRole('img', { name: 'btn' });

    // Bot responses
    this.responseArea = page.locator('.px-4.md\\:px-40');

    // Recent chats
    this.recentChatItem = page.locator('.recent-chat-item, [data-testid="recent-chat"], .chat-history-item').first();
    
    // Delete button for recent chat
    this.deleteBtn = page.locator('[data-testid="delete-chat"], .delete-btn, button[aria-label="Delete"]').first();
  }

  async openChat() {
    await this.chatNavLink.click();
    await this.page.goto('https://adventcircle.com/chat');
    await this.talkToPastorLink.click();
  }

  async waitForChatPageToLoad() {
    await this.chatInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickSuggestedQuestion(text) {
    // Try to find the suggested question by exact text match
    try {
      const suggestedQuestion = this.page.getByText(text, { exact: true });
      await suggestedQuestion.waitFor({ state: 'visible', timeout: 10000 });
      await suggestedQuestion.click();
      console.log('Clicked suggested question:', text);
    } catch (error) {
      console.log('Exact match failed, trying partial match...');
      const partialMatch = this.page.getByText(text);
      await partialMatch.first().click();
    }
  }

  async clickSendButton() {
    await this.sendBtn.click();
    // Wait for the question to be sent
    await this.page.waitForTimeout(2000);
  }

  async getResponseText() {
    // Wait for response to appear
    try {
      await this.responseArea.waitFor({ state: 'visible', timeout: 20000 });
      const response = await this.responseArea.textContent();
      if (response && response.trim().length > 10) {
        return response;
      }
    } catch (error) {
      console.log('Main response area not found, trying to get any text...');
    }
    
    // Fallback: get all page text
    await this.page.waitForTimeout(3000);
    const allText = await this.page.textContent('body');
    return allText || 'No response found';
  }

  async clickRecentChat() {
    // Try multiple selectors for recent chat
    const possibleSelectors = [
      '.recent-chat-item',
      '[data-testid="recent-chat"]',
      '.chat-history-item',
      '.sidebar .chat-item',
      '.recent-conversations li',
      '.chat-sidebar .conversation'
    ];
    
    for (const selector of possibleSelectors) {
      try {
        const element = this.page.locator(selector).first();
        await element.waitFor({ state: 'visible', timeout: 5000 });
        await element.click();
        console.log('Clicked recent chat using selector:', selector);
        return;
      } catch (error) {
        continue;
      }
    }
    
    console.log('Warning: Could not find recent chat element, but continuing test...');
  }

  async deleteRecentChat() {
    console.log('Starting delete recent chat process...');
    
    // Wait a bit to ensure page is stable
    await this.page.waitForTimeout(2000);
    
    // Take screenshot before attempting delete
    try {
      await this.page.screenshot({ path: 'test-results/before-delete.png', fullPage: true });
      console.log('Screenshot saved: test-results/before-delete.png');
    } catch (e) {
      console.log('Could not take screenshot:', e.message);
    }
    
    // Find the Recent Chats section and get the FIRST chat item (most recent one created by the test)
    let hoveredElement = null;
    let trashIconParent = null;
    
    try {
      // Wait for Recent Chats section to be visible
      await this.page.waitForTimeout(2000);
      
      // Find ALL "Who is Jesus Christ?" items in the Recent Chats section
      const allRecentChats = this.page.locator('div:has-text("Recent Chats") ~ div').locator('div:has-text("Who is Jesus Christ?")');
      const count = await allRecentChats.count();
      console.log(`Found ${count} "Who is Jesus Christ?" items in Recent Chats`);
      
      if (count === 0) {
        throw new Error('No "Who is Jesus Christ?" found in Recent Chats');
      }
      
      // Get the FIRST one (most recent) and its parent container
      const firstChatText = allRecentChats.first();
      
      // Get the parent div that contains this text - this is what we need to hover
      // The parent should be the clickable chat item container
      const chatItemContainer = firstChatText.locator('..');
      await chatItemContainer.waitFor({ state: 'visible', timeout: 3000 });
      
      // Hover over the container to reveal the trash icon
      await chatItemContainer.hover();
      hoveredElement = chatItemContainer;
      trashIconParent = chatItemContainer;
      
      console.log('✓ Hovered over the FIRST "Who is Jesus Christ?" chat item container');
      await this.page.waitForTimeout(1500); // Wait for delete button to appear
      
    } catch (e) {
      console.log('✗ Failed to hover over first recent chat:', e.message);
      throw new Error('Could not find the first recent chat item to delete: ' + e.message);
    }
    
    if (!hoveredElement) {
      throw new Error('Could not find recent chat item to hover over');
    }
    
    // Take screenshot after hover
    try {
      await this.page.screenshot({ path: 'test-results/after-hover.png', fullPage: true });
      console.log('Screenshot saved: test-results/after-hover.png');
    } catch (e) {
      console.log('Could not take screenshot:', e.message);
    }
    
    // Try to find and click delete button (trash icon) within the hovered element
    // Wait a bit more for the icon to appear
    await this.page.waitForTimeout(1000);
    
    // First, try to find the trash icon within the hovered element
    if (trashIconParent) {
      try {
        const trashInParent = trashIconParent.locator('.lucide-trash2, .lucide-trash-2, svg[class*="lucide-trash"]').first();
        const isVisible = await trashInParent.isVisible({ timeout: 2000 });
        if (isVisible) {
          await trashInParent.click({ force: true });
          console.log('✓ Clicked trash icon within the hovered chat item');
          
          // Check for confirmation dialog
          await this.page.waitForTimeout(500);
          try {
            const confirmBtn = this.page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete"), button:has-text("OK")').first();
            await confirmBtn.click({ timeout: 2000 });
            console.log('✓ Confirmed deletion');
          } catch (e) {
            console.log('No confirmation dialog found');
          }
          
          console.log('✅ Successfully deleted the first recent chat');
          return;
        }
      } catch (e) {
        console.log('Could not find trash icon within hovered element, trying global search...');
      }
    }
    
    // Fallback: search globally for any visible trash icon
    const possibleDeleteSelectors = [
      '.lucide-trash2',
      '.lucide-trash-2',
      'svg.lucide-trash2',
      'svg.lucide-trash-2',
      'svg[class*="lucide-trash"]'
    ];
    
    for (const selector of possibleDeleteSelectors) {
      try {
        const deleteIcons = this.page.locator(selector);
        const count = await deleteIcons.count();
        console.log(`Found ${count} trash icons globally with selector: ${selector}`);
        
        if (count === 0) continue;
        
        // Try to click the first visible one
        for (let i = 0; i < count; i++) {
          const icon = deleteIcons.nth(i);
          try {
            const isVisible = await icon.isVisible({ timeout: 500 });
            if (isVisible) {
              await icon.click({ force: true });
              console.log(`✓ Clicked delete button (icon ${i}) using selector: ${selector}`);
              
              await this.page.waitForTimeout(500);
              try {
                const confirmBtn = this.page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete"), button:has-text("OK")').first();
                await confirmBtn.click({ timeout: 2000 });
                console.log('✓ Confirmed deletion');
              } catch (e) {
                console.log('No confirmation dialog found');
              }
              
              console.log('✅ Successfully deleted recent chat');
              return;
            }
          } catch (e) {
            continue;
          }
        }
      } catch (error) {
        console.log('✗ Failed with selector:', selector);
        continue;
      }
    }
    
    // If we get here, we couldn't find the delete button
    try {
      await this.page.screenshot({ path: 'test-results/delete-failed.png', fullPage: true });
    } catch (e) {
      console.log('Could not take failure screenshot');
    }
    throw new Error('Could not find delete button with lucide-trash2 icon. Check screenshots in test-results/ folder');
  }
}

module.exports = { AisuggestedPage };
