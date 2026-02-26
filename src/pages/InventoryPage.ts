// src/pages/InventoryPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { expectUrlContains, expectVisible } from '../utils/common';

export class InventoryPage {
  private readonly inventoryList: Locator;
  private readonly pageTitle: Locator;

  constructor(private page: Page) {
    this.inventoryList = page.locator('.inventory_list');
    this.pageTitle = page.locator('.title');
  }

  async expectLoaded(): Promise<void> {
    await expectUrlContains(this.page, /\/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryList).toBeVisible();
  }
}
