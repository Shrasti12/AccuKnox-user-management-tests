import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminUserManagementPage extends BasePage {
  // Locators
  private addButton: Locator;
  private searchButton: Locator;
  private resetButton: Locator;
  private usernameSearchInput: Locator;
  private employeeNameSearchInput: Locator;
  private userRoleSearchDropdown: Locator;
  private statusSearchDropdown: Locator;
  private userTable: Locator;
  private noRecordsFound: Locator;
  private successMessage: Locator;
  private deleteButtons: Locator;
  private editButtons: Locator;
  private confirmDeleteButton: Locator;
  private adminHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button[type="button"]:has-text("Reset")');
    this.usernameSearchInput = page.locator('.oxd-form .oxd-input').first();
    this.employeeNameSearchInput = page.locator('.oxd-autocomplete-text-input input');
    this.userRoleSearchDropdown = page.locator('.oxd-select-text-input').first();
    this.statusSearchDropdown = page.locator('.oxd-select-text-input').last();
    this.userTable = page.locator('.oxd-table-body');
    this.noRecordsFound = page.locator('.oxd-table-body').getByText('No Records Found');
    this.successMessage = page.locator('.oxd-toast-content-text');
    this.deleteButtons = page.locator('.oxd-icon-button.oxd-table-cell-action-space i.bi-trash');
    this.editButtons = page.locator('.oxd-icon-button.oxd-table-cell-action-space i.bi-pencil-fill');
    this.confirmDeleteButton = page.locator('button:has-text("Yes, Delete")');
    this.adminHeader = page.getByRole('heading', { name: 'Admin' });
  }

  /**
   * Verify admin page is loaded
   */
  async verifyAdminPageLoaded(): Promise<void> {
  await this.waitForElement(this.adminHeader);
  const isVisible = await this.isElementVisible(this.adminHeader);
  expect(isVisible).toBe(true);
}

  /**
   * Click Add button to add new user
   */
  async clickAddButton(): Promise<void> {
    await this.clickElement(this.addButton);
  }

  /**
 * Search user by username
 */
async searchUserByUsername(username: string): Promise<void> {
  // Ensure we're on the admin users page
  await this.waitForElement(this.usernameSearchInput, 10000);
  
  await this.fillText(this.usernameSearchInput, username);
  
  // Simple click without problematic force fallback
  await this.clickElement(this.searchButton);
  
  // Wait for search to complete
  await this.page.waitForLoadState('networkidle', { timeout: 10000 });
}


  /**
   * Search user by employee name
   */
  async searchUserByEmployeeName(employeeName: string): Promise<void> {
    await this.fillText(this.employeeNameSearchInput, employeeName);
    await this.page.waitForTimeout(1000); // Wait for autocomplete
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.clickElement(this.searchButton);
    await this.page.waitForTimeout(2000);
  }

  /**
   * Reset search filters
   */
  async resetSearch(): Promise<void> {
    await this.clickElement(this.resetButton);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Check if user exists in table
   */
  async isUserExistInTable(username: string): Promise<boolean> {
    const userRow = this.page.locator(`tr:has-text("${username}")`);
    return await this.isElementVisible(userRow);
  }

  /**
   * Edit user by username
   */
  async editUserByUsername(username: string): Promise<void> {
    await this.searchUserByUsername(username);
    const userRow = this.page.locator(`tr:has-text("${username}")`);
    const editButton = userRow.locator('i.bi-pencil-fill');
    await this.clickElement(editButton);
  }

  /**
   * Delete user by username
   */
  async deleteUserByUsername(username: string): Promise<void> {
    await this.searchUserByUsername(username);
    const userRow = this.page.locator(`tr:has-text("${username}")`);
    const deleteButton = userRow.locator('i.bi-trash');
    await this.clickElement(deleteButton);
    await this.clickElement(this.confirmDeleteButton);
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify success message is displayed
   */
  // In AdminUserManagementPage.ts
async verifySuccessMessage(expectedMessage: string): Promise<void> {
  await this.page.waitForTimeout(3000);
  
  // Look for any element containing the success text
  const successElements = [
    this.page.getByText('Success', { exact: true }),
    this.page.getByText('Successfully Saved'),
    this.page.locator('.oxd-toast--success')
  ];
  
  let found = false;
  for (const element of successElements) {
    try {
      await element.waitFor({ state: 'visible', timeout: 2000 });
      found = true;
      break;
    } catch {
      continue;
    }
  }
  
  expect(found).toBe(true);
}

  /**
   * Check if no records found message is displayed
   */
  async isNoRecordsFoundDisplayed(): Promise<boolean> {
  try {
    // Wait a moment for search to complete and message to appear
    await this.page.waitForTimeout(1000);
    
    // Check multiple possible locations for the message
    const locations = [
      this.page.locator('.oxd-table-body').getByText('No Records Found'),
      this.page.locator('[class*="table"]').getByText('No Records Found'),
      this.page.getByText('No Records Found').first()
    ];
    
    for (const locator of locations) {
      if (await locator.isVisible()) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    // console.log('Error checking no records message:', error.message);
    return false;
  }
}
  /**
   * Get total number of records in table
   */
  async getTableRowCount(): Promise<number> {
    const rows = this.page.locator('.oxd-table-body .oxd-table-row');
    return await rows.count();
  }
}