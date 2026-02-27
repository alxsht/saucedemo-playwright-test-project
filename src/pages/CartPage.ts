// src/pages/CartPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { expectPageLoaded } from '../utils/common';

export class CartPage {
  private readonly title: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(private page: Page) {
    this.title = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  // Verify that we're on the cart page and it has loaded
  async expectLoaded(): Promise<void> {
    await expectPageLoaded(this.page, {
      url: /\/cart\.html/,
      titleLocator: this.title,
      expectedTitle: 'Your Cart',
      rootLocator: this.page.locator('.cart_list'),
    });
  }

  async expectItemVisible(productName: string): Promise<void> {
    await expect(
      this.cartItemByName(productName)
    ).toBeVisible();
  }

  async expectItemsCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  async checkout(): Promise<void> {
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await expect(this.continueShoppingButton).toBeVisible();
    await this.continueShoppingButton.click();
  }

  async removeItem(productName: string): Promise<void> {
    const item = this.cartItemByName(productName);
    const removeButton = item.locator('button[data-test^="remove-"]');

    await expect(removeButton).toBeVisible();
    await removeButton.click();

    await expect(item).toHaveCount(0);
  }

  private cartItemByName(productName: string): Locator {
    return this.page.locator('.cart_item').filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }
}
