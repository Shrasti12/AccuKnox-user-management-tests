import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddUserPage extends BasePage {
  // Locators
  private userRoleDropdown: Locator;
  private employeeNameInput: Locator;
  private usernameInput: Locator;
  private statusDropdown: Locator;
  private passwordInput: Locator;
  private confirmPasswordInput: Locator;
  private saveButton: Locator;
  private cancelButton: Locator;
  private addUserHeader: Locator;
  private errorMessages: Locator;
  private requiredFieldError: Locator;

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
  
  // Fix: Target the correct heading
  this.addUserHeader = page.getByRole('heading', { name: 'Add User' });
  
  this.errorMessages = page.locator('.oxd-text--span.oxd-input-field-error-message');
  this.requiredFieldError = page.locator('span:has-text("Required")');
}

/**
 * Verify Add User page is loaded
 */
async verifyAddUserPageLoaded(): Promise<void> {
  await this.waitForElement(this.addUserHeader);
  const isVisible = await this.isElementVisible(this.addUserHeader);
  expect(isVisible).toBe(true);
}

  /**
   * Select user role from dropdown
   */
  async selectUserRole(role: string): Promise<void> {
  await this.clickElement(this.userRoleDropdown);
  
  // Remove fixed timeout, wait for specific option instead
  const roleOption = this.page.getByRole('option', { name: role });
  await roleOption.waitFor({ state: 'visible', timeout: 5000 });
  await roleOption.click();
}

  /**
   * Enter employee name with autocomplete
   */
  async enterEmployeeName(employeeName: string): Promise<void> {
  // Clear the field first
  await this.employeeNameInput.clear();
  
  // Type first few characters to trigger autocomplete
  await this.employeeNameInput.fill(employeeName.substring(0, 3));
  await this.page.waitForTimeout(2000);
  
  // Wait for and select first autocomplete suggestion
  const firstSuggestion = this.page.locator('[role="option"]').first();
  
  try {
    await firstSuggestion.waitFor({ state: 'visible', timeout: 3000 });
    await firstSuggestion.click();
  } catch {
    // Fallback to known employee
    await this.employeeNameInput.clear();
    await this.employeeNameInput.fill('Admin');
    await this.page.waitForTimeout(1000);
    
    const adminOption = this.page.locator('[role="option"]:has-text("Admin")');
    if (await adminOption.isVisible()) {
      await adminOption.click();
    }
  }
}

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillText(this.usernameInput, username);
  }

  /**
   * Select status from dropdown
   */
  async selectStatus(status: string): Promise<void> {
  await this.clickElement(this.statusDropdown);
  
  // Wait for the specific option to be available instead of fixed timeout
  const statusOption = this.page.getByRole('option', { name: status });
  await statusOption.waitFor({ state: 'visible', timeout: 5000 });
  await statusOption.click();
}
  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillText(this.passwordInput, password);
  }

  /**
   * Enter confirm password
   */
  async enterConfirmPassword(confirmPassword: string): Promise<void> {
    await this.fillText(this.confirmPasswordInput, confirmPassword);
  }

  /**
   * Click Save button
   */
  async clickSaveButton(): Promise<void> {
    await this.clickElement(this.saveButton);
  }

  /**
   * Click Cancel button
   */
  async clickCancelButton(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  /**
   * Fill all user details and save
   */
  async createUser(userRole: string, employeeName: string, username: string, 
                  status: string, password: string, confirmPassword: string): Promise<void> {
    await this.selectUserRole(userRole);
    await this.enterEmployeeName(employeeName);
    await this.enterUsername(username);
    await this.selectStatus(status);
    await this.enterPassword(password);
    await this.enterConfirmPassword(confirmPassword);
    await this.clickSaveButton();
  }

  /**
   * Check if validation error is displayed
   */
  async isValidationErrorDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessages);
  }

  /**
   * Get validation error message
   */
  async getValidationErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessages);
  }

  /**
   * Check if required field error is displayed
   */
  async isRequiredFieldErrorDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.requiredFieldError);
  }

  
  /**
 * Get valid employee name from system
 */
// In AddUserPage.ts
async getValidEmployeeName(): Promise<string> {
  try {
    await this.waitForElement(this.employeeNameInput, 3000);
    
    // Clear the field
    await this.employeeNameInput.clear();
    
    // Type first letter to trigger autocomplete
    await this.employeeNameInput.fill('A');
    await this.page.waitForTimeout(2000);
    
    // Select the first option from autocomplete dropdown
    const firstOption = this.page.locator('[role="option"]').first();
    await firstOption.waitFor({ state: 'visible', timeout: 3000 });
    
    const employeeName = await firstOption.textContent();
    await firstOption.click();
    
    return employeeName?.trim() || 'Admin';
    
  } catch (error) {
    console.log('Fallback: using default employee');
    
    // Fallback - just return known employee name and let enterEmployeeName handle it
    return 'Admin';
  }
}


  /**
   * Fill employee name with autocomplete selection
   */
  async selectValidEmployee(): Promise<string> {
    const employeeInput = this.page.locator('input[placeholder="Type for hints..."]');
    await employeeInput.fill('A');
    await this.page.waitForTimeout(2000);
    
    const firstOption = this.page.locator('[role="option"]').first();
    if (await this.isElementVisible(firstOption)) {
      const employeeName = await firstOption.textContent();
      await this.clickElement(firstOption);
      return employeeName?.trim() || 'Admin';
    }
    
    // Fallback - clear and type Admin
    await employeeInput.clear();
    await employeeInput.fill('Admin');
    return 'Admin';
  }
}
