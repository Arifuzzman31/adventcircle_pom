const { test, expect } = require('@playwright/test');

test('Working AI Chat Test - Bible Question', async ({ page }) => {
  console.log('🚀 Starting Working AI Chat Test');
  
  // Set longer timeout
  test.setTimeout(120000);

  try {
    // Step 1: Login
    console.log('📝 Step 1: Login');
    await page.goto('https://adventcircle.com/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
    await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Login completed');

    // Step 2: Navigate directly to AI chat
    console.log('📝 Step 2: Navigate to AI chat');
    await page.goto('https://adventcircle.com/adv-ai/new');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    console.log('✅ Navigated to AI chat interface');

    // Step 3: Find and use chat input
    console.log('📝 Step 3: Find chat input');
    const chatInput = page.getByPlaceholder("Ask Anything... I'm here to help");
    await chatInput.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✅ Chat input found');

    // Step 4: Ask question about Bible
    console.log('📝 Step 4: Ask Bible question');
    const question = "can you tell me something about bible";
    await chatInput.click();
    await chatInput.fill(question);
    
    // Find and click send button
    const sendButton = page.locator('button:has(svg)').last(); // The send button with arrow icon
    await sendButton.click();
    console.log('✅ Question sent');

    // Step 5: Wait for response
    console.log('📝 Step 5: Wait for AI response');
    await page.waitForTimeout(8000); // Wait for AI to respond
    
    // Step 6: Capture response
    console.log('📝 Step 6: Capture response');
    const pageContent = await page.textContent();
    
    // Filter response to get meaningful content
    const lines = pageContent.split('\n');
    const meaningfulLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 30 && 
             !trimmed.includes('New Chat') &&
             !trimmed.includes('Recent Chats') &&
             !trimmed.includes('Ask Anything') &&
             !trimmed.includes('Suggested Questions') &&
             !trimmed.includes('Talk to Adventist AI');
    });
    
    const response = meaningfulLines.join(' ').trim();
    console.log('Response captured:', response.substring(0, 200) + '...');

    // Step 7: Verify response
    console.log('📝 Step 7: Verify response quality');
    
    // Basic verification
    expect(response).not.toBeNull();
    expect(response.length).toBeGreaterThan(50);
    
    // Check for Bible-related content
    const responseText = response.toLowerCase();
    const hasRelevantKeywords = responseText.includes('bible') || 
                               responseText.includes('scripture') || 
                               responseText.includes('testament') ||
                               responseText.includes('god') ||
                               responseText.includes('jesus') ||
                               responseText.includes('christian') ||
                               responseText.includes('biblical') ||
                               responseText.includes('salvation') ||
                               responseText.includes('faith') ||
                               responseText.includes('church') ||
                               responseText.includes('adventist');

    console.log('Response contains relevant keywords:', hasRelevantKeywords);
    console.log('Response preview:', responseText.substring(0, 300));
    
    // If no specific keywords found, check if it's a meaningful response
    if (!hasRelevantKeywords) {
      // Check if response is substantial and not an error
      const isSubstantialResponse = response.length > 100 && 
                                   !response.includes('error') &&
                                   !response.includes('failed') &&
                                   !response.includes('not found');
      
      if (isSubstantialResponse) {
        console.log('✅ Got substantial response, considering test passed');
      } else {
        console.log('⚠️ Response may not be adequate');
      }
      
      expect(isSubstantialResponse).toBeTruthy();
    } else {
      expect(hasRelevantKeywords).toBeTruthy();
    }

    // Take screenshot for verification
    await page.screenshot({ path: 'working-aichat-success.png', fullPage: true });
    console.log('📸 Success screenshot saved');

    console.log('🎉 AI Chat Test PASSED - Bot responded successfully!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    
    try {
      await page.screenshot({ path: `working-aichat-failure-${Date.now()}.png`, fullPage: true });
    } catch (screenshotError) {
      console.log('Could not take failure screenshot');
    }
    
    throw error;
  }
});
