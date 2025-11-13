import { test, expect } from "../fixtures/page_fixtures";
import { generateTOTPCode } from "../util/api/totp.js";
import { generateUserSignUpData } from "../util/random_data_generator/user.js";

test.describe("Two-Factor Authentication (2FA)", { tag: ["@login", "@2fa"] }, () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    let userEmail;
    let userPassword;

    test.beforeEach(async ({ userAPI }) => {
        const userData = generateUserSignUpData();
        userEmail = userData.email;
        userPassword = userData.password;

        await userAPI.register(userData);
    });

    test("should successfully setup and enable 2FA", async ({ homePage, userAPI, twoFactorAPI }) => {
        const loginResponse = await userAPI.login(userEmail, userPassword);
        expect(loginResponse.access_token).toBeTruthy();

        await homePage.goToHomePage();
        await homePage.page.evaluate((token) => {
            localStorage.setItem("auth-token", token);
        }, loginResponse.access_token);

        const totpSetup = await twoFactorAPI.setupTOTP();
        expect(totpSetup.secret).toBeTruthy();
        expect(totpSetup.qrCodeUrl).toContain("otpauth://totp/");

        const totpCode = generateTOTPCode(totpSetup.secret);
        const verifyResponse = await twoFactorAPI.verifyTOTP(totpCode);

        expect(verifyResponse.message).toBe("TOTP enabled successfully");
    });

    test("should require TOTP code when logging in after 2FA is enabled", async ({
        homePage,
        loginPage,
        userAPI,
        twoFactorAPI
    }) => {
        const loginResponse = await userAPI.login(userEmail, userPassword);
        await homePage.goToHomePage();
        await homePage.page.evaluate((token) => {
            localStorage.setItem("auth-token", token);
        }, loginResponse.access_token);

        const totpSetup = await twoFactorAPI.setupTOTP();
        const totpCode = generateTOTPCode(totpSetup.secret);
        await twoFactorAPI.verifyTOTP(totpCode);

        await loginPage.goToLogin();
        await loginPage.page.evaluate(() => localStorage.clear());

        await loginPage.loginUI(userEmail, userPassword);

        await loginPage.verifyTOTPInputVisible();
    });

    test("should successfully login with correct TOTP code", async ({ homePage, loginPage, userAPI, twoFactorAPI }) => {
        const loginResponse = await userAPI.login(userEmail, userPassword);
        await homePage.goToHomePage();
        await homePage.page.evaluate((token) => {
            localStorage.setItem("auth-token", token);
        }, loginResponse.access_token);

        const totpSetup = await twoFactorAPI.setupTOTP();
        const totpCode = generateTOTPCode(totpSetup.secret);
        await twoFactorAPI.verifyTOTP(totpCode);

        await loginPage.goToLogin();
        await loginPage.page.evaluate(() => localStorage.clear());

        await loginPage.loginUI(userEmail, userPassword);

        const newTotpCode = generateTOTPCode(totpSetup.secret);
        await loginPage.enterTOTPCode(newTotpCode);

        await expect(loginPage.page).toHaveURL(/.*\/account/, { timeout: 10000 });
    });
});
