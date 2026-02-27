// src/pages/InventoryPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { expectPageLoaded, inventoryItemByName } from '../utils/common';
import { Menu } from '../components/Menu';

export class InventoryPage {
  private readonly inventoryList: Locator;
  private readonly pageTitle: Locator;

  readonly menu: Menu;

  constructor(private page: Page) {
    this.inventoryList = page.locator('.inventory_list');
    this.pageTitle = page.locator('.title');

    this.menu = new Menu(page);
  }

  // Assert that we're on the inventory page and it has loaded
async expectLoaded(): Promise<void> {
  await expectPageLoaded(this.page, {
    url: /\/inventory\.html/,
    titleLocator: this.pageTitle,
    expectedTitle: 'Products',
    rootLocator: this.inventoryList,
  });
}

  // Add a product to the cart by product name
  async addToCart(productName: string): Promise<void> {
    const item = inventoryItemByName(this.page, productName);
    await expect(item).toBeVisible();
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  // Remove a product from the cart by product name
  async removeFromCart(productName: string): Promise<void> {
    const item = inventoryItemByName(this.page, productName);
    await expect(item).toBeVisible();
    await item.getByRole('button', { name: /remove/i }).click();
  }
}
