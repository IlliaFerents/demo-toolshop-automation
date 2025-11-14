import { test } from "../../fixtures/page_fixtures";

test.describe("Product Page Accessibility", { tag: "@a11y" }, () => {
    /**
     * @testrail 28
     */
    test("random product page meets accessibility standards", async ({ homePage, a11y }) => {
        await homePage.goToHomePage();
        await homePage.clickRandomProduct();

        const results = await a11y.analyze();
        a11y.assertNoViolations(results);
    });
});
