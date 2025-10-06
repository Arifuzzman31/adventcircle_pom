class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator('#identifier');
    this.password = page.locator('#password');
    this.loginBtn = page.locator('button[type="submit"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(user, pass) {
    if (user !== undefined) await this.username.fill(user);
    if (pass !== undefined) await this.password.fill(pass);
    await this.loginBtn.click();
  }
}

module.exports = { LoginPage };