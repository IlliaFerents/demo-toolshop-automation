/**
 * @class ProductPage
 */
class ProductPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.productName = page.getByTestId("product-name");
        this.productPrice = page.getByTestId("unit-price");
        this.productDescription = page.getByTestId("product-description");
        this.addToCartButton = page.getByTestId("add-to-cart");
        this.addToFavoritesButton = page.getByTestId("add-to-favorites");
        this.productCo2Rating = page.getByTestId("co2-rating-badge");
        this.quantityInput = page.getByTestId("quantity");
        this.decreaseQuantityButton = page.getByTestId("decrease-quantity");
        this.increaseQuantityButton = page.getByTestId("increase-quantity");
    }

    /**
     * Adds the product to cart
     */
    async addToCart() {
        await this.addToCartButton.click();
    }

    /**
     * Adds the product to favorites
     */
    async addToFavorites() {
        await this.addToFavoritesButton.click();
    }

    /**
     * Fills the quantity input with the specified number
     * @param {number} num - The quantity to set
     */
    async fillQuantity(num) {
        await this.quantityInput.fill(num.toString());
    }

    /**
     * Gets the product name from the product page
     * @returns {Promise<string>} The product name
     */
    async getProductName() {
        const name = await this.productName.textContent();
        return name?.trim() ?? "";
    }

    /**
     * Gets the CO2 rating from the product page
     * @returns {Promise<string>} The CO2 rating (A, B, C, D, or E)
     */
    async getCo2Rating() {
        const activeRatingSpan = this.page.locator(".co2-rating-scale .co2-letter.active");
        const ratingText = await activeRatingSpan.textContent();
        return ratingText?.trim() ?? "";
    }
}

export default ProductPage;
