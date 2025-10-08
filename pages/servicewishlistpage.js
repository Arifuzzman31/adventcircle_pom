exports.ServiceWishlistPage = class ServiceWishlistPage {
    constructor(page) {
      this.page = page;
  
      // Navigation
      this.seeAllRecommendedService = page.getByRole('link', { name: 'See All' }).nth(1);
      this.addToWishlistBtn = page.getByRole('link', { name: 'heart SmartFix Electronics' }).getByRole('button');
      this.wishlistLink = page.getByRole('link', { name: 'Wishlist' });
  
      // Wishlist / Service validation
      this.servicesTab = page.locator('div').filter({ hasText: /^Services$/ });
      this.addedServiceImg = page.getByRole('img', { name: 'Not Found' }); // placeholder, update if changed
    }
  
    async goToAllRecommendedServices() {
      await this.seeAllRecommendedService.click();
    }
  
    async addServiceToWishlist() {
      await this.addToWishlistBtn.click();
    }
  
    async goToWishlist() {
      await this.wishlistLink.click();
    }
  
    async openServicesTab() {
      await this.servicesTab.click();
    }
  
    async isServiceAdded() {
      // Wait for image or element to appear, adjust locator if real service name is shown
      return await this.addedServiceImg.isVisible();
    }
  };
  