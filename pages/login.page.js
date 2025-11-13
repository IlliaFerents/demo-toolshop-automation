import { expect } from "@playwright/test";

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
        this.totpCodeInput = page.locator('[data-test="totp-code"]');
        this.verifyTotpButton = page.locator('[data-test="verify-totp"]');
    }

    /**
     * Navigates to login page
     */
    async goToLogin() {
        await this.page.goto("/auth/login");
        expect(this.page.url()).toContain("/auth/login");
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

    /**
     * Verifies that TOTP input fields are visible (2FA is required)
     */
    async verifyTOTPInputVisible() {
        await expect(this.totpCodeInput).toBeVisible();
        await expect(this.verifyTotpButton).toBeVisible();
    }

    /**
     * Enters TOTP code and submits
     * @param {string} totpCode - The 6-digit TOTP code
     */
    async enterTOTPCode(totpCode) {
        await this.totpCodeInput.fill(totpCode);
        await this.verifyTotpButton.click();
    }
}

export default LoginPage;
