import { test, expect } from "../../fixtures/page_fixtures";

test.describe("Product", { tag: ["@product", "@logged_out"] }, () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ homePage }) => {
        await homePage.goToHomePage();
    });

    /**
     * @testrail 13
     */
    test("cannot be added to favorites for logged out user", async ({ page, homePage, productPage }) => {
        await homePage.clickRandomProduct();
        await productPage.addToFavorites();

        await expect(page.getByText("Unauthorized, can not add product to your favorite list.")).toBeVisible();
    });

    /**
     * @testrail 14
     */
    test("name matches between home and product pages", async ({ homePage, productPage }) => {
        const clickedProductName = await homePage.clickRandomProduct();
        const productPageName = await productPage.getProductName();

        expect(productPageName).toBe(clickedProductName);
    });

    /**
     * @testrail 15
     */
    test("co2 rating matches between home and product pages", async ({ homePage, productPage }) => {
        const randomProductName = await homePage.getRandomProductName();
        const productInfo = await homePage.getProductInfo(randomProductName);

        await homePage.clickProduct(productInfo.name);

        const productPageRating = await productPage.getCo2Rating();
        expect(productPageRating).toBe(productInfo.co2rating);
    });
});
