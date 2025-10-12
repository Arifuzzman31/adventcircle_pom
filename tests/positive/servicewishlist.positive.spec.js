const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage');
const { ServiceWishlistPage } = require('../../pages/servicewishlistpage');

test('Add service to wishlist and verify it appears in Wishlist > Services', async ({ page }) => {
  const login = new LoginPage(page);
  const wishlist = new ServiceWishlistPage(page);

  // Step 1: Login
  await login.goto();
  await login.login('ratulsikder104@gmail.com', 'Ratul@104!');
  console.log(' Login completed');

  // Step 2: Click "See All" under recommended services
  await wishlist.goToAllRecommendedServices();
  console.log(' Clicked "See All" recommended services');

  // Step 3: Verify the page is loaded
  await expect(page).toHaveURL(/services/i);
  console.log(' Service list page loaded successfully');

  // Step 4: Click on the add to love sign (add to wishlist)
  await wishlist.addServiceToWishlist();
  console.log(' Clicked add to wishlist (love sign)');

  // Step 5: Now go to wishlist
  await wishlist.goToWishlist();
  console.log(' Navigated to Wishlist');

  // Step 6: Go to service tab
  await wishlist.openServicesTab();
  console.log(' Opened Services tab in wishlist');

  // Step 7: Check that service which one we add or not
  
  
  // If added success, if not test fail
  if (isAdded) {
    console.log(' SUCCESS: Service found in wishlist - Test Passed');
  } else {
    console.log('❌ FAILED: Service was not found in wishlist');
    throw new Error('❌ Service was not found in wishlist — Test Failed');
  }
});
