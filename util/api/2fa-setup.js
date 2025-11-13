import axios from "axios";
import { getAuthToken } from "../auth/get_auth_token";

/**
 * @class TwoFactorAuthAPI
 * Handles TOTP (Two-Factor Authentication) related API operations
 */
class TwoFactorAuthAPI {
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
     * Sets up TOTP (Two-Factor Authentication) for the user.
     * @returns {Promise<Object>} The TOTP setup data containing secret and QR code URL.
     * @throws {Error} If authorization token is missing or setup fails.
     * @example
     * const twoFactorAPI = new TwoFactorAuthAPI(page);
     * const totpSetup = await twoFactorAPI.setupTOTP();
     * console.log(totpSetup.secret); // Use this to generate TOTP codes
     */
    async setupTOTP() {
        const token = await this.#getToken();

        if (!token) {
            throw new Error("Authorization token is missing. Please log in first.");
        }

        try {
            const response = await axios.post(
                `${this.#baseURL}/totp/setup`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.response?.statusText || error.message;
            throw new Error(`TOTP setup failed: ${error.response?.status || "Network error"} - ${message}`);
        }
    }

    /**
     * Verifies and enables TOTP for the user.
     * NOTE: Despite Swagger documentation showing access_token in request body,
     * the actual API requires the token in the Authorization header.
     * @param {string} totpCode - The 6-digit TOTP code from the authenticator app.
     * @returns {Promise<Object>} The verification response data.
     * @throws {Error} If authorization token is missing or verification fails.
     * @example
     * const twoFactorAPI = new TwoFactorAuthAPI(page);
     * const result = await twoFactorAPI.verifyTOTP('123456');
     */
    async verifyTOTP(totpCode) {
        const token = await this.#getToken();

        if (!token) {
            throw new Error("Authorization token is missing. Please log in first.");
        }

        try {
            const response = await axios.post(
                `${this.#baseURL}/totp/verify`,
                { totp: totpCode },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.response?.statusText || error.message;
            throw new Error(`TOTP verification failed: ${error.response?.status || "Network error"} - ${message}`);
        }
    }
}

export default TwoFactorAuthAPI;
