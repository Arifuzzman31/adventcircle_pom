const { test, expect } = require('@playwright/test');

test.describe('Blog & News - Positive Tests', () => {

    test('positive - BN-T1 - User can browse blog and news content successfully', async ({ page }) => {
        console.log('  TEST START: User can browse blog and news content successfully');
        
        try {
            // Step 1: Navigate to homepage and login
            console.log('Step 1: Navigating to homepage and logging in');
            await page.goto('https://adventcircle.com/');
            await page.getByRole('link', { name: 'Login' }).click();
            await page.getByRole('textbox', { name: '* Email Address' }).fill('ratulsikder104@gmail.com');
            await page.getByRole('textbox', { name: '* Password' }).fill('Ratul@104!');
            await page.getByRole('button', { name: 'Login' }).click();
            await page.waitForTimeout(3000);
            console.log('  Login completed');
            
            // Step 2: Click on Blog & News
            console.log(' Step 2: Navigating to Blog & News section');
            await page.getByRole('link', { name: 'Blog & News' }).click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);
            
            // Verify Blog & News page loaded properly
            const currentUrl = page.url();
            console.log(` Current URL: ${currentUrl}`);
            
            if (!currentUrl.includes('blog')) {
                throw new Error('Blog & News page did not load properly');
            }
            console.log('  Blog & News page loaded successfully');
            
            // Step 3: Make sure page and content load properly
            console.log(' Step 3: Verifying page content is loaded properly');
            
            // Check for blog/news articles on the page
            const blogArticles = page.locator('a[href*="blog"], a[href*="news"], [role="link"]:has-text("News"), [role="link"]:has-text("Overlay")');
            const articleCount = await blogArticles.count();
            console.log(` Found ${articleCount} blog/news articles`);
            
            if (articleCount === 0) {
                throw new Error('No blog or news articles found on the page');
            }
            console.log('  Blog and news content loaded properly');
            
            // Step 4: Click on first blog/news article
            console.log(' Step 4: Clicking on first blog article');
            const firstArticle = blogArticles.first();
            const firstArticleText = await firstArticle.textContent();
            console.log(` First article: "${firstArticleText?.substring(0, 50)}..."`);
            
            await firstArticle.click();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);
            
            // Step 5: Verify first blog content loads properly
            console.log(' Step 5: Verifying first blog content loads properly');
            
            const firstBlogUrl = page.url();
            console.log(` First blog URL: ${firstBlogUrl}`);
            
            // Check if blog content is present
            const blogContent = await page.locator('article, .content, .blog-content, main, [class*="content"]').count();
            const hasText = await page.locator('text=/\\w{20,}/').count(); // Look for substantial text content
            
            if (blogContent === 0 && hasText < 5) {
                throw new Error('First blog content did not load properly');
            }
            console.log('  First blog content loaded properly');
            
            // Step 6: Go back to blog list
            console.log(' Step 6: Going back to blog list');
            await page.goBack();
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000);
            
            // Alternative: Navigate directly if go back doesn't work
            if (!page.url().includes('blog')) {
                console.log(' Fallback: Navigating directly to blogs page');
                await page.goto('https://adventcircle.com/blogs');
                await page.waitForLoadState('domcontentloaded');
                await page.waitForTimeout(3000);
            }
            console.log('  Returned to blog list');
            
            // Step 7: Click on another blog article (second one)
            console.log(' Step 7: Clicking on second blog article');
            
            // Get updated list of articles after returning
            const blogArticles2 = page.locator('a[href*="blog"], a[href*="news"], [role="link"]:has-text("News"), [role="link"]:has-text("Overlay")');
            const articleCount2 = await blogArticles2.count();
            
            if (articleCount2 < 2) {
                console.log(' Warning: Less than 2 articles available, using first article again');
                await blogArticles2.first().click();
            } else {
                const secondArticle = blogArticles2.nth(1);
                const secondArticleText = await secondArticle.textContent();
                console.log(` Second article: "${secondArticleText?.substring(0, 50)}..."`);
                await secondArticle.click();
            }
            
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(3000);
            
            // Step 8: Verify second blog content loads properly
            console.log(' Step 8: Verifying second blog content loads properly');
            
            const secondBlogUrl = page.url();
            console.log(` Second blog URL: ${secondBlogUrl}`);
            
            // Check if second blog content is present
            const secondBlogContent = await page.locator('article, .content, .blog-content, main, [class*="content"]').count();
            const hasText2 = await page.locator('text=/\\w{20,}/').count();
            
            if (secondBlogContent === 0 && hasText2 < 5) {
                console.log('  FAILURE: Second blog content did not load properly');
                
                // Take screenshot for debugging
                await page.screenshot({ 
                    path: `test-results/second-blog-content-failed-${Date.now()}.png`, 
                    fullPage: true 
                });
                
                throw new Error('Second blog content did not load properly');
            }
            
            console.log('  Second blog content loaded properly');
            
            // Step 9: Test passes - all content loaded successfully
            console.log('  SUCCESS: Blog and news browsing completed successfully!');
            console.log('  Blog & News Test Summary:');
            console.log('    Login: Completed successfully');
            console.log('    Blog & News Page: Loaded properly');
            console.log(`    Articles Found: ${articleCount} articles available`);
            console.log('    First Blog: Content loaded and verified');
            console.log('    Navigation: Successfully returned to blog list');
            console.log('    Second Blog: Content loaded and verified');
            console.log(`    First Blog URL: ${firstBlogUrl}`);
            console.log(`    Second Blog URL: ${secondBlogUrl}`);
            
            // Final verification assertions
            expect(articleCount).toBeGreaterThan(0);
            expect(firstBlogUrl).toContain('adventcircle.com');
            expect(secondBlogUrl).toContain('adventcircle.com');
            
        } catch (error) {
            console.log('  ERROR in blog and news test:', error.message);
            
            // Take screenshot for debugging
            try {
                await page.screenshot({ 
                    path: `test-results/blog-news-error-${Date.now()}.png`, 
                    fullPage: true 
                });
                console.log('  Debug screenshot taken');
            } catch (screenshotError) {
                console.log(' Could not take screenshot:', screenshotError.message);
            }
            
            throw error;
        }
        
        console.log('  TEST COMPLETED: Blog and news test finished successfully');
    });

});
