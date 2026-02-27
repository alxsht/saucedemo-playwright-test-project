// src/pages/CartPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { expectPageLoaded } from '../utils/common';

export class CartPage {
  private readonly title: Locator;
  private readonly cartItems: Locator;

  constructor(private page: Page) {
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
  }

  // Assert that we're on the cart page and it has loaded
  async expectLoaded(): Promise<void> {
    await expectPageLoaded(this.page, {
      url: /\/cart\.html/,
      titleLocator: this.title,
      expectedTitle: 'Your Cart',
      rootLocator: this.cartItems.first(),
    });
  }

  //
  async expectItemVisible(productName: string): Promise<void> {
    await expect(
      this.page.locator('.inventory_item_name', { hasText: productName })
    ).toBeVisible();
  }

  async expectItemsCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }
}
