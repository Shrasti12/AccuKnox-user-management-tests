import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private errorMessage: Locator;
  private forgotPasswordLink: Locator;
  private loginContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.forgotPasswordLink = page.locator('text=Forgot your password?');
    this.loginContainer = page.locator('.orangehrm-login-container');
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigateTo('/web/index.php/auth/login');
    await this.waitForElement(this.loginContainer);
  }

  /**
   * Perform login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillText(this.usernameInput, username);
    await this.fillText(this.passwordInput, password);
    await this.clickElement(this.loginButton);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText(this.errorMessage);
  }

  /**
   * Check if login page is loaded
   */
  async isLoginPageLoaded(): Promise<boolean> {
    return await this.isElementVisible(this.loginContainer);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement(this.forgotPasswordLink);
  }
}