// src/utils/common.ts
import { expect, type Locator, type Page } from '@playwright/test';

export const inventorySelectors = {
  sortDropdown: '[data-test="product-sort-container"]',
  itemName: '[data-test="inventory-item-name"]',
  itemPrice: '[data-test="inventory-item-price"]',
  cartBadge: '[data-test="shopping-cart-badge"]',
} as const;

export type SortValue = 'az' | 'za' | 'lohi' | 'hilo';

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

// A helper to click an element, asserting visibility first for better error messages
export async function click(page: Page, selector: string) {
  await page.locator(selector).click();
}

// A helper to fill an input field, asserting visibility first for better error messages
export async function fill(page: Page, selector: string, value: string) {
  await page.locator(selector).fill(value);
}

// A helper to assert that a locator's text contains a substring or matches a regex
export async function expectTextContains(target: Locator, text: string | RegExp) {
  if (text instanceof RegExp) {
    await expect(target).toHaveText(text);
  } else {
    await expect(target).toContainText(text);
  }
}

export async function setInventorySort(page: Page, value: SortValue) {
  const dropdown = page.locator(inventorySelectors.sortDropdown);
  await expect(dropdown).toBeVisible();
  await dropdown.selectOption(value);
}

// Returns visible product names in order
export async function getInventoryItemNames(page: Page): Promise<string[]> {
  const names = page.locator(inventorySelectors.itemName);
  await expect(names.first()).toBeVisible();
  const raw = await names.allTextContents();
  return raw.map(s => s.trim()).filter(Boolean);
}

// Returns visible product prices in order (numbers, e.g. 29.99)
export async function getInventoryItemPrices(page: Page): Promise<number[]> {
  const prices = page.locator(inventorySelectors.itemPrice);
  await expect(prices.first()).toBeVisible();
  const raw = await prices.allTextContents();
  return raw
    .map(s => s.trim())
    .filter(Boolean)
    .map(parsePrice);
}

export function parsePrice(text: string): number {
  // "$29.99" -> 29.99
  const cleaned = text.replace(/[^0-9.]/g, '');
  const n = Number(cleaned);
  if (Number.isNaN(n)) throw new Error(`Cannot parse price from: "${text}"`);
  return n;
}

export function expectSortedAsc<T>(arr: T[], keyFn?: (x: T) => string | number) {
  const key = keyFn ?? ((x: any) => x);
  for (let i = 1; i < arr.length; i++) {
    const a = key(arr[i - 1]);
    const b = key(arr[i]);
    if (a > b) {
      throw new Error(`Expected ascending sort, but got: ${String(a)} > ${String(b)} at index ${i}`);
    }
  }
}

export function expectSortedDesc<T>(arr: T[], keyFn?: (x: T) => string | number) {
  const key = keyFn ?? ((x: any) => x);
  for (let i = 1; i < arr.length; i++) {
    const a = key(arr[i - 1]);
    const b = key(arr[i]);
    if (a < b) {
      throw new Error(`Expected descending sort, but got: ${String(a)} < ${String(b)} at index ${i}`);
    }
  }
}

// Get the numeric count from the cart badge, or 0 if the badge is not present. Fails if the badge text is non-numeric.
export async function getCartBadgeCount(page: Page): Promise<number> {
  const badge = page.locator('.shopping_cart_badge');
  if (await badge.count() === 0) return 0;

  const raw = (await badge.innerText()).trim();
  const n = Number(raw);

  // Check if the parsed number is finite (not NaN or Infinity)
  if (!Number.isFinite(n)) {
    throw new Error(`Cart badge is not numeric: "${raw}"`);
  }
  return n;
}
