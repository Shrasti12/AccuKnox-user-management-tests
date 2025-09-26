import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditUserPage extends BasePage {
  // Locators (similar to AddUserPage but for editing)
  private userRoleDropdown: Locator;
  private employeeNameInput: Locator;
  private usernameInput: Locator;
  private statusDropdown: Locator;
  private passwordInput: Locator;
  private confirmPasswordInput: Locator;
  private saveButton: Locator;
  private cancelButton: Locator;
  private pageTitle: Locator;
  private changePasswordCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.userRoleDropdown = page.locator('.oxd-select-text-input').first();
    this.employeeNameInput = page.locator('.oxd-autocomplete-text-input input');
    this.usernameInput = page.locator('.oxd-input').nth(1);
    this.statusDropdown = page.locator('.oxd-select-text-input').last();
    this.passwordInput = page.locator('input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[type="password"]').last();
    this.saveButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
    this.pageTitle = page.locator('.oxd-topbar-header-breadcrumb h6');
    this.changePasswordCheckbox = page.locator('input[type="checkbox"]');
  }

  /**
   * Verify Edit User page is loaded
   */
  async verifyEditUserPageLoaded(): Promise<void> {
    await this.waitForElement(this.pageTitle);
    const pageTitle = await this.getElementText(this.pageTitle);
    expect(pageTitle).toBe('Edit User');
  }

  /**
   * Get current username value
   */
  async getCurrentUsername(): Promise<string> {
    const usernameValue = await this.usernameInput.inputValue();
    return usernameValue;
  }

  /**
   * Update username
   */
  async updateUsername(newUsername: string): Promise<void> {
    await this.fillText(this.usernameInput, newUsername);
  }

  /**
   * Update user role
   */
  async updateUserRole(newRole: string): Promise<void> {
    await this.clickElement(this.userRoleDropdown);
    const roleOption = this.page.locator(`span:has-text("${newRole}")`);
    await this.clickElement(roleOption);
  }

  /**
   * Update status
   */
  async updateStatus(newStatus: string): Promise<void> {
    await this.clickElement(this.statusDropdown);
    const statusOption = this.page.locator(`span:has-text("${newStatus}")`);
    await this.clickElement(statusOption);
  }

  /**
   * Enable change password option
   */
  async enableChangePassword(): Promise<void> {
    if (!(await this.changePasswordCheckbox.isChecked())) {
      await this.clickElement(this.changePasswordCheckbox);
    }
  }

  /**
   * Change password
   */
  async changePassword(newPassword: string, confirmPassword: string): Promise<void> {
    await this.enableChangePassword();
    await this.fillText(this.passwordInput, newPassword);
    await this.fillText(this.confirmPasswordInput, confirmPassword);
  }

  /**
   * Save changes
   */
  async saveChanges(): Promise<void> {
    await this.clickElement(this.saveButton);
  }

  /**
   * Cancel changes
   */
  async cancelChanges(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }
}