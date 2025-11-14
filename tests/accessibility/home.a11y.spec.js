import { test, expect } from "../../fixtures/page_fixtures";
import { URLS } from "../../util/constants/urls.js";

test.describe("Home Page Accessibility", { tag: "@a11y" }, () => {
    /**
     * @testrail 26
     */
    test("home page meets accessibility standards", async ({ homePage, page, a11y }) => {
        await homePage.goToHomePage();
        expect(page.url()).toContain(URLS.HOME);

        const results = await a11y.analyze();
        a11y.assertNoViolations(results);
    });
});
