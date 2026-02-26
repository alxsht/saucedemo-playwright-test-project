// src/pages/LoginPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { goto } from '../utils/common';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorBox: Locator;

  constructor(private page: Page) {
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorBox = page.locator('[data-test="error"]');
  }

  async open(): Promise<void> {
    await goto(this.page, '/');
    await expect(this.loginButton).toBeVisible();
  }


  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async assertErrorContains(text: string): Promise<void> {
    await expect(this.errorBox).toBeVisible();
    await expect(this.errorBox).toContainText(text);
  }

  async assertOnLoginPage(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
