import { faker } from "@faker-js/faker";
import { COUNTRY_CODES } from "../constants/countries.js";

/**
 * Generates a valid password matching the schema requirements
 * @returns {string} A valid password
 */
export function generatePassword() {
    const uppercase = faker.string.alpha({ length: 2, casing: "upper" });
    const lowercase = faker.string.alpha({ length: 2, casing: "lower" });
    const numbers = faker.string.numeric({ length: 2 });
    const special = faker.helpers.arrayElement(["@", "#", "$", "%", "!", "&"]);
    const random = faker.string.alpha({ length: 2 });

    return faker.helpers.shuffle([...uppercase, ...lowercase, ...numbers, special, ...random]).join("");
}

/**
 * Generates a random email address
 * @returns {string} A random email address
 */
export function generateEmail() {
    return faker.internet.email();
}
/**
 * Generates random user data matching the schema.
 * @returns {Object} Random user data object.
 */
export function generateUserSignUpData() {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();

    return {
        first_name,
        last_name,
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.helpers.arrayElement(COUNTRY_CODES),
        postal_code: faker.location.zipCode(),
        phone: faker.string.numeric({ length: 10 }),
        dob: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString().split("T")[0],
        password: generatePassword(),
        email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@${faker.internet.domainName()}`
    };
}

/**
 * Generates a random message between 50 to 100 characters
 * @returns {string} A random message with 50-100 characters
 */
export function generateMessage() {
    let message = "";
    while (message.length < 50) {
        message += faker.lorem.sentence();
    }
    return message.substring(0, 100);
}

/**
 * Returns a random element from the provided array
 * @param {Array} arr - The array to pick a random element from
 * @returns {*} A random element from the array
 */
export function getRandomArrayElement(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
        throw new Error("Input must be a non-empty array");
    }
    return faker.helpers.arrayElement(arr);
}

/**
 * Generates random credit card details matching application validation rules
 * @returns {Object} Credit card details object
 * @returns {string} cardNumber - Credit card number in format 0000-0000-0000-0000 (16 digits with hyphens)
 * @returns {string} expirationDate - Expiration date in format MM/YYYY
 * @returns {string} cvv - 3-digit CVV code
 * @returns {string} cardHolderName - Card holder's full name in uppercase
 */
export function generateCardDetails() {
    const cardNumber = faker.finance.creditCardNumber({ issuer: "####-####-####-####" });

    const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, "0");
    const currentYear = new Date().getFullYear();
    const futureYear = faker.number.int({ min: currentYear + 1, max: currentYear + 5 });
    const expirationDate = `${month}/${futureYear}`;

    const cvv = faker.finance.creditCardCVV();

    const cardHolderName = faker.person.fullName().toUpperCase();

    return {
        cardNumber,
        expirationDate,
        cvv,
        cardHolderName
    };
}
