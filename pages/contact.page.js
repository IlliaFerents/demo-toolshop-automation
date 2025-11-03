/**
 * @class ContactPage
 */
class ContactPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.firstNameInput = page.getByTestId("first-name");
        this.lastNameInput = page.getByTestId("last-name");
        this.emailInput = page.getByTestId("email");
        this.subjectSelect = page.getByTestId("subject");
        this.messageTextarea = page.getByTestId("message");
        this.attachmentInput = page.getByTestId("attachment");
        this.sendButton = page.getByTestId("contact-submit");
        this.contactHeading = page.getByRole("heading", { name: "Contact" });
    }

    /**
     * Fills the contact form input fields
     * @param {Object} formData
     * @param {string} formData.firstName
     * @param {string} formData.lastName
     * @param {string} formData.email
     * @param {string} formData.message
     */
    async fillForm({ firstName, lastName, email, message }) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.messageTextarea.fill(message);
    }

    /**
     * Selects a subject from the dropdown
     * @param {string} subject
     */
    async selectSubject(subject) {
        await this.subjectSelect.selectOption(subject);
    }

    /**
     * Adds an attachment to the form
     * @param {string} file - Path to the file
     */
    async addAttachment(file) {
        await this.attachmentInput.setInputFiles(file);
    }
}

export default ContactPage;
