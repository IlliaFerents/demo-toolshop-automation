import { faker } from "@faker-js/faker";

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
        address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            country: faker.location.country(),
            postal_code: faker.location.zipCode()
        },
        phone: faker.string.numeric({ length: 10 }),
        dob: faker.date.birthdate({ min: 18, max: 65, mode: "age" }).toISOString().split("T")[0],
        password: faker.internet.password({ length: 12 }),
        email: `${first_name.toLowerCase()}.${last_name.toLowerCase()}@${faker.internet.domainName()}`
    };
}
