/**
 * @class CheckoutPage
 */
class CheckoutPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.cartLink = page.getByTestId("nav-cart");

        this.cartStepIndicator = page.locator("li").filter({ hasText: "Cart" }).first();
        this.signInStepIndicator = page.locator("li").filter({ hasText: "Sign in" }).first();
        this.billingAddressStepIndicator = page.locator("li").filter({ hasText: "Billing Address" }).first();
        this.paymentStepIndicator = page.locator("li").filter({ hasText: "Payment" }).first();

        this.productTitle = page.getByTestId("product-title");
        this.productQuantityInput = page.getByTestId("product-quantity");
        this.productPrice = page.getByTestId("product-price");
        this.linePrice = page.getByTestId("line-price");
        this.cartTotal = page.getByTestId("cart-total");
        this.deleteItemButton = page.locator(".btn.btn-danger").last();
        this.continueShoppingButton = page.getByTestId("continue-shopping");
        this.proceedButton = page.locator("[data-test^='proceed-']");

        this.streetInput = page.getByTestId("street");
        this.cityInput = page.getByTestId("city");
        this.stateInput = page.getByTestId("state");
        this.countryInput = page.getByTestId("country");
        this.postalCodeInput = page.getByTestId("postal_code");
        this.proceedToCheckoutStep3Button = page.getByTestId("proceed-3");
        this.paymentMethodDropdown = page.getByTestId("payment-method");
        this.confirmButton = page.getByTestId("finish");

        // Payment method: Credit Card
        this.creditCardNumberInput = page.getByTestId("credit_card_number");
        this.expirationDateInput = page.getByTestId("expiration_date");
        this.cvvInput = page.getByTestId("cvv");
        this.cardHolderNameInput = page.getByTestId("card_holder_name");

        // Payment method: Bank Transfer
        this.bankNameInput = page.getByTestId("bank_name");
        this.accountNameInput = page.getByTestId("account_name");
        this.accountNumberInput = page.getByTestId("account_number");

        // Payment method: Gift Card
        this.giftCardNumberInput = page.getByTestId("gift_card_number");
        this.validationCodeInput = page.getByTestId("validation_code");
    }

    /**
     * Navigates to the checkout page
     */
    async goToCheckout() {
        await this.cartLink.click();
    }

    /**
     * Clicks the proceed button for any checkout step
     * Automatically clicks the visible proceed button
     */
    async proceedToCheckout() {
        await this.proceedButton.filter({ visible: true }).click();
    }

    /**
     * Gets the product title from the cart
     * @returns {Promise<string>} The product title
     */
    async getProductTitle() {
        const title = await this.productTitle.textContent();
        return title?.trim() ?? "";
    }

    /**
     * Gets the cart total amount
     * @returns {Promise<string>} The cart total
     */
    async getCartTotal() {
        const total = await this.cartTotal.textContent();
        return total?.trim() ?? "";
    }

    /**
     * Gets the product unit price
     * @returns {Promise<string>} The product unit price
     */
    async getProductPrice() {
        const price = await this.productPrice.textContent();
        return price?.trim() ?? "";
    }

    /**
     * Updates the product quantity in the cart
     * @param {number} quantity - The new quantity
     */
    async updateQuantity(quantity) {
        await this.productQuantityInput.fill(quantity.toString());
    }

    /**
     * Deletes the product from the cart
     */
    async deleteProduct() {
        await this.deleteItemButton.click();
    }

    /**
     * Fills in the billing address form
     * @param {Object} addressData
     * @param {string} addressData.street
     * @param {string} addressData.city
     * @param {string} addressData.state
     * @param {string} addressData.country
     * @param {string} addressData.postal_code
     */
    async fillBillingAddress(addressData) {
        await this.streetInput.fill(addressData.street);
        await this.cityInput.fill(addressData.city);
        await this.stateInput.fill(addressData.state);
        await this.countryInput.fill(addressData.country);
        await this.postalCodeInput.fill(addressData.postal_code);
    }

    /**
     * Selects a payment method from the dropdown
     * @param {string} method - Payment method (e.g., "Credit Card", "Bank Transfer", "Gift Card", "Cash on Delivery", "Buy Now Pay Later")
     */
    async selectPaymentMethod(method) {
        await this.paymentMethodDropdown.selectOption(method);
    }

    /**
     * Fills in credit card payment details
     * @param {Object} cardData
     * @param {string} cardData.cardNumber - Credit card number
     * @param {string} cardData.expirationDate - Expiration date (MM/YY)
     * @param {string} cardData.cvv - CVV code
     * @param {string} cardData.cardHolderName - Card holder name
     */
    async fillCreditCardDetails(cardData) {
        await this.creditCardNumberInput.fill(cardData.cardNumber);
        await this.expirationDateInput.fill(cardData.expirationDate);
        await this.cvvInput.fill(cardData.cvv);
        await this.cardHolderNameInput.fill(cardData.cardHolderName);
    }

    /**
     * Confirms the payment and completes the checkout
     */
    async confirmPayment() {
        await this.confirmButton.click();
    }
}

export default CheckoutPage;
