// tests/cart.spec.ts
import { test, expect } from '@playwright/test';
import users from '../src/data/users.json';
import products from '../src/data/products.json';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';

test.describe('shopping cart flow', () => {
  test('standard_user: can add 2 items, then remove 1, cart updates correctly', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    // Add 2 products to cart from inventory page
    await inventory.addToCart(products.backpack.name);
    await inventory.addToCart(products.bikeLight.name);

    // Badge should show 2
    await inventory.menu.expectCartBadgeCount(2);

    // Open cart and verify both items are there
    await inventory.menu.openCart();
    await cart.expectLoaded();
    await cart.expectItemsCount(2);
    await cart.expectItemVisible(products.backpack.name);
    await cart.expectItemVisible(products.bikeLight.name);

    // Go back to inventory and remove one item
    await page.goBack();
    await inventory.expectLoaded();

    await inventory.removeFromCart(products.bikeLight.name);
    await inventory.menu.expectCartBadgeCount(1);

    // Open cart again and verify only backpack remains
    await inventory.menu.openCart();
    await cart.expectLoaded();
    await cart.expectItemsCount(1);
    await cart.expectItemVisible(products.backpack.name);

    // Ensure removed item is gone
    await expect(page.locator('.inventory_item_name', { hasText: products.bikeLight.name })).toHaveCount(0);
  });

  // This test is marked as fixme due to known intermittent issues with add/remove buttons for the error_user
  test.fixme('error_user: add/remove buttons fail intermittently (known issue on SauceDemo)', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.open();
    await login.login(users.error.username, users.error.password);
    await inventory.expectLoaded();

    // Attempt multiple add/remove interactions; expected to fail due to app defects
    const name = products.backpack.name;

    await inventory.addToCart(name);
    await inventory.menu.expectCartBadgeCount(1);

    await inventory.removeFromCart(name);
    await inventory.menu.expectCartBadgeCount(0);

    // Repeat to demonstrate instability
    await inventory.addToCart(name);
    await inventory.menu.expectCartBadgeCount(1);
  });
});
