import { test, expect } from "../fixtures/page_fixtures";

test.describe("Navigation", { tag: "@navigation" }, () => {
    /**
     * @testrail 10
     */
    test("clicking brand logo redirects to home page", async ({ page, headerComponent }) => {
        await page.goto("/contact");
        await page.locator(".navbar-brand").click();

        expect(page.url()).not.toContain("/contact");
        await expect(headerComponent.homeLink).toHaveClass("nav-link active");
    });

    /**
     * @testrail 11
     */
    test("header navigation links redirect to correct pages", async ({ page, headerComponent }) => {
        await page.goto("/");

        await headerComponent.contactLink.click();
        await page.waitForURL("**/contact");
        expect(page.url()).toContain("/contact");

        await headerComponent.homeLink.click();
        await page.waitForURL("**/");
        expect(page.url()).not.toContain("/contact");

        await headerComponent.categoriesButton.click();
        await page.getByText("Hand Tools").click();
        await page.waitForURL("**/category/hand-tools");
        expect(page.url()).toContain("/category/hand-tools");

        await headerComponent.signInLink.click();
        await page.waitForURL("**/auth/login");
        expect(page.url()).toContain("/auth/login");
    });
});
