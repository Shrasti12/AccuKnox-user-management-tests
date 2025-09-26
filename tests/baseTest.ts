import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { AdminUserManagementPage } from '../pages/AdminUserManagementPage';
import { AddUserPage } from '../pages/AddUserPage';
import { EditUserPage } from '../pages/EditUserPage';

// Extend the base test to include page object fixtures
export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  adminPage: AdminUserManagementPage;
  addUserPage: AddUserPage;
  editUserPage: EditUserPage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  adminPage: async ({ page }, use) => {
    const adminPage = new AdminUserManagementPage(page);
    await use(adminPage);
  },

  addUserPage: async ({ page }, use) => {
    const addUserPage = new AddUserPage(page);
    await use(addUserPage);
  },

  editUserPage: async ({ page }, use) => {
    const editUserPage = new EditUserPage(page);
    await use(editUserPage);
  }
});

export { expect } from '@playwright/test';