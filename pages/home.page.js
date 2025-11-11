/**
 * @class HomePage
 */
import { getRandomArrayElement } from "../util/random_data_generator/user.js";

class HomePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.productName = page.getByTestId("product-name");
        this.productPrice = page.getByTestId("product-price");
        this.productImage = page.locator(".card-img-top");
        this.productCo2Badge = page.getByTestId("co2-rating-badge");
        this.paginationPrevious = page.getByRole("link", { name: "Previous" });
        this.paginationNext = page.getByRole("link", { name: "Next" });
    }

    /**
     * Navigates to the home page
     */
    async goToHomePage() {
        await this.page.goto("/");
    }

    /**
     * Selects a specific pagination page
     * @param {number} pageNumber - The page number to navigate to
     */
    async selectPage(pageNumber) {
        await this.page.getByRole("link", { name: `Page-${pageNumber}` }).click();
    }

    /**
     * Returns an array of product names visible on the page
     * @returns {Promise<string[]>} Array of product names
     */
    async getAvailableProducts() {
        await this.productName.first().waitFor({ state: "visible" });
        const productElements = await this.productName.all();
        const productNames = await Promise.all(productElements.map(async (element) => await element.textContent()));

        return productNames.map((name) => name.trim());
    }

    /**
     * Gets a random product name from available products
     * @returns {Promise<string>} A random product name
     */
    async getRandomProductName() {
        const availableProducts = await this.getAvailableProducts();
        const randomProduct = getRandomArrayElement(availableProducts);

        return randomProduct;
    }

    /**
     * Clicks on a product by its name
     * @param {string} productName - The name of the product to click
     */
    async clickProduct(productName) {
        await this.productName.getByText(productName, { exact: true }).click();
    }

    /**
     * Clicks on a random product from the available products
     * @returns {Promise<string>} The name of the product that was clicked
     */
    async clickRandomProduct() {
        const randomProduct = await this.getRandomProductName();
        await this.clickProduct(randomProduct);

        return randomProduct;
    }

    /**
     * Gets the CO2 rating for a specific product
     * @param {string} productName - The name of the product
     * @returns {Promise<string>} The CO2 rating (A, B, C, D, or E)
     */
    async getCo2Rating(productName) {
        const productCard = this.page.locator(".card").filter({ hasText: productName }).first();
        const activeRatingSpan = productCard.locator(".co2-rating-scale .co2-letter.active");
        const ratingText = await activeRatingSpan.textContent();
        return ratingText?.trim() ?? "";
    }

    /**
     * Gets the price for a specific product
     * @param {string} productName - The name of the product
     * @returns {Promise<string>} The product price
     */
    async getProductPrice(productName) {
        const productCard = this.page.locator(".card").filter({ hasText: productName }).first();
        const priceElement = productCard.locator(this.productPrice);
        const price = await priceElement.textContent();
        return price?.trim() ?? "";
    }

    /**
     * Gets product information for a specific product
     * @param {string} productName - The name of the product
     * @returns {Promise<{name: string, co2rating: string, price: string}>} Product information object
     */
    async getProductInfo(productName) {
        const [rating, price] = await Promise.all([this.getCo2Rating(productName), this.getProductPrice(productName)]);

        return {
            name: productName,
            co2rating: rating,
            price: price
        };
    }
}

export default HomePage;
