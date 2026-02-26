// tests/auth.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import users from '../src/data/users.json';


test.describe('auth', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.open();
  });

  test('auth: user can login', async ({ page }) => {
    const inventory = new InventoryPage(page);

    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

  });

  test('should show error for invalid password', async () => {
    const wrongPassword = users.standard.password.slice(0, -1);

    await login.login(users.standard.username, wrongPassword);
    await login.assertErrorContains(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await login.assertOnLoginPage();
  });

  test('should show error when password is empty', async () => {

    await login.login(users.standard.username, '');
    await login.assertErrorContains('Password is required');
    await login.assertOnLoginPage();
  });

  test('auth: locked out user cannot login', async ({}) => {

    await login.login(users.lockedOut.username, users.lockedOut.password);
    await login.assertErrorContains('Epic sadface: Sorry, this user has been locked out.');
    await login.assertOnLoginPage();
  });
});
