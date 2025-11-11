import { test, expect } from "../fixtures/page_fixtures";
import { URLS } from "../util/constants/urls";

test.describe("Navigation", { tag: "@navigation" }, () => {
    /**
     * @testrail 10
     */
    test("clicking brand logo redirects to home page", async ({ page, headerComponent }) => {
        await page.goto(URLS.CONTACT);
        await page.locator(".navbar-brand").click();

        expect(page.url()).not.toContain(URLS.CONTACT);
        await expect(headerComponent.homeLink).toHaveClass("nav-link active");
    });

    /**
     * @testrail 11
     */
    test("header navigation links redirect to correct pages", async ({ page, homePage, headerComponent }) => {
        await homePage.goToHomePage();

        await headerComponent.contactLink.click();
        await page.waitForURL("**" + URLS.CONTACT);
        expect(page.url()).toContain(URLS.CONTACT);

        await headerComponent.homeLink.click();
        await page.waitForURL("**" + URLS.HOME);
        expect(page.url()).not.toContain(URLS.CONTACT);

        await headerComponent.categoriesButton.click();
        await page.getByText("Hand Tools").click();
        await page.waitForURL("**" + URLS.HAND_TOOLS_CATEGORY);
        expect(page.url()).toContain(URLS.HAND_TOOLS_CATEGORY);

        await headerComponent.signInLink.click();
        await page.waitForURL("**" + URLS.LOGIN);
        expect(page.url()).toContain(URLS.LOGIN);
    });

    /**
     * @testrail 12
     */
    test("cart icon visibility changes based on cart contents", async ({ homePage, headerComponent, productPage }) => {
        await homePage.goToHomePage();

        await expect(headerComponent.cartLink).toBeHidden();

        await homePage.clickRandomProduct();
        await productPage.addToCart();

        await expect(headerComponent.cartLink).toBeVisible();
    });
});
