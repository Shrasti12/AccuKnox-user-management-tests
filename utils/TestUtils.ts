export class TestUtils {
  /**
   * Generate random string for test data
   */
  static generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate unique username with timestamp
   */
  static generateUniqueUsername(prefix: string = 'user'): string {
    return `${prefix}_${Date.now()}`;
  }

  /**
   * Generate test user data
   */
  static generateTestUserData() {
    return {
      userRole: 'Admin',
      employeeName: 'Test Employee',
      username: this.generateUniqueUsername('testuser'),
      status: 'Enabled',
      password: 'Test@123',
      confirmPassword: 'Test@123'
    };
  }

  /**
   * Wait for a specified amount of time
   */
  static async wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  /**
   * Format date for test data
   */
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    return `test_${this.generateRandomString(5)}@example.com`;
  }
}