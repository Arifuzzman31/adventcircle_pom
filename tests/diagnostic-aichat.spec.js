const { test, expect } = require('@playwright/test');

test('Diagnostic - AI Chat Navigation', async ({ page }) => {
  console.log('🔍 Starting AI Chat Navigation Diagnostic');
  
  try {
    // Step 1: Login
    await page.goto('https://adventcircle.com/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Login completed');
    
    // Step 2: Check for navigation elements
    console.log('🔍 Looking for navigation elements...');
    
    // Check for various chat-related links
    const chatSelectors = [
      'a[href*="chat"]',
      'text=Chat',
      'text=AI',
      'text=Pastor',
      'text=Talk',
      '.chat',
      '[data-testid*="chat"]'
    ];
    
    for (const selector of chatSelectors) {
      try {
        const element = page.locator(selector).first();
        const count = await element.count();
        if (count > 0) {
          const text = await element.textContent();
          const href = await element.getAttribute('href');
          console.log(`Found element: ${selector} - Text: "${text}" - Href: "${href}"`);
        }
      } catch (error) {
        // Continue checking
      }
    }
    
    // Step 3: Try direct navigation to chat page
    console.log('🔍 Trying direct navigation to chat page...');
    await page.goto('https://adventcircle.com/chat');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    console.log('Current URL after chat navigation:', page.url());
    
    // Check what's on the chat page
    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
    
    // Look for Talk to Pastor AI link
    const pastorSelectors = [
      'text=Talk To Pastor Ai',
      'text=Pastor',
      'text=AI',
      'a[href*="adv-ai"]',
      'button:has-text("Pastor")',
      'button:has-text("AI")'
    ];
    
    console.log('🔍 Looking for Pastor AI elements...');
    for (const selector of pastorSelectors) {
      try {
        const element = page.locator(selector).first();
        const count = await element.count();
        if (count > 0) {
          const text = await element.textContent();
          const href = await element.getAttribute('href');
          console.log(`Found Pastor element: ${selector} - Text: "${text}" - Href: "${href}"`);
        }
      } catch (error) {
        // Continue checking
      }
    }
    
    // Step 4: Try direct navigation to AI chat
    console.log('🔍 Trying direct navigation to AI chat...');
    await page.goto('https://adventcircle.com/adv-ai/new');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    
    console.log('Current URL after AI navigation:', page.url());
    
    // Look for chat input elements
    const inputSelectors = [
      'input[placeholder*="Ask"]',
      'textarea[placeholder*="Ask"]',
      'input[type="text"]',
      '.chat-input',
      '[data-testid="chat-input"]',
      'textbox'
    ];
    
    console.log('🔍 Looking for chat input elements...');
    for (const selector of inputSelectors) {
      try {
        const element = page.locator(selector).first();
        const count = await element.count();
        if (count > 0) {
          const placeholder = await element.getAttribute('placeholder');
          const isVisible = await element.isVisible();
          console.log(`Found input: ${selector} - Placeholder: "${placeholder}" - Visible: ${isVisible}`);
        }
      } catch (error) {
        // Continue checking
      }
    }
    
    // Take screenshot for analysis
    await page.screenshot({ path: 'aichat-diagnostic.png', fullPage: true });
    console.log('📸 Screenshot saved as aichat-diagnostic.png');
    
  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
    try {
      await page.screenshot({ path: 'aichat-diagnostic-error.png', fullPage: true });
    } catch (screenshotError) {
      console.log('Could not take error screenshot');
    }
    throw error;
  }
});
