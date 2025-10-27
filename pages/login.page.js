/**
 * @class LoginPage
 */
class LoginPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.signInWithGoogleButton = page.getByRole("button").and(page.locator(".google-sign-in-button"));
        this.emailInput = page.getByTestId("email");
        this.passwordInput = page.getByTestId("password");
        this.showHidePasswordButton = page.getByRole("button").and(page.locator(".btn-outline-secondary"));
        this.loginButton = page.getByTestId("login-submit");
        this.registerAccountLink = page.getByTestId("register-link");
        this.forgotPasswordLink = page.getByTestId("forgot-password-link");
    }

    /**
     * Logs in using the UI
     * @param {string} email
     * @param {string} password
     */
    async loginUI(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.clickLogin();
    }

    /**
     * Clicks the login button
     */
    async clickLogin() {
        await this.loginButton.click();
    }
}

export default LoginPage;
