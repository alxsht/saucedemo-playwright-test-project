// src/utils/common.ts
import { expect, type Page } from '@playwright/test';

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

export async function expectVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
}
