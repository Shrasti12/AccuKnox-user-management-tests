import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Locators
  private dashboardHeader: Locator;
  private adminMenuItem: Locator;
  private userProfileDropdown: Locator;
  private logoutOption: Locator;
  private sideMenu: Locator;
  private pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeader = page.getByRole('heading', { name: 'Dashboard' });
    this.adminMenuItem = page.locator('a[href="/web/index.php/admin/viewAdminModule"]');
    this.userProfileDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutOption = page.locator('text=Logout');
    this.sideMenu = page.locator('.oxd-sidepanel-body');
    this.pageTitle = page.locator('.oxd-topbar-header-breadcrumb h6');
  }

  /**
   * Verify dashboard is loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
  // Use URL verification as primary check
  await this.page.waitForURL('**/dashboard/index', { timeout: 10000 });
  
  try {
    // Secondary check for dashboard content
    await this.waitForElement(this.dashboardHeader, 5000);
  } catch {
    // Fallback: check for any dashboard indicator
    const dashboardIndicator = this.page.locator('text=Time at Work, text=My Actions, .oxd-dashboard-row').first();
    await this.waitForElement(dashboardIndicator, 5000);
  }
}

  /**
   * Navigate to Admin module
   */
  async navigateToAdminModule(): Promise<void> {
  await this.clickElement(this.adminMenuItem);
  
  // Use semantic locator targeting the "Admin" heading specifically
  const adminHeading = this.page.getByRole('heading', { name: 'Admin' });
  await this.waitForElement(adminHeading);
}
  /**
   * Logout from application
   */
  async logout(): Promise<void> {
    await this.clickElement(this.userProfileDropdown);
    await this.clickElement(this.logoutOption);
  }

  /**
   * Check if admin menu item is visible
   */
  async isAdminMenuVisible(): Promise<boolean> {
    return await this.isElementVisible(this.adminMenuItem);
  }

  /**
   * Get current page title
   */
  async getCurrentPageTitle(): Promise<string> {
    return await this.getElementText(this.pageTitle);
  }
}