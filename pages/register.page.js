/**
 * @class RegistrationPage
 */
class RegistrationPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.registerForm = page.getByTestId("register-form");
        this.firstNameInput = page.getByTestId("first-name");
        this.lastNameInput = page.getByTestId("last-name");
        this.dobInput = page.getByTestId("dob");
        this.streetInput = page.getByTestId("street");
        this.postalCodeInput = page.getByTestId("postal_code");
        this.cityInput = page.getByTestId("city");
        this.stateInput = page.getByTestId("state");
        this.countryDropdown = page.getByTestId("country");
        this.phoneInput = page.getByTestId("phone");
        this.emailInput = page.getByTestId("email");
        this.passwordInput = page.getByTestId("password");
        this.registerButton = page.getByTestId("register-submit");
    }

    /**
     * Fills in the registration form with user details
     * @param {Object} userData
     * @param {string} userData.firstName
     * @param {string} userData.lastName
     * @param {string} userData.dob
     * @param {string} userData.street
     * @param {string} userData.postalCode
     * @param {string} userData.city
     * @param {string} userData.state
     * @param {string} userData.country
     * @param {string} userData.phone
     * @param {string} userData.email
     * @param {string} userData.password
     */
    async fillRegistrationForm(userData) {
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.dobInput.fill(userData.dob);
        await this.streetInput.fill(userData.street);
        await this.postalCodeInput.fill(userData.postalCode);
        await this.cityInput.fill(userData.city);
        await this.stateInput.fill(userData.state);
        await this.countryDropdown.selectOption(userData.country);
        await this.phoneInput.fill(userData.phone);
        await this.emailInput.fill(userData.email);
        await this.passwordInput.fill(userData.password);
    }

    /**
     * Submits the registration form
     */
    async clickRegister() {
        await this.registerButton.click();
    }

    /**
     * Registers with all user details
     * @param {Object} userData
     */
    async registerWithDetails(userData) {
        await this.fillRegistrationForm(userData);
        await this.clickRegister();
    }
}

export default RegistrationPage;
