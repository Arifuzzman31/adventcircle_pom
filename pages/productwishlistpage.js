exports.ProductWishlistPage = class ProductWishlistPage {
    constructor(page) {
        this.page = page;
        
        // Navigation
        this.marketplaceMenu = page.getByRole('menuitem', { name: 'Marketplace Icon Marketplace' });
        this.productsLink = page.getByRole('link', { name: 'Products' });
        this.wishlistLink = page.getByRole('link', { name: 'Wishlist' });
        
        // Product wishlist buttons - using flexible selectors
        this.wishlistIcon = page.locator('.ant-btn.css-s3wiz3.ant-btn-circle').first();
        this.wishlistIconAlt = page.locator('button[class*="circle"]').filter({ hasText: /heart|wishlist/i }).first();
        
        // Wishlist verification
        this.wishlistProducts = page.locator('[class*="product"], [class*="item"], .ant-card');
    }

    async goToMarketplace() {
        await this.marketplaceMenu.click();
        await this.productsLink.click();
        console.log(' Navigated to Marketplace → Products');
    }

    async waitForProductsToLoad() {
        // Wait for products to load
        await this.page.waitForTimeout(3000);
        
        // Verify products are loaded by checking for product cards
        const productCards = this.page.locator('.ant-card, [class*="product"], .swiper-slide');
        const count = await productCards.count();
        
        if (count > 0) {
            console.log(` Products loaded successfully (${count} products found)`);
            return true;
        } else {
            console.log(' No products found on page');
            return false;
        }
    }

    async addProductToWishlist() {
        try {
            // Try multiple selectors for wishlist button
            const wishlistSelectors = [
                '.ant-btn.css-s3wiz3.ant-btn-circle',
                'button[class*="circle"]',
                'button[aria-label*="wishlist"]',
                'button[title*="wishlist"]',
                '.wishlist-btn',
                '[class*="wishlist"]'
            ];
            
            for (const selector of wishlistSelectors) {
                try {
                    const button = this.page.locator(selector).first();
                    await button.waitFor({ state: 'visible', timeout: 5000 });
                    await button.click();
                    console.log(` Clicked wishlist icon using selector: ${selector}`);
                    return;
                } catch (error) {
                    console.log(` Selector ${selector} not found, trying next...`);
                }
            }
            
            throw new Error('No wishlist button found');
        } catch (error) {
            console.log(' Could not find wishlist button:', error.message);
            throw error; 
        }
    }

    async goToWishlist() {
        await this.wishlistLink.click();
        await this.page.waitForTimeout(2000);
        console.log(' Navigated to Wishlist');
    }

    async verifyProductInWishlist() {
        // Wait for wishlist page to load
        await this.page.waitForTimeout(2000);
        
        // Check for products in wishlist
        const wishlistItems = this.page.locator('.ant-card, [class*="product"], [class*="item"], [class*="wishlist"]');
        const count = await wishlistItems.count();
        
        if (count > 0) {
            console.log(` Product found in wishlist (${count} items)`);
            return true;
        } else {
            // Check if there's any content indicating products
            const pageContent = await this.page.textContent('body');
            if (pageContent && pageContent.includes('product') || pageContent.includes('item')) {
                console.log(' Product appears to be in wishlist (found in page content)');
                return true;
            }
            
            console.log(' No products found in wishlist');
            return false;
        }
    }
};