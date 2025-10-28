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
        this.handToolsLink = page.getByTestId("nav-hand-tools");
        this.powerToolsLink = page.getByTestId("nav-power-tools");
        this.otherLink = page.getByTestId("nav-other");
        this.specialToolsLink = page.getByTestId("nav-special-tools");
        this.rentalsLink = page.getByTestId("nav-rentals");
        this.contactLink = page.getByTestId("nav-contact");
        this.signInLink = page.getByTestId("nav-sign-in");
        this.languageSelectButton = page.getByTestId("language-select");
    }

    async selectLanguage(lang) {
        await this.languageSelectButton.click();
        await this.page.getByTestId(`lang-${lang.toLowerCase()}`).click();
    }
}

export default HeaderComponent;
