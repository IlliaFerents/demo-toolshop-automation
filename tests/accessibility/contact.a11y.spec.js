import { test, expect } from "../../fixtures/page_fixtures";
import { URLS } from "../../util/constants/urls.js";

test.describe("Contact Page Accessibility", { tag: "@a11y" }, () => {
    /**
     * @testrail 25
     */
    test("contact page meets accessibility standards", async ({ page, a11y }) => {
        await page.goto(URLS.CONTACT);
        expect(page.url()).toContain(URLS.CONTACT);

        const results = await a11y.analyze();
        a11y.assertNoViolations(results);
    });
});
