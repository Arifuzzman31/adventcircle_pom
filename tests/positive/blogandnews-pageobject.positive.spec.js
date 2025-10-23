const { test, expect } = require('@playwright/test');
const { BlogAndNewsPage } = require('../../pages/blogandnewspage');

test.describe('Blog & News - Page Object Tests', () => {

    test('positive - BN-T2 - User can browse blog and news content using page object', async ({ page }) => {
        console.log('  TEST START: User can browse blog and news content using page object');
        
        // Initialize page object
        const blogNewsPage = new BlogAndNewsPage(page);
        
        try {
            // Execute complete blog and news workflow using page object
            const result = await blogNewsPage.completeBlogNewsWorkflow();
            
            // Verify the workflow was successful
            expect(result.success).toBe(true);
            expect(result.articleCount).toBeGreaterThan(0);
            expect(result.firstBlogUrl).toContain('adventcircle.com');
            expect(result.secondBlogUrl).toContain('adventcircle.com');
            
            console.log('  SUCCESS: Blog and news browsing completed successfully with page object!');
            console.log('  Page Object Test Results:');
            console.log(`   - Articles Available: ${result.articleCount}`);
            console.log(`   - Blog Page URL: ${result.blogPageUrl}`);
            console.log(`   - First Blog URL: ${result.firstBlogUrl}`);
            console.log(`   - Second Blog URL: ${result.secondBlogUrl}`);
            console.log(`   - Test Status: ${result.success ? 'PASSED' : 'FAILED'}`);
            
        } catch (error) {
            console.log('  ERROR in page object blog and news test:', error.message);
            
            // Take screenshot for debugging
            try {
                await page.screenshot({ 
                    path: `test-results/blog-news-pageobject-error-${Date.now()}.png`, 
                    fullPage: true 
                });
                console.log(' 📷 Debug screenshot taken');
            } catch (screenshotError) {
                console.log(' Could not take screenshot:', screenshotError.message);
            }
            
            throw error;
        }
        
        console.log('  TEST COMPLETED: Blog and news page object test finished successfully');
    });

});