import { test, expect } from "../../../fixtures/page_fixtures";
import { URLS } from "../../../util/constants/urls.js";

test.describe("Login Page Accessibility", { tag: "@a11y" }, () => {
    /**
     * @testrail 27
     */
    test("login page meets accessibility standards", async ({ loginPage, page, a11y }) => {
        await loginPage.goToLogin();
        expect(page.url()).toContain(URLS.LOGIN);

        const results = await a11y.analyze();
        a11y.assertNoViolations(results);
    });
});
