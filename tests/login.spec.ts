import { test, expect } from './baseTest';

test.describe('OrangeHRM - Login Tests', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigateToLoginPage();
  });

  test('TC001 - Verify successful login with valid credentials', async ({ loginPage, dashboardPage }) => {
    await test.step('Login with valid Admin credentials', async () => {
      await loginPage.login('Admin', 'admin123');
    });

    await test.step('Verify dashboard is loaded successfully', async () => {
      await dashboardPage.verifyDashboardLoaded();
    });
  });

  test('TC002 - Verify login fails with invalid credentials', async ({ loginPage }) => {
    await test.step('Attempt login with invalid credentials', async () => {
      await loginPage.login('InvalidUser', 'InvalidPassword');
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(async () => {
        const isErrorDisplayed = await loginPage.isErrorMessageDisplayed();
        expect(isErrorDisplayed).toBe(true);
      }).toPass({ timeout: 10000 });
    });
  });

  test('TC003 - Verify login page elements are visible', async ({ loginPage }) => {
    await test.step('Verify login page is loaded properly', async () => {
      const isLoaded = await loginPage.isLoginPageLoaded();
      expect(isLoaded).toBe(true);
    });
  });
});