// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import users from '../src/data/users.json';


test.describe('login flow', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
    await login.open();
  });

  test('auth: user can login', async ({ page }) => {
    const inventory = new InventoryPage(page);

    // Login with valid credentials
    await login.login(users.standard.username, users.standard.password);
    await inventory.expectLoaded();

  });

  test('should show error for invalid password', async () => {
    const wrongPassword = users.standard.password.slice(0, -1);

    // Attempt login with correct username but wrong password
    await login.login(users.standard.username, wrongPassword);
    await login.assertErrorContains(
      'Epic sadface: Username and password do not match any user in this service'
    );
    await login.assertOnLoginPage();
  });

  test('should show error when password is empty', async () => {

    // Attempt login with correct username but empty password
    await login.login(users.standard.username, '');
    await login.assertErrorContains('Password is required');
    await login.assertOnLoginPage();
  });

  test('auth: locked out user cannot login', async ({ }) => {

    // Attempt login with locked out user credentials
    await login.login(users.lockedOut.username, users.lockedOut.password);
    await login.assertErrorContains('Epic sadface: Sorry, this user has been locked out.');
    await login.assertOnLoginPage();
  });

  test('performance_glitch_user: login is significantly delayed (known user defect)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const start = Date.now();

    await login.login(
      users.performance.username,
      users.performance.password
    );

    await inventory.expectLoaded();

    const duration = Date.now() - start;

    // Expect login to take significantly longer than normal due to known performance defect with this user
    expect(duration).toBeGreaterThan(3000);
  });
});
