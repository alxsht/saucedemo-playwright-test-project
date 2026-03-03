// src/pages/InventoryPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { Menu } from '../components/Menu';
import { isSortedAsc, isSortedDesc, parsePrice } from '../utils/common';
import { BasePage } from './BasePage';

export type SortValue = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage extends BasePage {
  private readonly pageTitle: Locator;
  private readonly inventoryList: Locator;
  private readonly sortDropdown: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;

  readonly menu: Menu;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.inventoryList = page.locator('.inventory_list');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.menu = new Menu(page);
  }

  async expectLoaded(): Promise<void> {
    await this.expectUrl(/\/inventory\.html/);
    await this.expectTitle(this.pageTitle, 'Products');
    await this.expectVisible(this.inventoryList);
  }

  async addToCart(productName: string): Promise<void> {
    const item = this.inventoryItemByName(productName);
    await expect(item).toBeVisible();
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    const item = this.inventoryItemByName(productName);
    await expect(item).toBeVisible();
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async sortBy(value: SortValue): Promise<void> {
    await expect(this.sortDropdown).toBeVisible();
    await this.sortDropdown.selectOption(value);
  }

  async getNames(): Promise<string[]> {
    await expect(this.itemNames.first()).toBeVisible();
    const raw = await this.itemNames.allTextContents();
    return raw.map((name) => name.trim()).filter(Boolean);
  }

  async getPrices(): Promise<number[]> {
    await expect(this.itemPrices.first()).toBeVisible();
    const raw = await this.itemPrices.allTextContents();
    return raw.map((price) => parsePrice(price.trim()));
  }

  async expectNamesSortedAsc(): Promise<void> {
    const names = await this.getNames();
    expect(isSortedAsc(names, (name) => name.toLowerCase())).toBe(true);
  }

  async expectNamesSortedDesc(): Promise<void> {
    const names = await this.getNames();
    expect(isSortedDesc(names, (name) => name.toLowerCase())).toBe(true);
  }

  async expectPricesSortedAsc(): Promise<void> {
    expect(isSortedAsc(await this.getPrices())).toBe(true);
  }

  async expectPricesSortedDesc(): Promise<void> {
    expect(isSortedDesc(await this.getPrices())).toBe(true);
  }

  assertDifferentOrder(a: string[], b: string[], message: string): void {
    expect(a, message).not.toEqual(b);
  }

  private inventoryItemByName(productName: string): Locator {
    return this.page
      .locator('.inventory_item')
      .filter({ has: this.page.locator('[data-test="inventory-item-name"]', { hasText: productName }) });
  }
}
