// src/pages/CartPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly title: Locator;
  private readonly cartList: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.locator('.title');
    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async expectLoaded(): Promise<void> {
    await this.expectUrl(/\/cart\.html/);
    await this.expectTitle(this.title, 'Your Cart');
    await this.expectVisible(this.cartList);
  }

  async expectItemVisible(productName: string): Promise<void> {
    await expect(this.cartItemByName(productName)).toBeVisible();
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
    return this.cartItems.filter({
      has: this.page.locator('.inventory_item_name', { hasText: productName }),
    });
  }
}
