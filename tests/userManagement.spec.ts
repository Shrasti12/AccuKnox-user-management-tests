import { test, expect } from './baseTest';

test.describe('OrangeHRM - User Management Tests', () => {
  const testUserData = {
    userRole: 'Admin',
    employeeName: 'Ravi M B',
    username: 'testuser' + Date.now(),
    status: 'Enabled',
    password: 'Test@123',
    confirmPassword: 'Test@123'
  };

  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await test.step('Login as Admin user', async () => {
      await loginPage.navigateToLoginPage();
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.verifyDashboardLoaded();
    });
  });

  test('TC004 - Navigate to Admin Module', async ({ dashboardPage, adminPage }) => {
    await test.step('Navigate to Admin module from dashboard', async () => {
      await dashboardPage.navigateToAdminModule();
    });

    await test.step('Verify Admin page is loaded', async () => {
      await adminPage.verifyAdminPageLoaded();
    });
  });

  test('TC005 - Add New User with Valid Data', async ({ dashboardPage, adminPage, addUserPage }) => {
    await test.step('Navigate to Admin module', async () => {
      await dashboardPage.navigateToAdminModule();
      await adminPage.verifyAdminPageLoaded();
    });

    await test.step('Click Add button to open Add User form', async () => {
      await adminPage.clickAddButton();
      await addUserPage.verifyAddUserPageLoaded();
    });

    await test.step('Fill user details and save', async () => {
      await addUserPage.createUser(
        testUserData.userRole,
        testUserData.employeeName,
        testUserData.username,
        testUserData.status,
        testUserData.password,
        testUserData.confirmPassword
      );
    });

    await test.step('Verify user is created successfully', async () => {
      await expect(async () => {
        await adminPage.verifySuccessMessage('Success');
      }).toPass({ timeout: 10000 });
    });
  });

  test('TC006 - Add New User with Invalid Username (Less than 5 characters)', async ({ dashboardPage, adminPage, addUserPage }) => {
    await test.step('Navigate to Admin module and open Add User form', async () => {
      await dashboardPage.navigateToAdminModule();
      await adminPage.clickAddButton();
      await addUserPage.verifyAddUserPageLoaded();
    });

    await test.step('Fill user details with invalid username', async () => {
      await addUserPage.selectUserRole('ESS');
      await addUserPage.enterEmployeeName('Test Employee');
      await addUserPage.enterUsername('test'); // Less than 5 characters
      await addUserPage.selectStatus('Enabled');
      await addUserPage.enterPassword('Test@123');
      await addUserPage.enterConfirmPassword('Test@123');
      await addUserPage.clickSaveButton();
    });

    await test.step('Verify validation error is displayed', async () => {
      const isErrorDisplayed = await addUserPage.isValidationErrorDisplayed();
      expect(isErrorDisplayed).toBe(true);
    });
  });

  test('TC007 - Search User by Employee Name', async ({ dashboardPage, adminPage }) => {
    await test.step('Navigate to Admin module', async () => {
      await dashboardPage.navigateToAdminModule();
      await adminPage.verifyAdminPageLoaded();
    });

    await test.step('Search by employee name', async () => {
      await adminPage.searchUserByEmployeeName('Admin');
    });

    await test.step('Verify search results are displayed', async () => {
      const tableRowCount = await adminPage.getTableRowCount();
      expect(tableRowCount).toBeGreaterThan(0);
    });
  });

  test('TC008 - Search Non-existent User', async ({ dashboardPage, adminPage }) => {
    await test.step('Navigate to Admin module', async () => {
      await dashboardPage.navigateToAdminModule();
      await adminPage.verifyAdminPageLoaded();
    });

    await test.step('Search for non-existent user', async () => {
      await adminPage.searchUserByUsername('nonexistentuser999');
    });

    await test.step('Verify no records found message', async () => {
      const isNoRecordsFound = await adminPage.isNoRecordsFoundDisplayed();
      expect(isNoRecordsFound).toBe(true);
    });
  });
});