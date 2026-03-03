// src/pages/BasePage.ts
import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  protected async goto(path = '/'): Promise<void> {
    await this.page.goto(path);
  }

  protected async expectUrl(url: string | RegExp): Promise<void> {
    if (url instanceof RegExp) {
      await expect(this.page).toHaveURL(url);
      return;
    }

    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    await expect(this.page).toHaveURL(new RegExp(escaped));
  }

  protected async expectTitle(title: Locator, expected: string): Promise<void> {
    await expect(title).toHaveText(expected);
  }

  protected async expectVisible(root: Locator): Promise<void> {
    await expect(root).toBeVisible();
  }
}
