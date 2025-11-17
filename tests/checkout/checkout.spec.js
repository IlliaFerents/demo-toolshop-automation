import { test, expect } from "../../fixtures/page_fixtures";
import { generateCardDetails } from "../../util/random_data_generator/user";

test.describe("Checkout Flow", { tag: ["@checkout", "@payment"] }, () => {
    test.beforeEach(async ({ homePage, productPage, checkoutPage }) => {
        await homePage.goToHomePage();
        await homePage.clickRandomProduct();
        await productPage.addToCart();
        await checkoutPage.goToCheckout();
    });

    /**
     * @testrail 30
     */
    test("should complete checkout successfully with credit card payment", async ({ page, checkoutPage }) => {
        const productTitle = await checkoutPage.getProductTitle();
        expect(productTitle).toBeTruthy();

        await checkoutPage.proceedToCheckout();
        await checkoutPage.proceedToCheckout();

        await checkoutPage.proceedToCheckout();

        await checkoutPage.selectPaymentMethod("Credit Card");

        const cardData = generateCardDetails();
        await checkoutPage.fillCreditCardDetails(cardData);

        await checkoutPage.confirmPayment();

        await expect(page.getByText("Payment was successful")).toBeVisible();
    });

    /**
     * @testrail 31
     */
    test("should update cart total when quantity is changed", async ({ page, checkoutPage }) => {
        const unitPrice = await checkoutPage.getProductPrice();
        const unitAmount = parseFloat(unitPrice.replace("$", ""));

        const initialTotal = await checkoutPage.getCartTotal();
        const initialAmount = parseFloat(initialTotal.replace("$", ""));

        expect(initialAmount).toBe(unitAmount);

        await checkoutPage.updateQuantity(2);
        await page.locator("body").click();

        await expect(page.getByText("Product quantity updated.")).toBeVisible();

        const expectedTotal = `$${(unitAmount * 2).toFixed(2)}`;
        await expect(checkoutPage.cartTotal).toHaveText(expectedTotal);
    });

    /**
     * @testrail 32
     */
    test("should remove product from cart when delete is clicked", async ({ checkoutPage }) => {
        const productTitle = await checkoutPage.getProductTitle();
        expect(productTitle).toBeTruthy();

        await checkoutPage.deleteProduct();

        await expect(checkoutPage.page.getByText("The cart is empty. Nothing to display.")).toBeVisible();
    });
});
