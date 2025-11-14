import { test, expect } from "../fixtures/page_fixtures.js";

test.describe("Product Sorting", { tag: ["@product", "@sorting", "@filters"] }, () => {
    test.beforeEach(async ({ homePage }) => {
        await homePage.goToHomePage();
    });

    /**
     * @testrail 19
     */
    test("should sort products by price from low to high", async ({ homePage, filtersComponent }) => {
        await filtersComponent.sortBy("price", "asc");

        const priceElements = await homePage.productPrice.all();
        const prices = await Promise.all(
            priceElements.map(async (el) => {
                const text = await el.textContent();
                return parseFloat(text?.replace("$", "").trim() || "0");
            })
        );

        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
        }
    });

    /**
     * @testrail 20
     */
    test("should sort products by price from high to low", async ({ homePage, filtersComponent }) => {
        await filtersComponent.sortBy("price", "desc");

        const priceElements = await homePage.productPrice.all();
        const prices = await Promise.all(
            priceElements.map(async (el) => {
                const text = await el.textContent();
                return parseFloat(text?.replace("$", "").trim() || "0");
            })
        );

        for (let i = 1; i < prices.length; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
        }
    });

    /**
     * @testrail 21
     */
    test("should sort products by CO2 rating from A to E", async ({ homePage, filtersComponent }) => {
        await filtersComponent.sortBy("co2_rating", "asc");

        const productNames = await homePage.getAvailableProducts();
        const ratings = await Promise.all(productNames.map((name) => homePage.getCo2Rating(name)));

        const ratingValues = ratings.map((rating) => {
            const map = { A: 1, B: 2, C: 3, D: 4, E: 5 };
            return map[rating] || 0;
        });

        for (let i = 1; i < ratingValues.length; i++) {
            expect(ratingValues[i]).toBeGreaterThanOrEqual(ratingValues[i - 1]);
        }
    });
});
