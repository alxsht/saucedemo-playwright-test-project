// src/components/Menu.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class Menu {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly menuButton: Locator;
  private readonly closeButton: Locator;
  private readonly menuPanel: Locator;
  private readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.menuPanel = page.locator('.bm-menu-wrap');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartBadgeCount(count: number): Promise<void> {
    if (count === 0) {
      await expect(this.cartBadge).toHaveCount(0);
      return;
    }

    await expect(this.cartBadge).toHaveText(String(count));
  }

  async openMenu(): Promise<void> {
    await expect(this.menuButton).toBeVisible();
    await this.menuButton.click();
    await expect(this.menuPanel).toBeVisible();
  }

  async closeMenu(): Promise<void> {
    await expect(this.closeButton).toBeVisible();
    await this.closeButton.click();
    await expect(this.menuPanel).toBeHidden();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }
}
