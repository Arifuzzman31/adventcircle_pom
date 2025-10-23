class BlogAndNewsPage {
    constructor(page) {
        this.page = page;
        
        // Login elements
        this.loginLink = page.getByRole('link', { name: 'Login' });
        this.emailField = page.getByRole('textbox', { name: '* Email Address' });
        this.passwordField = page.getByRole('textbox', { name: '* Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        
        // Blog & News navigation
        this.BlogAndNewsPageLink = page.getByRole('link', { name: 'Blog & News' });
        
        // Blog content elements
        this.blogArticles = page.locator('a[href*="blog"], a[href*="news"], [role="link"]:has-text("News"), [role="link"]:has-text("Overlay")');
        this.firstArticle = this.blogArticles.first();
        this.blogContentLocator = page.locator('article, .content, .blog-content, main, [class*="content"]');
        this.secondArticle = this.blogArticles.nth(1);
        this.textContent = page.locator('text=/\\w{20,}/'); // Substantial text content
    }

    async navigateToHomepage() {
        console.log(' Navigating to homepage');
        await this.page.goto('https://adventcircle.com/');
        await this.page.waitForLoadState('networkidle');
        console.log(' Homepage loaded');
    }

    async loginAsUser() {
        console.log(' Logging in as user');
        await this.loginLink.click();
        await this.emailField.fill('ratulsikder104@gmail.com');
        await this.passwordField.fill('Ratul@104!');
        await this.loginButton.click();
        await this.page.waitForTimeout(3000);
        console.log(' Login completed');
    }

    async navigateToBlogAndNews() {
        console.log(' Step 2: Navigating to Blog & News section');
        await this.BlogAndNewsPageLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
        
        // Verify Blog & News page loaded properly
        const currentUrl = this.page.url();
        console.log(` Current URL: ${currentUrl}`);
        
        if (!currentUrl.includes('blog')) {
            throw new Error('Blog & News page did not load properly');
        }
        console.log(' Blog & News page loaded successfully');
        return currentUrl;
    }

    async verifyBlogArticlesExist() {
        console.log(' Step 3: Verifying page content is loaded properly');
        const articleCount = await this.blogArticles.count();
        console.log(` Found ${articleCount} blog/news articles`);
        
        if (articleCount === 0) {
            throw new Error('No blog or news articles found on the page');
        }
        console.log(' Blog and news content loaded properly');
        return articleCount;onabort
    }

    async clickFirstBlog() {
        console.log(' Step 4: Clicking on first blog article');
        const firstArticleText = await this.firstArticle.textContent();
        console.log(` First article: "${firstArticleText?.substring(0, 50)}..."`);
        
        await this.firstArticle.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
        
        return this.page.url();
    }

    async verifyBlogContent(blogNumber = 'first') {
        console.log(` Step 5: Verifying ${blogNumber} blog content loads properly`);
        
        const blogUrl = this.page.url();
        console.log(` ${blogNumber} blog URL: ${blogUrl}`);
        
        // Check if blog content is present
        const blogContent = await this.blogContentLocator.count();
        const hasText = await this.textContent.count();
        
        if (blogContent === 0 && hasText < 5) {
            throw new Error(`${blogNumber} blog content did not load properly`);
        }
        console.log(` ${blogNumber} blog content loaded properly`);
        return blogUrl;
    }

    async goBackToBlogList() {
        console.log(' Step 6: Going back to blog list');
        await this.page.goBack();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        
        // Alternative: Navigate directly if go back doesn't work
        if (!this.page.url().includes('blog')) {
            console.log(' Fallback: Navigating directly to blogs page');
            await this.page.goto('https://adventcircle.com/blogs');
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(3000);
        }
        console.log(' Returned to blog list');
    }

    async clickSecondBlog() {
        console.log(' Step 7: Clicking on second blog article');
        
        // Get updated list of articles after returning
        const articleCount = await this.blogArticles.count();
        
        if (articleCount < 2) {
            console.log(' Warning: Less than 2 articles available, using first article again');
            await this.firstArticle.click();
        } else {
            const secondArticleText = await this.secondArticle.textContent();
            console.log(` Second article: "${secondArticleText?.substring(0, 50)}..."`);
            await this.secondArticle.click();
        }
        
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
        
        return this.page.url();
    }

    async completeBlogNewsWorkflow() {
        console.log(' Starting complete blog and news workflow');
        
        try {
            // Step 1: Navigate and login
            await this.navigateToHomepage();
            await this.loginAsUser();
            
            // Step 2: Navigate to Blog & News
            const blogPageUrl = await this.navigateToBlogAndNews();
            
            // Step 3: Verify content loaded
            const articleCount = await this.verifyBlogArticlesExist();
            
            // Step 4: Click first blog
            const firstBlogUrl = await this.clickFirstBlog();
            
            // Step 5: Verify first blog content
            await this.verifyBlogContent('First');
            
            // Step 6: Go back to list
            await this.goBackToBlogList();
            
            // Step 7: Click second blog
            const secondBlogUrl = await this.clickSecondBlog();
            
            // Step 8: Verify second blog content
            await this.verifyBlogContent('Second');
            
            console.log(' SUCCESS: Blog and news workflow completed successfully');
            console.log(' Blog & News Test Summary:');
            console.log('   Login: Completed successfully');
            console.log('   Blog & News Page: Loaded properly');
            console.log(`   Articles Found: ${articleCount} articles available`);
            console.log('   First Blog: Content loaded and verified');
            console.log('   Navigation: Successfully returned to blog list');
            console.log('   Second Blog: Content loaded and verified');
            console.log(`   First Blog URL: ${firstBlogUrl}`);
            console.log(`   Second Blog URL: ${secondBlogUrl}`);
            
            return {
                success: true,
                articleCount,
                firstBlogUrl,
                secondBlogUrl,
                blogPageUrl
            };
            
        } catch (error) {
            console.log(` Error in blog and news workflow: ${error.message}`);
            
            // Take screenshot for debugging
            await this.page.screenshot({ 
                path: `test-results/blog-news-workflow-error-${Date.now()}.png`, 
                fullPage: true 
            });
            
            throw error;
        }
    }
}

module.exports = { BlogAndNewsPage };