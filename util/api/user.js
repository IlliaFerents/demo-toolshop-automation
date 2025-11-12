import axios from "axios";
import { generateUserSignUpData } from "../random_data_generator/user.js";
import { getAuthToken } from "../auth/get_auth_token";

/**
 * @class UserAPI
 * Handles all user-related API operations
 */
class UserAPI {
    #baseURL = "https://api.practicesoftwaretesting.com";
    #token = null;
    #page = null;

    constructor(page) {
        this.#page = page;
    }

    /**
     * Lazily retrieves the auth token when needed
     * @private
     * @returns {Promise<string>} The auth token
     */
    async #getToken() {
        if (!this.#token) {
            this.#token = await getAuthToken(this.#page);
        }
        return this.#token;
    }

    /**
     * Registers a new user via API.
     * @param {Object} userData - The user data to register (defaults to random data).
     * @returns {Promise<Object>} The registered user data.
     * @example
     * // Register with random data
     * const userAPI = new UserAPI(page);
     * await userAPI.register();
     * @example
     * // Register with custom data
     * const userAPI = new UserAPI(page);
     * await userAPI.register({
     *   first_name: 'John',
     *   last_name: 'Doe',
     *   address: { street: 'Street 1', city: 'City', state: 'State', country: 'Country', postal_code: '1234AA' },
     *   phone: '0987654321',
     *   dob: '1970-01-01',
     *   password: 'SuperSecure@123',
     *   email: 'john@doe.example'
     * });
     */
    async register(userData = generateUserSignUpData()) {
        try {
            const response = await axios.post(`${this.#baseURL}/users/register`, userData);
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
     * const userAPI = new UserAPI(page);
     * await userAPI.login('john@doe.example', 'SuperSecure@123');
     */
    async login(email, password) {
        try {
            const response = await axios.post(`${this.#baseURL}/users/login`, { email, password });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.response?.statusText || error.message;
            throw new Error(`Login failed: ${error.response?.status || "Network error"} - ${message}`);
        }
    }

    /**
     * Retrieves the current user's information.
     * @returns {Promise<Object>} The user information object.
     * @throws {Error} If authorization token is missing.
     * @example
     * const userAPI = new UserAPI(page);
     * const userInfo = await userAPI.getCurrentUserInfo();
     */
    async getCurrentUserInfo() {
        const token = await this.#getToken();

        if (!token) {
            throw new Error("Authorization token is missing. Please log in first.");
        }

        try {
            const response = await axios.get(`${this.#baseURL}/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Failed to fetch user info: ${error.response?.data?.message || error.message}`);
        }
    }
}

export default UserAPI;
