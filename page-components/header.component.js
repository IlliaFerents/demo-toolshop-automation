/**
 * @class HeaderComponent
 */
class HeaderComponent {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.homeLink = page.getByTestId("nav-home");
        this.categoriesButton = page.getByTestId("nav-categories");
        this.contactLink = page.getByTestId("nav-contact");
        this.signInLink = page.getByTestId("nav-sign-in");
        this.cartLink = page.getByTestId("nav-cart");
        this.languageSelectButton = page.getByTestId("language-select");
    }

    async selectLanguage(lang) {
        await this.languageSelectButton.click();
        await this.page.getByTestId(`lang-${lang.toLowerCase()}`).click();
    }
}

export default HeaderComponent;
