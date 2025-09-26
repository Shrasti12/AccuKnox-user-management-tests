import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
  await this.page.goto(url, { timeout: 60000 });
}

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
 * Click on an element with wait and loading handling
 */
// In BasePage.ts - Update clickElement method
async clickElement(locator: Locator): Promise<void> {
  await this.waitForElement(locator);
  
  // Wait for any loading overlays to disappear
  const loadingElements = this.page.locator('.oxd-form-loader, .oxd-loading, [data-v-loading]');
  
  try {
    await loadingElements.waitFor({ state: 'hidden', timeout: 3000 });
  } catch {
    // No loading elements or already hidden - continue
  }
  
  try {
    // Try normal click first
    await locator.click({ timeout: 5000 });
  } catch (error) {
    // If normal click fails, try force click
    console.log('Normal click failed, attempting force click');
    await locator.click({ force: true, timeout: 3000 });
  }
}


  /**
   * Fill text in an input field
   */
  async fillText(locator: Locator, text: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.clear();
    await locator.fill(text);
  }

  /**
   * Select option from dropdown
   */
  async selectDropdownOption(locator: Locator, option: string): Promise<void> {
    await this.waitForElement(locator);
    await locator.selectOption({ label: option });
  }

  /**
   * Get text content of an element
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await this.waitForElement(locator, 5000);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }
}