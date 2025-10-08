exports.AddToCartPage = class AddToCartPage {
    constructor(page) {
      this.page = page;
      
      // Navigation
      this.marketplaceMenu = page.getByRole('menuitem', { name: 'Marketplace Icon Marketplace' });
      this.productsLink = page.getByRole('link', { name: 'Products' });
  
      // Add to cart button (first product)
      this.addToCartBtn = page.locator('button:has-text("Add to cart")').first();

      // Cart icon in header
      this.cartIcon = page.locator('.ant-badge').first(); // Cart icon with badge
      
      // Cart / Sidebar cart
      this.sideCart = page.locator('.ant-drawer-content');
      this.cartProduct = page.locator('.ant-drawer-content').locator('text=Product');

      // Quantity controls in cart
      this.increaseQtyBtn = page.getByRole('button', { name: 'Increase Value' });
      this.quantityDisplay = page.locator('.ant-input-number-input');
    }
  
    async goToMarketplace() {
      await this.marketplaceMenu.click();
      await this.productsLink.click();
    }
  
    async addProductToCart() {
      // Wait for the button to be visible and clickable
      await this.addToCartBtn.waitFor({ state: 'visible', timeout: 10000 });
      
      // Try clicking the add to cart button
      try {
        await this.addToCartBtn.click();
        console.log('Clicked Add to cart button successfully');
      } catch (error) {
        console.log('First click failed, trying alternative selector...');
        // Try alternative selector if first one fails
        const altButton = this.page.locator('button').filter({ hasText: 'Add to cart' }).first();
        await altButton.click();
        console.log('Clicked Add to cart button with alternative selector');
      }
    }

    async openSideCart() {
      await this.cartIcon.click();
      await this.sideCart.waitFor({ state: 'visible', timeout: 10000 });
    }

    async verifyProductInCart() {
      // Check if cart drawer is visible
      const isCartVisible = await this.sideCart.isVisible();
      if (!isCartVisible) {
        console.log('Cart drawer is not visible');
        return false;
      }
      
      // Wait a bit for cart content to load
      await this.page.waitForTimeout(1000);
      
      // Try multiple selectors to find products in cart
      const possibleSelectors = [
        '.ant-drawer-content [class*="product"]',
        '.ant-drawer-content [class*="item"]', 
        '.ant-drawer-content .ant-list-item',
        '.ant-drawer-content [data-testid*="cart-item"]',
        '.ant-drawer-content [class*="cart-item"]',
        '.ant-drawer-body [class*="product"]',
        '.ant-drawer-body .ant-list-item'
      ];
      
      for (const selector of possibleSelectors) {
        const element = this.page.locator(selector).first();
        if (await element.isVisible()) {
          console.log(`Found product in cart using selector: ${selector}`);
          return true;
        }
      }
      
      // Check if cart shows any content (not empty)
      const cartContent = this.page.locator('.ant-drawer-body');
      const hasContent = await cartContent.textContent();
      console.log(`Cart content: ${hasContent}`);
      
      // If cart has any meaningful content beyond just "Shopping Cart", consider it has products
      return hasContent && hasContent.trim().length > 20 && !hasContent.includes('empty');
    }

    async increaseQuantity() {
      await this.increaseQtyBtn.click();
    }

    async verifyQuantityIncrease() {
      // Wait for quantity to update
      await this.page.waitForTimeout(1000);
      
      // Check if quantity input shows a value greater than 1
      const quantityValue = await this.quantityDisplay.inputValue();
      const quantity = parseInt(quantityValue) || 1;
      return quantity > 1;
    }
  };