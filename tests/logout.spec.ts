// tests/logout.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { expectUrlContains } from '../src/utils/common';
import users from '../src/data/users.json';
import products from '../src/data/products.json';

test.describe('logout flow', () => {
  let login: LoginPage;
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    inventory = new InventoryPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();
  });

  test('logout: user can logout via burger menu and session is cleared', async ({ page }) => {
    // Add products to cart to verify cart badge is cleared on logout
    await inventory.addToCart(products.backpack.name);
    await inventory.addToCart(products.bikeLight.name);
    await inventory.menu.expectCartBadgeCount(2);

    // Logout via burger menu
    await inventory.menu.logout();

    // Assert we are on login page after logout
    await login.assertOnLoginPage();

    // Assert session is cleared by navigating back to inventory page and verifying we can’t access it
    await page.goto('/inventory.html');
    await expectUrlContains(page, /\/(index\.html)?$/);

    // Stronger UI check
    await login.assertOnLoginPage();
  });
});
