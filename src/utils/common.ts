// src/utils/common.ts
import { expect, type Locator, type Page } from '@playwright/test';

export async function goto(page: Page, path: string = '/') {
  await page.goto(path);
}

export async function expectUrlContains(page: Page, part: string | RegExp) {
  if (part instanceof RegExp) {
    await expect(page).toHaveURL(part);
  } else {
    const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(page).toHaveURL(new RegExp(escaped));
  }
}

// An assertion to verify that a page has loaded by checking URL, title, and root element visibility
export async function expectPageLoaded(
  page: Page,
  options: {
    url: string | RegExp;
    titleLocator: Locator;
    expectedTitle: string;
    rootLocator: Locator;
  }
): Promise<void> {
  await expectUrlContains(page, options.url);
  await expect(options.titleLocator).toHaveText(options.expectedTitle);
  await expect(options.rootLocator).toBeVisible();
}

export async function expectVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
}

// Locate an inventory item card by product name
export function inventoryItemByName(page: Page, productName: string): Locator {
  return page
    .locator('.inventory_item')
    .filter({ has: page.locator('[data-test="inventory-item-name"]', { hasText: productName }) });
}


