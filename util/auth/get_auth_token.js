/**
 * Retrieves the auth token from localStorage.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<string|null>} The auth token or null if not found.
 */
export async function getAuthToken(page) {
    return await page.evaluate(() => localStorage.getItem("auth-token"));
}
