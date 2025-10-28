import { test, expect } from "../fixtures/page_fixtures";
import * as randomData from "../util/random_data_generator/user";

test.describe("Login", () => {
    let userData;

    test.beforeEach(async ({ loginPage, userAPI }) => {
        userData = randomData.generateUserSignUpData();
        await userAPI.register(userData);
        await loginPage.goToLogin();
    });

    test("registered user is logged in with valid credentials", async ({ page, loginPage, headerComponent }) => {
        await loginPage.loginUI(userData.email, userData.password);

        await expect(headerComponent.signInLink).toBeHidden();
        expect(page.url()).toContain("/account");
    });

    test("validation error message is displayed when logging in with invalid credentials", async ({
        page,
        loginPage
    }) => {
        const invalidEmail = randomData.generateEmail();
        const invalidPassword = randomData.generatePassword();

        await loginPage.loginUI(invalidEmail, invalidPassword);

        await expect(page.getByText("Invalid email or password")).toBeVisible();
        expect(page.url()).toContain("/auth/login");
    });
});
