import { test as base } from "@playwright/test";
import LoginPage from "../pages/login.page";
import RegistrationPage from "../pages/register.page";
import ContactPage from "../pages/contact.page";
import HeaderComponent from "../page-components/header.component";
import FiltersComponent from "../page-components/filters.component";
import UserAPI from "../util/api/user";

export const test = base.extend({
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
    }
});

export { expect } from "@playwright/test";
