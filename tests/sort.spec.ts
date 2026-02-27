// tests/sort.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import users from '../src/data/users.json';

test.describe('inventory sorting', () => {
  test('standard_user: can sort by name', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    await inventory.sortBy('az');
    await inventory.expectNamesSortedAsc();

    await inventory.sortBy('za');
    await inventory.expectNamesSortedDesc();
  });

  test('standard_user: can sort by price', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.open();
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

    await inventory.sortBy('lohi');
    await inventory.expectPricesSortedAsc();

    await inventory.sortBy('hilo');
    await inventory.expectPricesSortedDesc();
  });
  test.fixme('problem_user: sorting is broken (known user defect)', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.open();
    await login.login(users.problem.username, users.problem.password);
    await inventory.expectLoaded();

    // Simulate sorting behavior
    await inventory.sortBy('az');
    const azNames = await inventory.getNames();

    await inventory.sortBy('za');
    const zaNames = await inventory.getNames();

    // Expected behavior: reversed ordering, so arrays should differ
    // Known defect: ordering remains the same
    inventory.assertDifferentOrder(
      azNames,
      zaNames,
      'Sorting toggle AZ -> ZA did not change item order for problem_user'
    );
  });
});
