
class LoginPage {
    constructor(page) {
      this.page = page;
      this.username = page.locator('#identifier'); // Email
      this.password = page.locator('#password');   // Password 
      this.loginBtn = page.locator('button[type="submit"]'); // Login button
    }
  
    async goto() {
      await this.page.goto('/auth/login'); 
    }
  
    async login() {
      await this.username.fill('ratulsikder104@gmail.com');
      await this.password.fill('Ratul@104!');
      await this.loginBtn.click();
    }
  }
  
  module.exports = { LoginPage };
  