import { faker } from "@faker-js/faker";

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
        country: faker.location.country(),
        postal_code: faker.location.zipCode(),
        phone: faker.string.numeric({ length: 10 }),
        dob: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString().split("T")[0],
        password: generatePassword(),
        email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@${faker.internet.domainName()}`
    };
}
