import { test, expect } from "../fixtures/page_fixtures.js";
import { getAllSubCategories } from "../util/constants/categories.js";
import { getRandomArrayElement } from "../util/random_data_generator/user.js";

test.describe("Product Filters", { tag: ["@product", "@filters"] }, () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goToHomePage();
    });

    /**
     * @testrail 22
     */
    test("should filter products by search query", async ({ page, homePage, filtersComponent }) => {
        const searchTerms = ["hammer", "pliers", "saw", "drill", "wrench"];
        const searchQuery = getRandomArrayElement(searchTerms);

        await filtersComponent.submitSearch(searchQuery);

        await expect(page.getByRole("heading", { name: `Searched for: ${searchQuery}` })).toBeVisible();

        const productNames = await homePage.getAvailableProducts();
        expect(productNames.length).toBeGreaterThan(0);

        productNames.forEach((name) => {
            expect(name.toLowerCase()).toContain(searchQuery);
        });
    });

    /**
     * @testrail 23
     */
    test("should filter eco-friendly products only", async ({ page, filtersComponent }) => {
        await filtersComponent.toggleEcoFriendly(true);

        const productCards = await page.locator(".card").all();
        expect(productCards.length).toBeGreaterThan(0);

        for (const card of productCards) {
            await expect(card.getByTestId("eco-badge")).toBeVisible();
        }
    });

    /**
     * @testrail 24
     */
    test("should filter products by category", async ({ homePage, filtersComponent }) => {
        const categories = getAllSubCategories();
        const selectedCategory = getRandomArrayElement(categories);

        const response = await filtersComponent.selectCategory(selectedCategory);
        const responseData = await response.json();

        expect(responseData.data.length).toBeGreaterThan(0);

        responseData.data.forEach((product) => {
            expect(product.category.name).toBe(selectedCategory);
        });

        const productNames = await homePage.getAvailableProducts();
        expect(productNames.length).toBeGreaterThan(0);
    });
});
