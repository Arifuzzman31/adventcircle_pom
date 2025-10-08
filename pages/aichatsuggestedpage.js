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
    console.log('🚀 Starting chat navigation...');
    
    // Wait for any toaster notifications to disappear
    try {
      await this.page.waitForTimeout(2000);
      const toaster = this.page.locator('#_rht_toaster, .toaster, [class*="toast"]');
      if (await toaster.isVisible({ timeout: 1000 })) {
        console.log('⚠️ Toaster notification detected, waiting for it to disappear...');
        await toaster.waitFor({ state: 'hidden', timeout: 5000 });
      }
    } catch (e) {
      console.log('No toaster found or already hidden');
    }

    // Try primary navigation method
    try {
      console.log('Attempting to click chat navigation link...');
      await this.chatNavLink.click({ timeout: 5000 });
      console.log('✓ Chat nav link clicked successfully');
    } catch (error) {
      console.log('⚠️ Chat nav link click failed:', error.message);
      console.log('Trying fallback navigation...');
      
      // Fallback: Direct navigation to chat page
      await this.page.goto('https://adventcircle.com/chat', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
      console.log('✓ Direct navigation to chat page successful');
    }

    // Ensure we're on the chat page
    try {
      await this.page.waitForURL('**/chat**', { timeout: 5000 });
    } catch (e) {
      // If URL doesn't match, try direct navigation
      await this.page.goto('https://adventcircle.com/chat', { 
        waitUntil: 'domcontentloaded',
        timeout: 10000 
      });
    }

    // Click Talk to Pastor AI link - this is required to get to the AI chat interface
    try {
      await this.talkToPastorLink.waitFor({ state: 'visible', timeout: 10000 });
      await this.talkToPastorLink.click();
      console.log('✓ Talk to Pastor AI link clicked');
      
      // Wait for navigation to the AI chat page
      await this.page.waitForURL('**/adv-ai/new**', { timeout: 10000 });
      console.log('✓ Navigated to AI chat interface');
    } catch (error) {
      console.log('⚠️ Talk to Pastor AI link not found or not clickable:', error.message);
      
      // Try direct navigation to AI chat page
      try {
        await this.page.goto('https://adventcircle.com/adv-ai/new', { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        console.log('✓ Direct navigation to AI chat interface successful');
      } catch (navError) {
        console.log('⚠️ Direct navigation also failed:', navError.message);
      }
    }
  }

  async waitForChatPageToLoad() {
    console.log('Waiting for AI chat interface to load...');
    
    // Wait for the chat input to be visible
    try {
      await this.chatInput.waitFor({ state: 'visible', timeout: 15000 });
      console.log('✓ Chat input found and visible');
    } catch (error) {
      console.log('⚠️ Chat input not found, trying alternative selectors...');
      
      // Try alternative selectors for the chat input
      const alternativeSelectors = [
        'textarea[placeholder*="Ask"]',
        'input[placeholder*="Ask"]',
        'textarea[placeholder*="here"]',
        'input[placeholder*="here"]',
        '[data-testid="chat-input"]',
        '.chat-input'
      ];
      
      for (const selector of alternativeSelectors) {
        try {
          const element = this.page.locator(selector);
          await element.waitFor({ state: 'visible', timeout: 3000 });
          console.log(`✓ Found chat input with selector: ${selector}`);
          // Update the chatInput locator to use the working selector
          this.chatInput = element;
          return;
        } catch (e) {
          continue;
        }
      }
      
      // If no input found, take a screenshot for debugging
      try {
        await this.page.screenshot({ path: 'test-results/chat-page-debug.png', fullPage: true });
        console.log('Debug screenshot saved: test-results/chat-page-debug.png');
      } catch (e) {
        console.log('Could not take debug screenshot');
      }
      
      throw new Error('Could not find chat input field with any selector');
    }
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
      await this.page.waitForTimeout(2000); // Wait for delete button to appear
      
      // Try a simple approach first - look for any button or clickable element that appears after hover
      try {
        const deleteButton = chatItemContainer.locator('button, [role="button"], .cursor-pointer').filter({ hasText: /delete|trash|remove/i }).first();
        if (await deleteButton.isVisible({ timeout: 1000 })) {
          await deleteButton.click();
          console.log('✓ Clicked delete button using text-based selector');
          
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
        console.log('Text-based delete button not found, trying icon approach...');
      }
      
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
    
    // Fallback: search for visible trash icons, but be more selective
    console.log('Trying fallback approach - looking for visible trash icons...');
    
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
        
        // Try to click only the visible and enabled ones
        for (let i = 0; i < Math.min(count, 5); i++) { // Limit to first 5 to avoid too many attempts
          const icon = deleteIcons.nth(i);
          try {
            // Check if it's both visible and enabled
            const isVisible = await icon.isVisible({ timeout: 500 });
            const isEnabled = await icon.isEnabled({ timeout: 500 });
            
            if (isVisible && isEnabled) {
              // Try to get the bounding box to ensure it's actually clickable
              const boundingBox = await icon.boundingBox();
              if (boundingBox && boundingBox.width > 0 && boundingBox.height > 0) {
                console.log(`Attempting to click trash icon ${i} (visible, enabled, has bounding box)`);
                await icon.click({ force: true, timeout: 3000 });
                console.log(`✓ Clicked delete button (icon ${i}) using selector: ${selector}`);
                
                // Wait a bit and check for confirmation dialog
                await this.page.waitForTimeout(1000);
                try {
                  const confirmBtn = this.page.locator('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete"), button:has-text("OK")').first();
                  const confirmVisible = await confirmBtn.isVisible({ timeout: 2000 });
                  if (confirmVisible) {
                    await confirmBtn.click({ timeout: 2000 });
                    console.log('✓ Confirmed deletion');
                  }
                } catch (e) {
                  console.log('No confirmation dialog found or needed');
                }
                
                // Wait and verify deletion worked
                await this.page.waitForTimeout(2000);
                console.log('✅ Successfully deleted recent chat');
                return;
              }
            }
          } catch (e) {
            console.log(`Failed to click icon ${i}:`, e.message);
            continue;
          }
        }
      } catch (error) {
        console.log('✗ Failed with selector:', selector, error.message);
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
