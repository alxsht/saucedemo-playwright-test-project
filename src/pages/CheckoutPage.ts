// src/pages/CheckoutPage.ts
import { expect, type Locator, type Page } from '@playwright/test';
import { Menu } from '../components/Menu';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  readonly menu: Menu;

  private readonly title: Locator;

  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly postalCode: Locator;
  private readonly continueBtn: Locator;
  private readonly cancelBtn: Locator;
  private readonly error: Locator;

  private readonly overviewList: Locator;
  private readonly finishBtn: Locator;
  private readonly summarySubtotal: Locator;
  private readonly summaryTax: Locator;
  private readonly summaryTotal: Locator;

  private readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.menu = new Menu(page);

    this.title = page.locator('.title');

    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueBtn = page.locator('[data-test="continue"]');
    this.cancelBtn = page.locator('[data-test="cancel"]');
    this.error = page.locator('[data-test="error"]');

    this.overviewList = page.locator('.cart_list');
    this.finishBtn = page.locator('[data-test="finish"]');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');

    this.completeHeader = page.locator('.complete-header');
  }

  async expectInfoLoaded(): Promise<void> {
    await this.expectUrl(/\/checkout-step-one\.html/);
    await this.expectTitle(this.title, 'Checkout: Your Information');
    await this.expectVisible(this.firstName);
  }

  async fillInformation(data: { firstName: string; lastName: string; postalCode: string }): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.postalCode.fill(data.postalCode);
  }

  async continue(): Promise<void> {
    await expect(this.continueBtn).toBeVisible();
    await this.continueBtn.click();
  }

  async cancel(): Promise<void> {
    await expect(this.cancelBtn).toBeVisible();
    await this.cancelBtn.click();
  }

  async expectErrorContains(text: string): Promise<void> {
    await expect(this.error).toBeVisible();
    await expect(this.error).toContainText(text);
  }

  async expectOverviewLoaded(): Promise<void> {
    await this.expectUrl(/\/checkout-step-two\.html/);
    await this.expectTitle(this.title, 'Checkout: Overview');
    await this.expectVisible(this.overviewList);
  }

  async expectOverviewItemVisible(productName: string): Promise<void> {
    await expect(this.page.locator('.inventory_item_name', { hasText: productName })).toBeVisible();
  }

  async expectPriceSummaryVisible(): Promise<void> {
    await expect(this.summarySubtotal).toBeVisible();
    await expect(this.summaryTax).toBeVisible();
    await expect(this.summaryTotal).toBeVisible();
  }

  async finish(): Promise<void> {
    await expect(this.finishBtn).toBeVisible();
    await this.finishBtn.click();
  }

  async expectCompleteLoaded(): Promise<void> {
    await this.expectUrl(/\/checkout-complete\.html/);
    await this.expectTitle(this.title, 'Checkout: Complete!');
    await this.expectVisible(this.completeHeader);
    await expect(this.completeHeader).toContainText('Thank you');
  }
}
