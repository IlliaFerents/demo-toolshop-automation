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
}

export default ProductPage;
