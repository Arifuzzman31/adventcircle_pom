const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginpage');
const { ProductWishlistPage } = require('../../pages/productwishlistpage');

test('User can add product to wishlist and verify it appears in wishlist', async ({ page }) => {
  const login = new LoginPage(page);
  const productWishlist = new ProductWishlistPage(page);

  // Step 1: Login
  await login.goto();
  await login.login('ratulsikder104@gmail.com', 'Ratul@104!');
  console.log('✅ Login completed');

  // Step 2: Click Marketplace
  await productWishlist.goToMarketplace();

  // Step 3: Make sure the page is loaded and data is there
  const productsLoaded = await productWishlist.waitForProductsToLoad();
  expect(productsLoaded).toBeTruthy();

  // Step 4: Click on the wishlist icon (click on any available one)
  await productWishlist.addProductToWishlist();
  console.log('✅ Clicked on wishlist icon');

  // Step 5: Go to wishlist by click
  await productWishlist.goToWishlist();

  // Step 6: Check the product added to the wishlist or not
  const productInWishlist = await productWishlist.verifyProductInWishlist();
  
  // Step 7: If added successful, if not test fail
  if (productInWishlist) {
    console.log('✅ SUCCESS: Product found in wishlist - Test Passed');
  } else {
    console.log('❌ FAILED: Product was not found in wishlist');
    throw new Error('❌ Product was not found in wishlist — Test Failed');
  }
  
  console.log(' Test completed successfully');
});
