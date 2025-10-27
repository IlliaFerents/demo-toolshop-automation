import axios from "axios";
import { generateRandomUser } from "../random_data_generator/user.js";
import { getAuthToken } from "../auth/get_auth_token";

/**
 * Registers a new user via API.
 * @param {Object} userData - The user data to register (defaults to random data).
 * @returns {Promise<Object>} The registered user data.
 * @example
 * // Register with random data
 * await registerUser();
 * @example
 * // Register with custom data
 * await registerUser({
 *   first_name: 'John',
 *   last_name: 'Doe',
 *   address: { street: 'Street 1', city: 'City', state: 'State', country: 'Country', postal_code: '1234AA' },
 *   phone: '0987654321',
 *   dob: '1970-01-01',
 *   password: 'SuperSecure@123',
 *   email: 'john@doe.example'
 * });
 */
export async function registerUser(userData = generateRandomUser()) {
    try {
        const response = await axios.post("https://api.practicesoftwaretesting.com/users/register", userData);
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.response?.statusText || error.message;
        throw new Error(`Registration failed: ${error.response?.status || "Network error"} - ${message}`);
    }
}

/**
 * Logs in a user via API.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The login response data.
 * @example
 * await loginUser('john@doe.example', 'SuperSecure@123');
 */
export async function loginUser(email, password) {
    try {
        const response = await axios.post("https://api.practicesoftwaretesting.com/users/login", { email, password });
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.response?.statusText || error.message;
        throw new Error(`Login failed: ${error.response?.status || "Network error"} - ${message}`);
    }
}

/**
 * Retrieves the current user's information.
 * @param {import('@playwright/test').Page} page - The Playwright page object.
 * @returns {Promise<Object>} The user information object.
 */
export async function getCurrentUserInfo(page) {
    const token = await getAuthToken(page);

    if (!token) {
        throw new Error("Authorization token is missing. Please log in.");
    }

    try {
        const response = await axios.get("https://api.practicesoftwaretesting.com/users/me", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch user info: ${error.response?.data?.message || error.message}`);
    }
}
