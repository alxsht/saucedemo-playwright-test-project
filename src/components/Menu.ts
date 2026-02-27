// src/components/Menu.ts
import { expect, type Locator, type Page } from '@playwright/test';

export class Menu {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly menuButton: Locator;

  constructor(private page: Page) {
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
  }

  private burgerBtn = this.page.locator('#react-burger-menu-btn');
  private closeBtn = this.page.locator('#react-burger-cross-btn');

  private menuPanel = this.page.locator('.bm-menu-wrap');
  private logoutLink = this.page.locator('#logout_sidebar_link');

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
    await this.menuButton.click();
  }

  async open() {
    await expect(this.burgerBtn).toBeVisible();
    await this.burgerBtn.click();
    await expect(this.menuPanel).toBeVisible();
  }

  async close() {
    await expect(this.closeBtn).toBeVisible();
    await this.closeBtn.click();
    await expect(this.menuPanel).toBeHidden();
  }

  async logout() {
    await this.open();
    await expect(this.logoutLink).toBeVisible();
    await this.logoutLink.click();
  }
}
