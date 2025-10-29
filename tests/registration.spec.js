import { test, expect } from "../fixtures/page_fixtures";
import * as randomData from "../util/random_data_generator/user";

test.describe("Registration", { tag: "@registration" }, () => {
    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goToLogin();
        await loginPage.registerAccountLink.click();
    });
    /**
     * @testrail 3
     */
    test("user is registered with valid customer data", async ({
        page,
        loginPage,
        registrationPage,
        headerComponent
    }) => {
        const userData = randomData.generateUserSignUpData();

        await registrationPage.registerWithDetails(userData);

        await expect(loginPage.loginButton).toBeVisible();

        await loginPage.loginUI(userData.email, userData.password);

        await expect(headerComponent.signInLink).toBeHidden();
        expect(page.url()).toContain("/account");
    });
    /**
     * @testrail 4
     */
    test(
        "validation error messages are displayed on submitting register form with empty fields",
        { tag: "@validation_errors" },
        async ({ page, registrationPage }) => {
            await registrationPage.registerButton.click();

            await expect(page.getByText("First name is required")).toBeVisible();
            await expect(page.getByText("Last name is required")).toBeVisible();
            await expect(page.getByText("Please enter a valid date in YYYY-MM-DD format.")).toBeVisible();
            await expect(page.getByText("Street is required")).toBeVisible();
            await expect(page.getByText("Postcode is required")).toBeVisible();
            await expect(page.getByText("City is required")).toBeVisible();
            await expect(page.getByText("State is required")).toBeVisible();
            await expect(page.getByText("Country is required")).toBeVisible();
            await expect(page.getByText("Phone is required.")).toBeVisible();
            await expect(page.getByText("Email is required")).toBeVisible();
            await expect(page.getByText("Password is required")).toBeVisible();

            expect(page.url()).toContain("/auth/register");
        }
    );
});
