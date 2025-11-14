import { test, expect } from "../../fixtures/page_fixtures";
import { URLS } from "../../util/constants/urls.js";

test.describe("Registration Page Accessibility", { tag: "@a11y" }, () => {
    /**
     * @testrail 29
     */
    test("registration page meets accessibility standards", async ({ loginPage, page, a11y }) => {
        await loginPage.goToLogin();
        await loginPage.registerAccountLink.click();
        expect(page.url()).toContain(URLS.REGISTER);

        const results = await a11y.analyze();
        a11y.assertNoViolations(results);
    });
});
