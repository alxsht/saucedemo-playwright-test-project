// tests/checkout.spec.ts
import { test, expect } from '@playwright/test';
import users from '../src/data/users.json';
import products from '../src/data/products.json';
import checkoutUser from '../src/data/checkoutUser.json';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPage } from '../src/pages/CheckoutPage';

test.describe('checkout flow', () => {
  test('standard_user: can checkout 2 items and finish successfully', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    // Add 2 products
    await inventory.addToCart(products.backpack.name);
    await inventory.addToCart(products.bikeLight.name);

    await inventory.menu.expectCartBadgeCount(2);

    // Open cart and checkout
    await inventory.menu.openCart();
    await cart.expectLoaded();
    await cart.expectItemsCount(2);

    await cart.checkout();

    // Fill info and continue to overview
    await checkout.expectInfoLoaded();
    await checkout.fillInformation(checkoutUser.valid);
    await checkout.continue();

    // Verify overview shows correct items and price summary
    await checkout.expectOverviewLoaded();
    await checkout.expectOverviewItemVisible(products.backpack.name);
    await checkout.expectOverviewItemVisible(products.bikeLight.name);
    await checkout.expectPriceSummaryVisible();

    await checkout.finish();
    await checkout.expectCompleteLoaded();

    await checkout.menu.expectCartBadgeCount(0);
  });

  test('standard_user: validation - missing first name blocks checkout', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    // Add 1 product and proceed to checkout
    await inventory.addToCart(products.backpack.name);
    await inventory.menu.openCart();
    await cart.expectLoaded();

    await cart.checkout();

    // Attempt to continue with missing first name
    await checkout.expectInfoLoaded();
    await checkout.fillInformation({
      firstName: '',
      lastName: checkoutUser.valid.lastName,
      postalCode: checkoutUser.valid.postalCode,
    });
    await checkout.continue();

    // Verify error message is shown and we're still on the info page
    await checkout.expectErrorContains('First Name is required');
    await checkout.expectInfoLoaded();
  });

  test('standard_user: alternative - cancel from info returns to cart', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    // Add 1 product and proceed to checkout
    await inventory.addToCart(products.backpack.name);
    await inventory.menu.openCart();
    await cart.expectLoaded();

    await cart.checkout();
    await checkout.expectInfoLoaded();

    await checkout.cancel();

    // Verify we're back on the cart page with the item still there
    await cart.expectLoaded();
    await cart.expectItemsCount(1);
    await cart.expectItemVisible(products.backpack.name);
  });

  test.fixme('error_user: can bypass last name validation + cannot finish checkout (known user defect)', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.open();
    await login.login(users.error.username, users.error.password);
    await inventory.expectLoaded();

    // If add/remove is broken for this user, keep it minimal (try add once)
    await inventory.addToCart(products.backpack.name);
    await inventory.menu.openCart();
    await cart.expectLoaded();

    await cart.checkout();
    await checkout.expectInfoLoaded();

    // Reported behavior: last name missing but NO error shown
    await checkout.fillInformation({
      firstName: checkoutUser.valid.firstName,
      lastName: '', // intentionally missing
      postalCode: checkoutUser.valid.postalCode,
    });

    await checkout.continue();

    // Verify that we incorrectly bypassed validation and reached the overview page
    await checkout.expectOverviewLoaded();

    // Reported behavior: finish button does not work (no navigation to complete page)
    await checkout.finish();

    // Verify that we're still on the overview page (did not navigate to complete)
    await checkout.expectCompleteLoaded();
  });

  test.fixme('problem_user: add/remove is unreliable + cannot type last name (known user defects)', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await login.open();
    await login.login(users.problem.username, users.problem.password);
    await inventory.expectLoaded();

    // Try a couple clicks to demonstrate instability; should be flaky/broken by design
    await inventory.addToCart(products.backpack.name);
    await inventory.menu.expectCartBadgeCount(1);

    await inventory.removeFromCart(products.backpack.name);
    await inventory.menu.expectCartBadgeCount(0);

    await inventory.addToCart(products.backpack.name);
    await inventory.menu.openCart();

    await cart.expectLoaded();
    await cart.checkout();

    await checkout.expectInfoLoaded();

    // Reported behavior: last name field does not accept input (remains empty)
    await checkout.fillInformation({
      firstName: checkoutUser.valid.firstName,
      lastName: checkoutUser.valid.lastName,
      postalCode: checkoutUser.valid.postalCode,
    });

    // Verify that the last name field did not accept input (remains empty or unchanged)
    await expect(page.locator('[data-test="lastName"]')).toHaveValue(checkoutUser.valid.lastName);

    await checkout.continue();
    await checkout.expectOverviewLoaded();
  });

  test.fixme('visual_user: checkout button is in wrong place (layout defect)', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await login.open();
    await login.login(users.visual.username, users.visual.password);
    await inventory.expectLoaded();

    await inventory.addToCart(products.backpack.name);
    await inventory.menu.openCart();
    await cart.expectLoaded();

    // Layout check: checkout button should be in normal flow (not top-right overlay)
    await page.setViewportSize({ width: 1280, height: 720 });

    const btn = page.locator('[data-test="checkout"]');
    await expect(btn).toBeVisible();

    const box = await btn.boundingBox();
    expect(box).not.toBeNull();

    // "Wrong place upper right corner"
    if (box) {
      expect(box.y).toBeGreaterThan(200); // should not be near header
      expect(box.x).toBeLessThan(1000);   // should not be near extreme right
    }
  });
});
