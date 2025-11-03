import { test, expect } from "../fixtures/page_fixtures";
import * as randomData from "../util/random_data_generator/user";
import * as path from "path";

test.describe("Contact Form", { tag: "@contact_form" }, () => {
    const testAttachmentPath = path.join(process.cwd(), "test-data/attachments/test_attachment.txt");
    const invalidAttachmentPath = path.join(process.cwd(), "test-data/attachments/test_attachment_2.txt");

    test.beforeEach(async ({ contactPage, page }) => {
        await page.goto("/contact");
        await expect(contactPage.contactHeading).toBeVisible();
    });

    /**
     * @testrail C1
     */
    test("contact form with attachment is successfully submitted", async ({ contactPage, page }) => {
        const userData = randomData.generateUserSignUpData();
        const message = randomData.generateMessage();

        await contactPage.fillForm({
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            message: message
        });

        await contactPage.selectSubject("Customer service");
        await contactPage.addAttachment(testAttachmentPath);
        await contactPage.sendButton.click();

        await expect(page.getByText("Thanks for your message! We will contact you shortly.")).toBeVisible();
    });

    /**
     * @testrail C2
     */
    test("error message is displayed for non-empty attachment", async ({ contactPage, page }) => {
        const userData = randomData.generateUserSignUpData();
        const message = randomData.generateMessage();

        await contactPage.fillForm({
            firstName: userData.first_name,
            lastName: userData.last_name,
            email: userData.email,
            message: message
        });

        await contactPage.selectSubject("Return");
        await contactPage.addAttachment(invalidAttachmentPath);

        await contactPage.sendButton.click();

        await expect(page.getByText("File should be empty.")).toBeVisible();
    });
});
