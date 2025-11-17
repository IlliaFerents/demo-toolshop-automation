import { test as base } from "@playwright/test";
import LoginPage from "../pages/login.page";
import RegistrationPage from "../pages/register.page";
import ContactPage from "../pages/contact.page";
import ProductPage from "../pages/product.page";
import HomePage from "../pages/home.page";
import CheckoutPage from "../pages/checkout.page";
import HeaderComponent from "../page-components/header.component";
import FiltersComponent from "../page-components/filters.component";
import UserAPI from "../util/api/user";
import TwoFactorAuthAPI from "../util/api/2fa-setup";
import a11yFixtures from "./a11y_fixtures";

export const test = base.extend({
    ...a11yFixtures,
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    registrationPage: async ({ page }, use) => {
        const registrationPage = new RegistrationPage(page);
        await use(registrationPage);
    },
    contactPage: async ({ page }, use) => {
        const contactPage = new ContactPage(page);
        await use(contactPage);
    },
    productPage: async ({ page }, use) => {
        const productPage = new ProductPage(page);
        await use(productPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    checkoutPage: async ({ page }, use) => {
        const checkoutPage = new CheckoutPage(page);
        await use(checkoutPage);
    },
    headerComponent: async ({ page }, use) => {
        const headerComponent = new HeaderComponent(page);
        await use(headerComponent);
    },
    filtersComponent: async ({ page }, use) => {
        const filtersComponent = new FiltersComponent(page);
        await use(filtersComponent);
    },
    userAPI: async ({ page }, use) => {
        const userAPI = new UserAPI(page);
        await use(userAPI);
    },
    twoFactorAPI: async ({ page }, use) => {
        const twoFactorAPI = new TwoFactorAuthAPI(page);
        await use(twoFactorAPI);
    }
});

export { expect } from "@playwright/test";
